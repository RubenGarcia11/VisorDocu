/**
 * Iconos para diferentes tipos de archivo
 */
export function FileIcon({ type, className }) {
    const icons = {
        txt: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        ),
        pdf: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M10 12h1.5a1.5 1.5 0 1 1 0 3H10v3" />
            </svg>
        ),
        md: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 13v4l2-2 2 2v-4" />
                <path d="M16 13v4" />
                <path d="M16 13l-2 2" />
            </svg>
        ),
        json: (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M8 12a2 2 0 0 0 0 4" />
                <path d="M16 12a2 2 0 0 1 0 4" />
            </svg>
        ),
    };

    return icons[type] || icons.txt;
}

/**
 * Obtiene la clase CSS para el color del icono
 */
export function getFileIconClass(type) {
    return type || 'txt';
}
