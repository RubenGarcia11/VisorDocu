/**
 * Utilidades para cálculo de tiempo de lectura
 */

const WORDS_PER_MINUTE = 200;

/**
 * Calcula el tiempo de lectura estimado en minutos
 * @param {string} text - Contenido de texto a analizar
 * @returns {number} Minutos estimados de lectura
 */
export function calculateReadingTime(text) {
    if (!text || typeof text !== 'string') return 0;

    // Limpiar texto de caracteres especiales y contar palabras
    const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // Remover bloques de código
        .replace(/[#*_`~\[\](){}|]/g, '') // Remover caracteres markdown
        .trim();

    const words = cleanText.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / WORDS_PER_MINUTE);

    return Math.max(1, minutes); // Mínimo 1 minuto
}

/**
 * Formatea el tiempo de lectura para mostrar
 * @param {number} minutes - Minutos de lectura
 * @returns {string} Texto formateado
 */
export function formatReadingTime(minutes) {
    if (minutes <= 1) return '1 min de lectura';
    return `${minutes} min de lectura`;
}
