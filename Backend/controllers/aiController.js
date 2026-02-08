require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../config/db"); 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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