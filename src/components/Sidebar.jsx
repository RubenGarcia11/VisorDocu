import { useState, useRef, useCallback } from 'react';
import { FileIcon, getFileIconClass } from './icons/FileIcon';

/**
 * Sidebar con zona de arrastrar y lista de archivos
 */
function Sidebar({ files, activeFileId, isOpen, onSelectFile, onAddFile, onCloseFile }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

    // Manejar drag & drop
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        droppedFiles.forEach(file => {
            if (isValidFile(file.name)) {
                onAddFile(file);
            }
        });
    }, [onAddFile]);

    // Manejar click en zona de drop
    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

    // Manejar selección de archivo
    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        selectedFiles.forEach(file => {
            if (isValidFile(file.name)) {
                onAddFile(file);
            }
        });
        e.target.value = ''; // Reset input
    };

    // Validar extensiones permitidas
    function isValidFile(filename) {
        const validExtensions = ['txt', 'text', 'pdf', 'md', 'markdown', 'json'];
        const ext = filename.split('.').pop().toLowerCase();
        return validExtensions.includes(ext);
    }

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            {/* Header */}
            <div className="sidebar-header">
                <h1 className="sidebar-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    DocViewer
                </h1>
            </div>

            {/* Drop Zone */}
            <div
                className={`drop-zone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleDropZoneClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleDropZoneClick()}
                aria-label="Arrastra archivos aquí o haz clic para seleccionar"
            >
                <svg className="drop-zone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="drop-zone-text">
                    <strong>Arrastra archivos</strong> aquí<br />
                    o haz clic para seleccionar
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.text,.pdf,.md,.markdown,.json"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    aria-hidden="true"
                />
            </div>

            {/* Lista de archivos */}
            <div className="file-list">
                {files.length > 0 && (
                    <>
                        <h2 className="file-list-title">Archivos abiertos</h2>
                        <ul style={{ listStyle: 'none' }}>
                            {files.map(file => (
                                <li key={file.id}>
                                    <div
                                        className={`file-item ${activeFileId === file.id ? 'active' : ''}`}
                                        onClick={() => onSelectFile(file.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && onSelectFile(file.id)}
                                    >
                                        <FileIcon type={file.type} className={`file-item-icon ${getFileIconClass(file.type)}`} />
                                        <span className="file-item-name" title={file.name}>
                                            {file.modified && '• '}
                                            {file.name}
                                        </span>
                                        <button
                                            className="file-item-close"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCloseFile(file.id);
                                            }}
                                            aria-label={`Cerrar ${file.name}`}
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
