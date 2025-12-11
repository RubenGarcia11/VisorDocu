import { useRef } from 'react';

/**
 * Estado vacío cuando no hay archivos abiertos
 */
function EmptyState({ onAddFile }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => onAddFile(file));
        e.target.value = '';
    };

    return (
        <div className="viewer-panel">
            <div className="empty-state">
                <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                    <line x1="9" y1="14" x2="15" y2="14" />
                </svg>

                <h2 className="empty-state-title">Bienvenido a DocViewer</h2>
                <p className="empty-state-text">
                    Arrastra un archivo a la barra lateral o haz clic en el botón para comenzar a visualizar y editar documentos.
                </p>

                <button className="btn btn-primary" onClick={handleClick} style={{ marginTop: '24px' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span>Abrir archivo</span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.text,.pdf,.md,.markdown,.json"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <div className="supported-formats">
                    <span className="format-tag">.txt</span>
                    <span className="format-tag">.pdf</span>
                    <span className="format-tag">.md</span>
                    <span className="format-tag">.json</span>
                </div>
            </div>
        </div>
    );
}

export default EmptyState;
