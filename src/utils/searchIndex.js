import Fuse from 'fuse.js';

/**
 * Configuración de Fuse.js para búsqueda fuzzy
 */
const fuseOptions = {
    keys: [
        { name: 'name', weight: 0.7 },
        { name: 'content', weight: 0.3 }
    ],
    threshold: 0.4, // Tolerancia a errores (0 = exacto, 1 = cualquier cosa)
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true
};

/**
 * Crea un índice de búsqueda para los archivos
 * @param {Array} files - Lista de archivos con name y content
 * @returns {Fuse} Instancia de Fuse configurada
 */
export function createSearchIndex(files) {
    // Preparar documentos para indexar
    const documents = files.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        content: typeof file.content === 'string' ? file.content.substring(0, 5000) : ''
    }));

    return new Fuse(documents, fuseOptions);
}

/**
 * Busca en el índice
 * @param {Fuse} index - Índice de Fuse
 * @param {string} query - Término de búsqueda
 * @param {number} limit - Límite de resultados
 * @returns {Array} Resultados de búsqueda
 */
export function searchInIndex(index, query, limit = 10) {
    if (!query || query.length < 2) return [];

    const results = index.search(query, { limit });

    return results.map(result => ({
        id: result.item.id,
        name: result.item.name,
        type: result.item.type,
        score: result.score,
        matches: result.matches
    }));
}
