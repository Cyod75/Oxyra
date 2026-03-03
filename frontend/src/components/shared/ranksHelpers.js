/**
 * Helpers para el sistema de rangos Oxyra
 * Mapeo de rango → valor numérico y utilidades de cálculo
 */

export const RANK_SCORE_MAP = {
  'Sin Rango': 0,
  'Hierro': 10,
  'Bronce': 20,
  'Plata': 30,
  'Oro': 40,
  'Esmeralda': 50,
  'Diamante': 70,
  'Campeon': 85,
  'Oxyra': 100
};

const RANK_THRESHOLDS = [
  { min: 85, label: 'Oxyra' },
  { min: 70, label: 'Campeon' },
  { min: 50, label: 'Diamante' },
  { min: 40, label: 'Esmeralda' },
  { min: 30, label: 'Oro' },
  { min: 20, label: 'Plata' },
  { min: 10, label: 'Bronce' },
  { min: 1,  label: 'Hierro' },
  { min: 0,  label: 'Sin Rango' }
];

/**
 * Dado un Oxyra Score numérico, devuelve el nombre de rango correspondiente.
 * @param {number} score
 * @returns {string} Nombre del rango
 */
export const getRankLabel = (score) => {
  for (const tier of RANK_THRESHOLDS) {
    if (score >= tier.min) return tier.label;
  }
  return 'Sin Rango';
};

/**
 * Colores para bordes del podio (posición 1, 2, 3)
 */
export const PODIUM_COLORS = {
  1: { border: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)', bg: 'rgba(251, 191, 36, 0.1)' },   // Oro
  2: { border: '#e4e4e7', glow: 'rgba(228, 228, 231, 0.3)', bg: 'rgba(228, 228, 231, 0.08)' }, // Plata
  3: { border: '#cd7f32', glow: 'rgba(205, 127, 50, 0.3)', bg: 'rgba(205, 127, 50, 0.08)' }    // Bronce
};
