require("dotenv").config();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const db = require("../config/db"); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================
// SAFETY SETTINGS PARA ANÁLISIS DE FÍSICO
// Contexto: App de gimnasio. Hombres sin camiseta son esperables.
// Pornografía o desnudez total DEBE ser bloqueada.
// ============================================
const physiqueSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// --- CONFIGURACIÓN DE SEGURIDAD ---
const DAILY_LIMIT = 5;    // Máximo rutinas por día
const CHAR_LIMIT = 120;   // Máximo caracteres en el input personalizado

exports.generateRoutine = async (req, res) => {
  const { objetivo, nivel, enfoque, musculos_custom, equipo } = req.body;
  const userId = req.user.id;

  // Variable para el conteo de uso (definida fuera para evitar ReferenceError)
  let usageCount = 0; 

  // ==========================================
  // 1. CONTROL DE LÍMITE DIARIO (Rate Limit)
  // ==========================================
  try {
      const [usage] = await db.query(
          `SELECT COUNT(*) as count FROM ai_logs 
           WHERE usuario_id = ? AND DATE(created_at) = CURDATE()`,
          [userId]
      );
      
      if (usage && usage.length > 0) {
          usageCount = usage[0].count;
      }

      if (usageCount >= DAILY_LIMIT) {
          return res.status(429).json({ 
              error: "LIMIT_REACHED", 
              message: `Has alcanzado tu límite diario de ${DAILY_LIMIT} rutinas. Vuelve mañana.` 
          });
      }
  } catch (err) {
      console.warn("⚠️ Advertencia: No se pudo verificar el límite diario (¿Tabla ai_logs existe?). Se permite el paso.", err.message);
  }

  // ==========================================
  // 2. VALIDACIÓN Y SEGURIDAD DE INPUTS
  // ==========================================
  if (!objetivo || !nivel || !enfoque) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  // A. Límite de longitud
  if (enfoque === "Personalizado" && musculos_custom && musculos_custom.length > CHAR_LIMIT) {
      return res.status(400).json({ error: `El texto es demasiado largo (Máx ${CHAR_LIMIT}).` });
  }

  // B. Filtro de Palabras Prohibidas (Safety Layer 1)
  const forbiddenTerms = ['matar', 'muerte', 'droga', 'sexo', 'hackear', 'política', 'odio', 'suicidio', 'bomba', 'arma'];
  if (enfoque === "Personalizado" && musculos_custom) {
      const promptLower = musculos_custom.toLowerCase();
      if (forbiddenTerms.some(term => promptLower.includes(term))) {
          return res.status(400).json({ error: "SAFETY_BLOCK", message: "Tu solicitud contiene términos no permitidos en Oxyra." });
      }
  }

  // Determinar el foco real
  const focoReal = (enfoque === "Personalizado") ? musculos_custom : enfoque;

  // Timeout de seguridad para la IA
  res.setTimeout(60000); 

  try {
    console.log(`🤖 Generando Rutina IA (${usageCount + 1}/${DAILY_LIMIT}) para Usuario ID: ${userId}...`);

    // ==========================================
    // 3. GENERACIÓN CON GEMINI
    // ==========================================
    // NOTA: Usa 'gemini-2.5-flash' es el estándar actual rápido y estable.
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" },
    });

    // --- EL MEJOR PROMPT POSIBLE (INGENIERÍA DE PROMPTS) ---
    const prompt = `
            Actúa como un Entrenador de Élite experto en biomecánica para la app Oxyra.
            
            MISIÓN: Crear una SESIÓN DE ENTRENAMIENTO ÚNICA (No una semana, solo el entrenamiento de HOY).
            
            CONTEXTO DEL USUARIO:
            - Enfoque de la sesión: "${focoReal}" (Ej: Pecho, Triceps y Hombro, Solo Pierna, etc).
            - Objetivo: ${objetivo}
            - Nivel: ${nivel}
            - Equipo disponible: ${equipo}

            PROTOCOLOS DE SEGURIDAD (Safety Layer 2):
            1. Si el usuario pide algo NO relacionado con fitness/deporte (ej: recetas, código, chistes), RESPONDE: {"error": "OFF_TOPIC"}.
            2. Si es peligroso, RESPONDE: {"error": "UNSAFE"}.

            REGLAS DE DISEÑO DE RUTINA:
            1. Genera entre 6 y 9 ejercicios como máximo. Calidad > Cantidad.
            2. Prioriza ejercicios compuestos al principio y aislamiento al final.
            3. Usa nombres de ejercicios ESTÁNDAR en ESPAÑOL (Ej: "Press Banca", "Sentadilla").
            4. El "nombre_rutina" debe ser corto, impactante y sin la palabra "Rutina" (Ej: "Pectoral de Acero", "Pierna Voluminosa", "Fuerza Total").

            FORMATO DE RESPUESTA JSON (ESTRICTO):
            {
                "nombre_rutina": "Título Corto",
                "descripcion": "Breve explicación estratégica de la sesión (máx 20 palabras)",
                "ejercicios": [
                    {
                        "nombre": "Nombre del Ejercicio",
                        "grupo_muscular": "Músculo Principal",
                        "series": 4,
                        "reps": "8-10",
                        "descanso_segundos": 90
                    }
                ]
            }
        `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Limpieza de Markdown (Gemini a veces devuelve ```json ... ```)
    const cleanText = text.replace(/```json|```/g, '').trim();
    
    let rutinaJSON;
    try {
        rutinaJSON = JSON.parse(cleanText);
    } catch (parseError) {
        console.error("❌ Error parseando JSON de IA:", cleanText);
        return res.status(500).json({ error: "La IA generó una respuesta inválida. Intenta de nuevo." });
    }

    // Validación de respuesta de seguridad
    if (rutinaJSON.error === "OFF_TOPIC") return res.status(400).json({ error: "Solo puedo crear rutinas de ejercicio." });
    if (rutinaJSON.error === "UNSAFE") return res.status(400).json({ error: "Solicitud rechazada por seguridad." });

    // ==========================================
    // 4. GUARDADO EN BASE DE DATOS
    // ==========================================

    // A. Insertar Rutina (Cabecera) - Marcamos creada_por_ia = 1
    const [rutinaResult] = await db.query(
      `INSERT INTO rutinas (usuario_id, nombre, objetivo, nivel_dificultad, creada_por_ia, descripcion) 
       VALUES (?, ?, ?, ?, 1, ?)`,
      [userId, rutinaJSON.nombre_rutina, objetivo, nivel, rutinaJSON.descripcion]
    );
    const idRutina = rutinaResult.insertId;

    // B. Procesar Ejercicios
    let orden = 1;
    for (const ej of rutinaJSON.ejercicios) {
        let idEjercicio;
        
        // Evitar duplicar ejercicios en la tabla 'ejercicios'
        const [ejExistente] = await db.query("SELECT idEjercicio FROM ejercicios WHERE nombre = ? LIMIT 1", [ej.nombre]);

        if (ejExistente.length > 0) {
          idEjercicio = ejExistente[0].idEjercicio;
        } else {
          const [nuevoEj] = await db.query("INSERT INTO ejercicios (nombre, grupo_muscular) VALUES (?, ?)", [ej.nombre, ej.grupo_muscular || "General"]);
          idEjercicio = nuevoEj.insertId;
        }

        // Vincular ejercicio a la rutina
        await db.query(
          `INSERT INTO rutina_detalles (rutina_id, ejercicio_id, orden, series_objetivo, reps_objetivo, descanso_segundos)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [idRutina, idEjercicio, orden++, ej.series, ej.reps, ej.descanso_segundos]
        );
    }

    // ==========================================
    // 5. REGISTRAR LOG DE USO
    // ==========================================
    try {
        await db.query("INSERT INTO ai_logs (usuario_id) VALUES (?)", [userId]);
    } catch (e) { /* Silencioso si falla el log */ }

    // ==========================================
    // 6. RESPUESTA AL FRONTEND (CON ICONO IA)
    // ==========================================
    
    // Construimos el objeto final manualmente para asegurar que 'creada_por_ia' sea 1.
    // Esto es lo que soluciona que el icono no salga hasta recargar.
    const rutinaFinal = {
      idRutina: idRutina,
      usuario_id: userId,
      nombre: rutinaJSON.nombre_rutina,       // Asegurar compatibilidad de nombres
      nombre_rutina: rutinaJSON.nombre_rutina,
      objetivo: objetivo,
      nivel: nivel,
      descripcion: rutinaJSON.descripcion,
      creada_por_ia: 1, // <--- ¡AQUÍ ESTÁ LA CLAVE DEL ICONO!
      ejercicios: rutinaJSON.ejercicios
    };

    console.log("✅ Rutina IA guardada correctamente. ID:", idRutina);

    res.json({
      success: true,
      message: "Rutina generada",
      rutina: rutinaFinal 
    });

  } catch (err) {
    console.error("❌ ERROR CRÍTICO IA:", err);
    res.status(500).json({ error: "Error interno del sistema IA.", details: err.message });
  }
};

// ============================================
// ANALYZE PHYSIQUE — Escaneo de Físico con IA
// ============================================
const SCAN_DAILY_LIMIT = 3; // Máximo escaneos por día (estricto)

const PHYSIQUE_SYSTEM_PROMPT = `Actúa como un Juez Profesional de la IFBB con ojo clínico para la estética, el volumen y la definición. Analiza el físico de este atleta basándote en las imágenes de Frente y Espalda. 

LOGICA DE EVALUACIÓN (Sé justo y preciso):
1. El usuario se queja de que la IA es "tacaña" o valora muy por debajo. 
2. Si ves un físico con desarrollo muscular claro (culturista, fitness avanzado, crossfitter de élite), DEBES usar los rangos superiores.
3. No reserves 'OXYRA' solo para lo imposible; úsalo para físicos de nivel profesional o estética excepcional (estriaciones, vascularidad, gran masa).
4. 'Platino' y 'Esmeralda' son para atletas avanzados con buena separación.

Escala de Rangos (De menor a mayor):
[Hierro, Bronce, Plata, Oro, Platino, Esmeralda, Diamante, Campeon, Oxyra]

Criterios de Referencia:
- Hierro/Bronce: Principiante, poca masa, base aeróbica.
- Plata/Oro: Nivel intermedio, formas visibles, se nota que entrena.
- Platino/Esmeralda: Atleta avanzado, buena musculatura, abdominales definidos, hombros redondos.
- Diamante/Campeon: Nivel competición, gran volumen, cortes profundos, venas visibles.
- Oxyra: Nivel Élite / Pro. Desarrollo masivo y definición extrema.

Grupos a evaluar: Pecho, Espalda, Hombro, Bíceps, Tríceps, Cuadriceps, Abdomen, Femoral, Glúteo, Gemelo.

Salida Requerida: Devuelve SOLO un objeto JSON con esta estructura:
{
  "analisis_general": "Resumen técnico de 2 frases enfatizando mejoras y puntos fuertes.",
  "musculos": [
    { "grupo": "Pecho", "rango": "..." },
    { "grupo": "Espalda", "rango": "..." },
    { "grupo": "Hombro", "rango": "..." },
    { "grupo": "Bíceps", "rango": "..." },
    { "grupo": "Tríceps", "rango": "..." },
    { "grupo": "Cuadriceps", "rango": "..." },
    { "grupo": "Abdomen", "rango": "..." },
    { "grupo": "Femoral", "rango": "..." },
    { "grupo": "Glúteo", "rango": "..." },
    { "grupo": "Gemelo", "rango": "..." }
  ]
}`;

exports.analyzePhysique = async (req, res) => {
    const userId = req.user.id;

    // ==========================================
    // 1. VALIDACIÓN DE ARCHIVOS SUBIDOS
    // ==========================================
    const frontFile = req.files?.front?.[0];
    const backFile = req.files?.back?.[0];

    if (!frontFile || !backFile) {
        return res.status(400).json({
            error: 'MISSING_IMAGES',
            message: 'Debes enviar dos fotos: una de frente (front) y una de espalda (back).'
        });
    }

    // ==========================================
    // 2. CHECK LÍMITE DIARIO (3 escaneos/día)
    // ==========================================
    try {
        const [usage] = await db.query(
            `SELECT COUNT(*) as count FROM ai_logs 
             WHERE usuario_id = ? AND tipo_accion = 'escaneo_corporal' AND DATE(created_at) = CURDATE()`,
            [userId]
        );

        const todayCount = usage?.[0]?.count || 0;

        if (todayCount >= SCAN_DAILY_LIMIT) {
            return res.status(429).json({
                error: 'LIMIT_REACHED',
                message: `Has alcanzado tu límite diario de ${SCAN_DAILY_LIMIT} escaneos. Vuelve mañana.`,
                remaining: 0
            });
        }
    } catch (err) {
        console.warn("⚠️ No se pudo verificar límite de escaneos:", err.message);
    }

    // ==========================================
    // 3. PREPARAR IMÁGENES PARA GEMINI VISION
    // ==========================================
    const frontImagePart = {
        inlineData: {
            data: frontFile.buffer.toString('base64'),
            mimeType: frontFile.mimetype
        }
    };

    const backImagePart = {
        inlineData: {
            data: backFile.buffer.toString('base64'),
            mimeType: backFile.mimetype
        }
    };

    res.setTimeout(90000);

    try {
        console.log(`🔍 Escaneo de Físico IA para Usuario ID: ${userId}...`);

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            safetySettings: physiqueSafetySettings,
            generationConfig: { 
                responseMimeType: "application/json",
                temperature: 0.4 // Un poco más de temperatura para evitar valoraciones "robots" repetitivas
            },
        });

        const result = await model.generateContent([
            PHYSIQUE_SYSTEM_PROMPT,
            frontImagePart,
            backImagePart
        ]);

        const response = result.response;
        if (!response.candidates || response.candidates.length === 0) {
            return res.status(422).json({ error: 'SAFETY_BLOCK', message: 'La IA bloqueó el análisis por seguridad.' });
        }

        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY') {
            return res.status(422).json({ error: 'SAFETY_BLOCK', message: 'Bloqueado por seguridad.' });
        }

        const rawText = response.text();
        const cleanText = rawText.replace(/```json|```/g, '').trim();

        let analysisJSON;
        try {
            analysisJSON = JSON.parse(cleanText);
        } catch (parseError) {
            return res.status(500).json({ error: 'PARSE_ERROR', message: 'Error al procesar la respuesta de la IA.' });
        }

        if (analysisJSON.error === 'INVALID_IMAGE') {
            return res.status(400).json({ error: 'INVALID_IMAGE', message: 'La IA no detecta un cuerpo humano válido.' });
        }

        // ==========================================
        // 7. PERSISTENCIA: ACTUALIZAR RANGOS EN DB
        // ==========================================
        // Mapeo de grupos IA -> Grupos DB (Basado en BodyFront/Back)
        const dbMapping = {
            "Pecho": ["Pecho"],
            "Espalda": ["Espalda Alta", "Espalda Media", "Espalda Baja"],
            "Hombro": ["Hombro"],
            "Bíceps": ["Bíceps"],
            "Tríceps": ["Tríceps"],
            "Cuadriceps": ["Cuadriceps"],
            "Abdomen": ["Abdomen"],
            "Femoral": ["Femoral"],
            "Glúteo": ["Gluteo"],
            "Gemelo": ["Gemelo"]
        };

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            for (const muscleItem of analysisJSON.musculos) {
                const targets = dbMapping[muscleItem.grupo] || [muscleItem.grupo];
                
                for (const targetGroup of targets) {
                    await connection.query(
                        `INSERT INTO stats_musculares (usuario_id, grupo_muscular, rango_actual, fuerza_teorica_max)
                         VALUES (?, ?, ?, 0.0)
                         ON DUPLICATE KEY UPDATE rango_actual = ?`,
                        [userId, targetGroup, muscleItem.rango, muscleItem.rango]
                    );
                }
            }

            await connection.commit();
            console.log(`✅ Rangos actualizados en DB para Usuario ID: ${userId}`);
        } catch (dbErr) {
            await connection.rollback();
            console.error("❌ Error actualizando stats_musculares:", dbErr);
        } finally {
            connection.release();
        }

        // Registrar log de éxito
        await db.query(
            "INSERT INTO ai_logs (usuario_id, tipo_accion, status) VALUES (?, 'escaneo_corporal', 'success')",
            [userId]
        ).catch(() => {});

        // Calcular escaneos restantes para el frontend
        const [updatedUsage] = await db.query(
            `SELECT COUNT(*) as count FROM ai_logs 
             WHERE usuario_id = ? AND tipo_accion = 'escaneo_corporal' AND DATE(created_at) = CURDATE()`,
            [userId]
        );
        const remaining = Math.max(0, SCAN_DAILY_LIMIT - (updatedUsage?.[0]?.count || 0));

        res.json({
            success: true,
            message: 'Análisis completado y rangos actualizados.',
            data: analysisJSON,
            remaining_scans: remaining
        });

    } catch (err) {
        console.error("❌ ERROR CRÍTICO ESCANEO:", err);
        res.status(500).json({ error: 'INTERNAL_ERROR', details: err.message });
    }
};
