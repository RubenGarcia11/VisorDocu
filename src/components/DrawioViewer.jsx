import { useState, useMemo } from 'react';

/**
 * Visor de diagramas Draw.io
 * Renderiza XML de Draw.io usando el visor embebido de diagrams.net
 */
function DrawioViewer({ xmlContent, fileName }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Detectar si el contenido es un diagrama Draw.io válido
    const isValidDrawio = useMemo(() => {
        if (!xmlContent) return false;
        return xmlContent.includes('<mxfile') || xmlContent.includes('<mxGraphModel');
    }, [xmlContent]);

    // Crear URL del visor
    const viewerUrl = useMemo(() => {
        if (!isValidDrawio) return null;

        // Comprimir y codificar el XML
        const encoded = encodeURIComponent(xmlContent);
        // Usar el visor de diagrams.net
        return `https://viewer.diagrams.net/?highlight=0000ff&layers=1&nav=1&title=${encodeURIComponent(fileName || 'diagram')}#R${encoded}`;
    }, [xmlContent, fileName, isValidDrawio]);

    if (!isValidDrawio) {
        return (
            <div className="drawio-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="48" height="48">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>El contenido no es un diagrama Draw.io válido</p>
            </div>
        );
    }

    return (
        <div className="drawio-viewer">
            <div className="drawio-header">
                <span className="drawio-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    Diagrama Draw.io
                </span>
                <a
                    href={viewerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-icon"
                    title="Abrir en nueva ventana"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </a>
            </div>

            {loading && (
                <div className="drawio-loading">
                    <p>Cargando diagrama...</p>
                </div>
            )}

            {error && (
                <div className="drawio-error">
                    <p>{error}</p>
                </div>
            )}

            <iframe
                src={viewerUrl}
                className="drawio-iframe"
                onLoad={() => setLoading(false)}
                onError={() => {
                    setLoading(false);
                    setError('Error al cargar el diagrama');
                }}
                title="Diagrama Draw.io"
            />
        </div>
    );
}

export default DrawioViewer;
