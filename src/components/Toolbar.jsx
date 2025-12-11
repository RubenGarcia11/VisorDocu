import SettingsMenu from './SettingsMenu';

/**
 * Toolbar con controles de la aplicación
 */
function Toolbar({
    activeFile,
    theme,
    onThemeChange,
    confettiMode,
    onConfettiChange,
    onMenuToggle,
    onSave,
    onOpenSearch,
    onOpenPdfMerger
}) {
    const fileTypeLabels = {
        txt: 'Texto',
        pdf: 'PDF',
        md: 'Markdown',
        json: 'JSON',
        drawio: 'Draw.io'
    };

    return (
        <header className="toolbar">
            <div className="toolbar-left">
                {/* Botón menú móvil */}
                <button
                    className="menu-toggle btn btn-icon"
                    onClick={onMenuToggle}
                    aria-label="Abrir menú"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                {/* Título del archivo */}
                {activeFile ? (
                    <div className="toolbar-title">
                        <span>{activeFile.name}</span>
                        <span className="toolbar-badge">{fileTypeLabels[activeFile.type]}</span>
                        {activeFile.modified && (
                            <span style={{ color: '#f59e0b', fontSize: '0.75rem' }}>• Sin guardar</span>
                        )}
                    </div>
                ) : (
                    <div className="toolbar-title">
                        <span>Sin archivo seleccionado</span>
                    </div>
                )}
            </div>

            <div className="toolbar-right">
                {/* Botón búsqueda */}
                <button
                    className="btn btn-icon"
                    onClick={onOpenSearch}
                    aria-label="Buscar (Ctrl+K)"
                    title="Buscar (Ctrl+K)"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>

                {/* Botón combinar PDFs */}
                <button
                    className="btn btn-icon"
                    onClick={onOpenPdfMerger}
                    aria-label="Combinar PDFs"
                    title="Combinar PDFs"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                </button>

                {/* Botón guardar */}
                {activeFile && activeFile.type !== 'pdf' && activeFile.type !== 'drawio' && (
                    <button
                        className="btn btn-primary"
                        onClick={onSave}
                        disabled={!activeFile.modified}
                        aria-label="Guardar archivo"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                            <polyline points="17 21 17 13 7 13 7 21" />
                            <polyline points="7 3 7 8 15 8" />
                        </svg>
                        <span>Guardar</span>
                    </button>
                )}

                {/* Menú de ajustes */}
                <SettingsMenu
                    theme={theme}
                    onThemeChange={onThemeChange}
                    confettiMode={confettiMode}
                    onConfettiChange={onConfettiChange}
                />
            </div>
        </header>
    );
}

export default Toolbar;
