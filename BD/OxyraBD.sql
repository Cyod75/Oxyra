DROP DATABASE IF EXISTS Oxyra;
CREATE DATABASE Oxyra CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Oxyra;

-- ==========================================================
-- 1. USUARIOS (Perfil, Login y Gamificación Global)
-- ==========================================================
CREATE TABLE usuarios (
  idUsuario INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE, -- El identificador único (@usuario)
  email VARCHAR(100) NOT NULL UNIQUE,
  rol ENUM('usuario', 'admin', 'superadmin') DEFAULT 'usuario',
  password_hash VARCHAR(255), -- Nullable por si se registra solo con Google
  google_id VARCHAR(255) UNIQUE, -- ID único de Google auth
  nombre_completo VARCHAR(100),
  foto_perfil VARCHAR(255) DEFAULT NULL,
  biografia VARCHAR(150),
  peso_kg DECIMAL(5,2),
  estatura_cm INT,
  genero ENUM('M', 'F', 'Otro'),
  es_pro BOOLEAN DEFAULT FALSE,
  es_privada BOOLEAN DEFAULT FALSE,
  fecha_fin_suscripcion DATE,
  rango_global ENUM('Sin Rango', 'Hierro', 'Bronce', 'Plata', 'Oro','Platino', 'Esmeralda', 'Diamante', 'Campeon', 'Oxyra') DEFAULT 'Sin Rango',
  nivel_medio_fuerza INT DEFAULT 0, -- Media de los stats musculares
  notificaciones_activas BOOLEAN DEFAULT TRUE,
  onboarding_completed TINYINT(1) NOT NULL DEFAULT 0, -- 0 = pendiente, 1 = completado
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ai_logs (
  idLog INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo_accion ENUM('generar_rutina', 'escaneo_corporal', 'ajuste_dieta') NOT NULL DEFAULT 'generar_rutina',
  status ENUM('success', 'failed', 'blocked') NOT NULL DEFAULT 'success',
  detalles TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  INDEX idx_usuario_tipo (usuario_id, tipo_accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índice para que el conteo sea ultra-rápido
CREATE INDEX idx_ai_usage ON ai_logs(usuario_id, created_at);
-- ==========================================================
-- 2. SOCIAL: SEGUIDORES (Sistema de Amigos/Competencia)
-- ==========================================================
CREATE TABLE seguidores (
  seguidor_id INT NOT NULL,
  seguido_id INT NOT NULL,
  estado ENUM('aceptado', 'pendiente') DEFAULT 'aceptado',
  fecha_seguimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (seguidor_id, seguido_id),
  CONSTRAINT fk_seguidor FOREIGN KEY (seguidor_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_seguido FOREIGN KEY (seguido_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 3. EMPRESAS Y PRODUCTOS (Patrocinios)
-- ==========================================================
-- Mantenemos empresas separado para evitar redundancia de datos y permitir logos de marca
CREATE TABLE empresas (
  idEmpresa INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  logo_url VARCHAR(255),
  web_oficial VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE productos (
  idProducto INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio_visual DECIMAL(10,2),
  codigo_descuento VARCHAR(50),
  imagen_url VARCHAR(255),
  enlace_afiliado VARCHAR(255) NOT NULL, -- Tu link para ganar dinero/trackear
  categoria ENUM('Suplementos', 'Ropa', 'Equipamiento', 'Otros'),
  es_destacado BOOLEAN DEFAULT FALSE,
  CONSTRAINT fk_prod_empresa FOREIGN KEY (empresa_id) REFERENCES empresas(idEmpresa)
) ENGINE=InnoDB;

-- ==========================================================
-- 4. EJERCICIOS (La base de datos de movimientos)
-- ==========================================================
CREATE TABLE ejercicios (
  idEjercicio INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  grupo_muscular VARCHAR(100) NOT NULL,
  tipo_medicion ENUM('Peso_Reps', 'Peso_Tiempo', 'Solo_Tiempo', 'Peso_Corporal') DEFAULT 'Peso_Reps',
  instrucciones TEXT,
  video_url VARCHAR(255)
) ENGINE=InnoDB;

-- ==========================================================
-- 5. MOTOR "SYMMETRY": ESTADÍSTICAS POR MÚSCULO
-- Aquí se guarda el nivel de cada usuario en cada músculo
-- ==========================================================
CREATE TABLE stats_musculares (
  usuario_id INT NOT NULL,
  grupo_muscular ENUM(
    'Pecho', 'Espalda Alta','Espalda Media','Espalda Baja', 'Hombro', 
    'Cuadriceps', 'Femoral', 'Gluteo', 'Gemelo', 'Aductores',
    'Bíceps', 'Tríceps', 'Antebrazo', 'Trapecio', 
    'Abdomen','General') NOT NULL,
  fuerza_teorica_max DECIMAL(6,2) DEFAULT 0, 
  puntos_xp INT DEFAULT 0,
  rango_actual ENUM('Sin Rango', 'Hierro','Bronce', 'Plata', 'Oro','Platino', 'Esmeralda', 'Diamante', 'Campeon','Oxyra') DEFAULT 'Sin Rango',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, grupo_muscular),
  CONSTRAINT fk_stat_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 6. RUTINAS (PLANTILLAS)
-- Lo que el usuario "planea" hacer (o la IA le crea)
-- ==========================================================
CREATE TABLE rutinas (
  idRutina INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  objetivo VARCHAR(100),
  descripcion TEXT,
  nivel_dificultad VARCHAR(50),
  creada_por_ia BOOLEAN DEFAULT FALSE,
  es_publica BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_rutina_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE rutina_detalles (
  idDetalle INT AUTO_INCREMENT PRIMARY KEY, 
  rutina_id INT NOT NULL,
  ejercicio_id INT NOT NULL,
  orden INT NOT NULL,
  series_objetivo INT DEFAULT 4,
  reps_objetivo VARCHAR(50), 
  descanso_segundos INT DEFAULT 90,
  nota_usuario VARCHAR(255),
  CONSTRAINT fk_rd_rutina FOREIGN KEY (rutina_id) REFERENCES rutinas(idRutina) ON DELETE CASCADE,
  CONSTRAINT fk_rd_ejercicio FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(idEjercicio) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ==========================================================
-- 7. HISTORIAL DE ENTRENAMIENTOS (LOGS REALES)
-- Lo que el usuario "realmente" hizo (Vital para calcular rangos)
-- ==========================================================
CREATE TABLE historial_workouts (
  idWorkout INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  rutina_origen_id INT,
  nombre_sesion VARCHAR(100),
  fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_fin DATETIME,
  duracion_minutos INT,
  volumen_total_kg INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hw_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_hw_rutina FOREIGN KEY (rutina_origen_id) REFERENCES rutinas(idRutina) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE historial_sets (
  idSet INT AUTO_INCREMENT PRIMARY KEY,
  workout_id INT NOT NULL,
  ejercicio_id INT,
  nombre_ejercicio_snapshot VARCHAR(100),
  numero_serie INT NOT NULL,
  kg_levantados DECIMAL(6,2) NOT NULL,
  reps_realizadas INT NOT NULL,
  rpe INT,
  es_calentamiento BOOLEAN DEFAULT FALSE,
  es_record_personal BOOLEAN DEFAULT FALSE, 
  CONSTRAINT fk_hs_workout FOREIGN KEY (workout_id) REFERENCES historial_workouts(idWorkout) ON DELETE CASCADE,
  CONSTRAINT fk_hs_ejercicio FOREIGN KEY (ejercicio_id) REFERENCES ejercicios(idEjercicio) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ==========================================================
-- 8. RED SOCIAL (POSTS, LIKES, COMENTARIOS)
-- ==========================================================
CREATE TABLE posts (
  idPost INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  workout_id INT, -- Opcional: Vincular un post a un entreno que acabas de hacer (como Hevy)
  foto_url VARCHAR(255) NOT NULL,
  titulo VARCHAR(100),
  descripcion TEXT,
  ubicacion VARCHAR(100), -- Gym donde entrenó
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_post_workout FOREIGN KEY (workout_id) REFERENCES historial_workouts(idWorkout) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE likes (
  usuario_id INT NOT NULL,
  post_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, post_id), -- Un usuario solo puede dar like una vez al mismo post
  CONSTRAINT fk_like_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_like_post FOREIGN KEY (post_id) REFERENCES posts(idPost) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE comentarios (
  idComentario INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  usuario_id INT NOT NULL,
  texto VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_com_post FOREIGN KEY (post_id) REFERENCES posts(idPost) ON DELETE CASCADE,
  CONSTRAINT fk_com_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO usuarios (username, email, rol, password_hash, nombre_completo, rango_global, es_pro) VALUES ('Oxyra', 'admin@oxyra.app', 'superadmin', '$2b$10$q/r6rcfvK1gbHCOvt5dxuezQ50zECOFwqJYvuXuwIns0.84AYCcRO', 'Oxyra System', 'Oxyra', TRUE);

INSERT INTO empresas (nombre, logo_url, web_oficial) VALUES 
('Gymshark', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Gymshark_logo.png', 'https://gymshark.com'),
('MyProtein', 'https://upload.wikimedia.org/wikipedia/commons/2/22/Myprotein_Logo.png', 'https://myprotein.com'),
('SBD', 'https://sbdapparel.com/cdn/shop/files/SBD_Logo_Red_Black_150x.png', 'https://sbdapparel.com'),
('Rogue Fitness', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Rogue_Fitness_logo.png/600px-Rogue_Fitness_logo.png', 'https://www.roguefitness.com'),
('Optimum Nutrition', 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Optimum_Nutrition_logo.png', 'https://www.optimumnutrition.com'),
('Nike', 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg', 'https://www.nike.com'),
('Prozis', 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Logo_Prozis.png', 'https://www.prozis.com');


INSERT INTO productos (empresa_id, nombre, descripcion, precio_visual, codigo_descuento, imagen_url, enlace_afiliado, categoria, es_destacado) VALUES 
(1, 'Crest Hoodie', 'Sudadera técnica ajustada para entrenamiento de alta intensidad. Tejido transpirable y duradero.', 45.00, 'OXYRA10', 'https://cdn.shopify.com/s/files/1/0156/6146/files/images-CrestOversizedHoodieBlackA5A8O_BB2J_1117_0491_1920x.jpg?v=1753107227', 'https://www.gymshark.com/products/gymshark-crest-oversized-hoodie-black-ss24', 'Ropa', TRUE),
(2, 'Impact Whey Protein', 'La proteína más vendida. 23g de proteína por servicio. Ideal para recuperación post-entreno.', 29.99, 'OXYRA30', 'https://www.myprotein.es/images?url=https://static.thcdn.com/productimg/original/10530943-3505283632278257.png&format=webp&auto=avif&crop=1100,1200,smart', 'https://www.myprotein.es/p/nutricion-deportiva/impact-whey-protein/10530943/', 'Suplementos', TRUE),
(3, 'SBD Knee Sleeves', 'Rodilleras de neopreno de 7mm aprobadas por la IPF. Máximo soporte para sentadillas pesadas.', 89.99, NULL, 'https://imgs.search.brave.com/wczxXHcBf0J0b9j1eY6DJMrA6qRbWJFadcutCL2oYA8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/c2JkYXBwYXJlbC5u/bC9jZG4vc2hvcC9w/cm9kdWN0cy9XRUlH/SFRMSUZUSU5HLUtO/RUUtU0xFRVZFUy0w/MS5qcGc_dj0xNjM3/Nzc3ODU0', 'https://sbdapparel.com/products/7mm-knee-sleeves', 'Equipamiento', FALSE),
(1, 'Power T-Shirt', 'Camiseta sin costuras con ventilación estratégica.', 35.00, 'OXYRA10', 'https://cdn.shopify.com/s/files/1/1367/5207/files/images-ANNOTATED_PDP_24775667_1920x.jpg?v=1762966429', 'https://row.gymshark.com/products/gymshark-power-t-shirt-ss-tops-black-aw25-4', 'Ropa', FALSE),
(4, 'The Ohio Bar', 'La barra olímpica definitiva. Acero inoxidable de 190.000 PSI, doble marca de knurling y garantía de por vida. El estándar en CrossFit y Powerlifting.', 395.00, NULL, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1284,b_rgb:f8f8f8/catalog/Weightlifting%20Bars%20and%20Plates/Barbells/Mens%2020KG%20Barbells/RA0539-BLOX/2023%20Update/RA2889-BLOX-H_new_vy2rmu.png', 'https://www.roguefitness.com/es/rogue-ohio-bar-black-oxide', 'Equipamiento', TRUE),
(4, 'Rogue Echo Bike', 'Bicicleta de aire construida como un tanque. Estructura de acero reforzado para los entrenamientos de alta intensidad (HIIT) más exigentes.', 895.00, NULL, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1960,b_rgb:f8f8f8/ECHOBIKE-Web2_rfrxqk.png', 'https://www.roguefitness.com/es/rogue-echo-bike-eu', 'Equipamiento', TRUE),
(4, 'Cinturón Ohio Lifting', 'Cinturón de cuero de 10mm curtido vegetalmente. Soporte lumbar premium para tus levantamientos más pesados.', 125.00, NULL, 'https://assets.roguefitness.com/f_auto,q_auto,c_limit,w_1284,b_rgb:f8f8f8/catalog/Straps%20Wraps%20and%20Support%20/Belts%20/Weightlifting/EU-WL0002/EU-WL0002-web1_opr3cv.png', 'https://www.roguefitness.com/es/rogue-ohio-lifting-belt-eu', 'Equipamiento', FALSE),
(5, 'Micronized Creatine Powder', 'Creatina monohidrato micronizada pura para aumentar el rendimiento físico en series sucesivas de ejercicios breves de alta intensidad.', 34.95, 'OXYRA15', 'https://m.media-amazon.com/images/I/71mLPulitIL._AC_SX679_.jpg', 'https://www.amazon.es/OPTIMUM-NUTRITION-Micronizada-Monohidrato-Rendimiento/dp/B00T7L20AQ', 'Suplementos', FALSE),
(5, 'Gold Standard 100% Whey', 'La proteína de suero más premiada del mundo. 24g de proteína, 5.5g de BCAAs y bajo contenido en grasa y azúcar.', 79.90, 'OXYRA15', 'https://m.media-amazon.com/images/I/71IbODPTkvL._AC_SX679_.jpg', 'https://www.amazon.es/Optimum-Nutrition-Standard-Suplemento-Deportistas/dp/B000GISU1M', 'Suplementos', TRUE),
(6, 'Nike Metcon 10', 'Zapatillas de entrenamiento diseñadas para levantamiento de pesas y cross-training. Placa Hyperlift en el talón para estabilidad.', 139.99, NULL, 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/5709c27f-742f-4236-93c5-fd398cde51f9/M+NIKE+METCON+10.png', 'https://www.nike.com/es/t/metcon-10-zapatillas-de-training-gxaaiVnk/HJ1875-002', 'Ropa', TRUE),
(6, 'Nike Romaleos 4', 'Calzado específico de halterofilia. Entresuela rígida y correas ajustables para máxima transferencia de potencia.', 200.00, NULL, 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/i1-9fe1a65e-c459-4f81-a4f0-8b1b1a188004/NIKE+ROMALEOS+4.png', 'https://www.nike.com/es/t/romaleos-4-zapatillas-de-halterofilia-yEPhnlW4/CD3463-101', 'Ropa', FALSE),
(7, 'Oatmeal - Avena Integral', 'Harina de avena integral disponible en múltiples sabores deliciosos. Fuente de fibra perfecta para desayunos fit.', 9.99, 'OXYRA10', 'https://static.sscontent.com/thumb/2000/2000/products/124/v1323975_prozis_oatmeal-wholegrain-1000-g_lemon-tart_newin_flavor.webp', 'https://www.prozis.com/es/es/prozis/oatmeal-wholegrain-500g', 'Suplementos', FALSE),
(7, 'Creatina Creapure', 'Monohidrato de creatina de la más alta pureza (Creapure®). Ideal para ganar fuerza y potencia explosiva.', 29.99, 'OXYRA10', 'https://static.sscontent.com/thumb/2000/2000/products/124/v1514433_prozis_creatine-creapure-300-g_natural_newin_flavor.webp', 'https://www.prozis.com/es/es/prozis/creatina-creapure-300-g', 'Suplementos', TRUE);


INSERT INTO ejercicios (nombre, grupo_muscular) VALUES 
-- PECHO
('Press Banca con Barra', 'Pecho'),
('Press Banca Inclinado con Mancuernas', 'Pecho'),
('Aperturas con Mancuernas', 'Pecho'),
('Cruce de Poleas', 'Pecho'),
('Fondos en Paralelas', 'Pecho'),
('Press Declinado con Barra', 'Pecho'),
('Press de Pecho en Máquina', 'Pecho'),
('Pullover con Mancuerna', 'Pecho'),
('Flexiones (Push-ups)', 'Pecho'),
('Cruce de Poleas Baja (Upper Chest)', 'Pecho'),

-- ESPALDA
('Dominadas', 'Espalda'),
('Jalón al Pecho', 'Espalda'),
('Remo con Barra', 'Espalda'),
('Remo en Polea Baja', 'Espalda'),
('Remo con Mancuerna a una mano', 'Espalda'),
('Peso Muerto Convencional', 'Espalda'),
('Remo en Punta (Barra T)', 'Espalda'),
('Jalón al Pecho Agarre Inverso (Supino)', 'Espalda'),
('Pull Over en Polea Alta (Brazos Rígidos)', 'Espalda'),
('Hiperextensiones (Lumbares)', 'Espalda'),
('Dominadas Asistidas en Máquina', 'Espalda'),

-- PIERNA (Cuádriceps/Femoral/Glúteo)
('Sentadilla con Barra', 'Pierna'),
('Prensa de Piernas', 'Pierna'),
('Extensión de Cuádriceps', 'Pierna'),
('Peso Muerto Rumano', 'Pierna'),
('Curl Femoral Tumbado', 'Pierna'),
('Zancadas con Mancuernas', 'Pierna'),
('Hip Thrust', 'Glúteo'),
('Elevación de Gemelos', 'Gemelo'),
('Sentadilla Frontal', 'Pierna'),
('Sentadilla Búlgara', 'Pierna'),
('Peso Muerto Sumo', 'Pierna'),
('Sentadilla Goblet', 'Pierna'),
('Máquina de Aductores', 'Pierna'),
('Máquina de Abductores', 'Glúteo'),
('Patada de Glúteo en Polea', 'Glúteo'),
('Elevación de Talones Sentado (Sóleo)', 'Gemelo'),

-- HOMBRO
('Press Militar con Barra', 'Hombro'),
('Press de Hombros con Mancuernas', 'Hombro'),
('Elevaciones Laterales', 'Hombro'),
('Pájaros (Elevaciones Posteriores)', 'Hombro'),
('Press Arnold', 'Hombro'),
('Elevaciones Frontales con Disco/Mancuerna', 'Hombro'),
('Remo al Mentón (Upright Row)', 'Hombro'),
('Face Pull (Jalón a la cara)', 'Hombro'),
('Encogimientos con Mancuernas (Trapecio)', 'Hombro'),

-- BRAZOS
('Curl de Bíceps con Barra', 'Bíceps'),
('Curl Martillo', 'Bíceps'),
('Curl Predicador', 'Bíceps'),
('Extensiones de Tríceps en Polea', 'Tríceps'),
('Press Francés', 'Tríceps'),
('Fondos entre Bancos', 'Tríceps'),
('Curl con Barra Z', 'Bíceps'),
('Curl Concentrado', 'Bíceps'),
('Curl Araña (Spider Curl)', 'Bíceps'),
('Dominadas Supinas (Chin-ups)', 'Bíceps'),
('Press Banca Agarre Cerrado', 'Tríceps'),
('Extensión de Tríceps Trasnuca (Copa)', 'Tríceps'),
('Patada de Tríceps con Mancuerna', 'Tríceps'),
('Curl de Muñeca (Antebrazo)', 'Antebrazo'),

-- ABDOMEN / CORE
('Plancha Abdominal (Plank)', 'Abdomen'),
('Crunch Abdominal', 'Abdomen'),
('Rueda Abdominal (Ab Wheel)', 'Abdomen'),
('Giros Rusos (Russian Twist)', 'Abdomen'),
('Leñador en Polea (Woodchoppers)', 'Abdomen'),
('Elevación de Piernas Colgado', 'Abdomen'),
('Abdominales en Máquina', 'Abdomen'),
('V-Ups', 'Abdomen'),
('Elevación de Piernas', 'Abdomen');

-- ==========================================================
-- 9. MÓDULO DE NUTRICIÓN (Sistema Completo Profesional)
-- ==========================================================

-- ── 9.1 OBJETIVOS NUTRICIONALES DEL USUARIO ──────────────────
-- Metas calóricas y de macros personalizadas.
-- Un usuario puede tener una sola fila activa con sus objetivos
-- y una descripción de su objetivo principal (bajar, mantener, subir).
CREATE TABLE nutricion_objetivos (
  idObjetivo    INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id    INT NOT NULL UNIQUE,     -- 1 objetivo activo por usuario
  objetivo      ENUM('perder_peso', 'mantener', 'ganar_masa') DEFAULT 'mantener',
  calorias_dia  INT NOT NULL DEFAULT 2000,
  proteinas_g   DECIMAL(6,2) NOT NULL DEFAULT 150.00,
  carbos_g      DECIMAL(6,2) NOT NULL DEFAULT 200.00,
  grasas_g      DECIMAL(6,2) NOT NULL DEFAULT 70.00,
  agua_ml       INT DEFAULT 2500,        -- Objetivo de hidratación
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_nutobj_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 9.2 REGISTRO DIARIO DE COMIDAS ───────────────────────────
-- Cada fila es UNA ingesta de UN alimento en UNA comida en UNA fecha.
-- El "reset diario" se consigue filtrando por `fecha_dia = CURRENT_DATE()`.
-- No requiere cronjob: la lógica de "hoy" vive en la query, no en un borrado.
CREATE TABLE nutricion_registros (
  idRegistro     INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  fecha_dia      DATE NOT NULL,          -- Fecha del día (sin hora) → clave del reset
  comida         ENUM('desayuno', 'almuerzo', 'cena', 'snacks') NOT NULL,

  -- Datos del alimento (snapshot, no FK a Open Food Facts)
  nombre         VARCHAR(200) NOT NULL,
  marca          VARCHAR(100),
  imagen_url     VARCHAR(500),
  barcode        VARCHAR(50),            -- Código de barras, útil para historial
  gramos         DECIMAL(7,2) NOT NULL,

  -- Macros calculados ya en la ingesta (pre-calculados = queries más rápidas)
  kcal           DECIMAL(8,2) NOT NULL DEFAULT 0,
  proteinas_g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  carbos_g       DECIMAL(7,2) NOT NULL DEFAULT 0,
  grasas_g       DECIMAL(7,2) NOT NULL DEFAULT 0,
  fibra_g        DECIMAL(7,2) DEFAULT 0,
  sal_g          DECIMAL(7,2) DEFAULT 0, -- Útil para dietas de hipertensión

  -- Macros RAW por 100g (para poder re-editar cantidad sin perder el original)
  kcal_100g      DECIMAL(8,2),
  proteinas_100g DECIMAL(7,2),
  carbos_100g    DECIMAL(7,2),
  grasas_100g    DECIMAL(7,2),

  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_user_fecha (usuario_id, fecha_dia),   -- Índice clave: obtener el día de hoy ultra-rápido
  INDEX idx_comida (comida),
  CONSTRAINT fk_nutreg_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 9.3 RESUMEN DIARIO DE NUTRICIÓN (CACHÉ DIARIA) ────────────
-- Vista resumida de cada día para el historial y las estadísticas.
-- Se actualiza con cada INSERT/UPDATE en nutricion_registros.
-- Evita recalcular sumas completas en cada petición del historial.
CREATE TABLE nutricion_resumen_diario (
  usuario_id     INT NOT NULL,
  fecha_dia      DATE NOT NULL,
  kcal_total     DECIMAL(9,2) DEFAULT 0,
  proteinas_g    DECIMAL(8,2) DEFAULT 0,
  carbos_g       DECIMAL(8,2) DEFAULT 0,
  grasas_g       DECIMAL(8,2) DEFAULT 0,
  agua_ml        INT DEFAULT 0,          -- Vasos de agua registrados del día
  num_ingestas   INT DEFAULT 0,          -- Cuántos alimentos se han añadido
  objetivo_kcal  INT DEFAULT 0,          -- Snapshot del objetivo de ese día
  PRIMARY KEY (usuario_id, fecha_dia),
  CONSTRAINT fk_nutres_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 9.4 REGISTRO DE HIDRATACIÓN ───────────────────────────────
-- Cada vaso/botella de agua que el usuario confirma que bebió.
-- Granular porque la UI suele mostrar "botones de +250ml".
CREATE TABLE nutricion_agua (
  idAgua      INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id  INT NOT NULL,
  fecha_dia   DATE NOT NULL,
  cantidad_ml INT NOT NULL DEFAULT 250,
  hora        TIME DEFAULT (CURRENT_TIME),
  INDEX idx_agua_user_fecha (usuario_id, fecha_dia),
  CONSTRAINT fk_agua_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 9.5 ALIMENTOS PERSONALIZADOS DEL USUARIO ─────────────────
-- Cuando un alimento no aparece en Open Food Facts, el usuario puede crearlo.
-- También sirve para guardar sus "mis alimentos favoritos frecuentes".
CREATE TABLE nutricion_alimentos_custom (
  idAlimento     INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id     INT NOT NULL,
  nombre         VARCHAR(200) NOT NULL,
  marca          VARCHAR(100),
  barcode        VARCHAR(50) UNIQUE,     -- Si el usuario lo quiere asociar a un EAN
  kcal_100g      DECIMAL(8,2) NOT NULL,
  proteinas_100g DECIMAL(7,2) NOT NULL DEFAULT 0,
  carbos_100g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  grasas_100g    DECIMAL(7,2) NOT NULL DEFAULT 0,
  fibra_100g     DECIMAL(7,2) DEFAULT 0,
  es_publico     BOOLEAN DEFAULT FALSE,  -- Si TRUE, otros usuarios también lo ven
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_custom_user (usuario_id),
  CONSTRAINT fk_custom_user FOREIGN KEY (usuario_id) REFERENCES usuarios(idUsuario) ON DELETE CASCADE
) ENGINE=InnoDB;