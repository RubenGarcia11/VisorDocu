import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { mergePDFs, downloadBlob, getPdfInfo } from '../utils/pdfUtils';

/**
 * Herramienta para unificar múltiples PDFs
 */
function PdfMerger({ isOpen, onClose }) {
    const [files, setFiles] = useState([]);
    const [merging, setMerging] = useState(false);
    const [error, setError] = useState(null);

    // Añadir archivos PDF
    const handleFileSelect = useCallback(async (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            f => f.type === 'application/pdf'
        );

        // Obtener info de cada PDF
        const filesWithInfo = await Promise.all(
            selectedFiles.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const info = await getPdfInfo(arrayBuffer);
                return {
                    file,
                    name: file.name,
                    pageCount: info.pageCount,
                    id: Date.now() + Math.random()
                };
            })
        );

        setFiles(prev => [...prev, ...filesWithInfo]);
        setError(null);
    }, []);

    // Remover archivo
    const removeFile = useCallback((id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    }, []);

    // Reordenar archivos (mover arriba)
    const moveUp = useCallback((index) => {
        if (index === 0) return;
        setFiles(prev => {
            const newFiles = [...prev];
            [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
            return newFiles;
        });
    }, []);

    // Reordenar archivos (mover abajo)
    const moveDown = useCallback((index) => {
        setFiles(prev => {
            if (index === prev.length - 1) return prev;
            const newFiles = [...prev];
            [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
            return newFiles;
        });
    }, []);

    // Combinar PDFs
    const handleMerge = useCallback(async () => {
        if (files.length < 2) {
            setError('Selecciona al menos 2 PDFs para combinar');
            return;
        }

        setMerging(true);
        setError(null);

        try {
            const pdfFiles = files.map(f => f.file);
            const mergedBlob = await mergePDFs(pdfFiles);
            downloadBlob(mergedBlob, 'documento_combinado.pdf');
            onClose();
            setFiles([]);
        } catch (err) {
            setError('Error al combinar PDFs: ' + err.message);
        } finally {
            setMerging(false);
        }
    }, [files, onClose]);

    // Limpiar todo
    const handleClear = () => {
        setFiles([]);
        setError(null);
    };

    if (!isOpen) return null;

    const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);

    return createPortal(
        <div className="pdf-merger-overlay" onClick={onClose}>
            <div className="pdf-merger-modal" onClick={e => e.stopPropagation()}>
                <div className="pdf-merger-header">
                    <h2>Combinar PDFs</h2>
                    <button className="btn btn-icon" onClick={onClose} aria-label="Cerrar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="pdf-merger-content">
                    {/* Zona de carga */}
                    <label className="pdf-merger-dropzone">
                        <input
                            type="file"
                            accept=".pdf"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <span>Haz clic o arrastra archivos PDF aquí</span>
                    </label>

                    {/* Lista de archivos */}
                    {files.length > 0 && (
                        <div className="pdf-merger-list">
                            <div className="pdf-merger-list-header">
                                <span>{files.length} archivo{files.length !== 1 ? 's' : ''}</span>
                                <span>{totalPages} páginas totales</span>
                            </div>

                            {files.map((file, index) => (
                                <div key={file.id} className="pdf-merger-item">
                                    <span className="pdf-merger-item-order">{index + 1}</span>
                                    <span className="pdf-merger-item-name">{file.name}</span>
                                    <span className="pdf-merger-item-pages">{file.pageCount} pág.</span>

                                    <div className="pdf-merger-item-actions">
                                        <button
                                            className="btn btn-icon"
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            aria-label="Mover arriba"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <polyline points="18 15 12 9 6 15" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn btn-icon"
                                            onClick={() => moveDown(index)}
                                            disabled={index === files.length - 1}
                                            aria-label="Mover abajo"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </button>
                                        <button
                                            className="btn btn-icon"
                                            onClick={() => removeFile(file.id)}
                                            aria-label="Eliminar"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="pdf-merger-error">{error}</div>
                    )}
                </div>

                <div className="pdf-merger-footer">
                    <button className="btn" onClick={handleClear} disabled={files.length === 0}>
                        Limpiar
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleMerge}
                        disabled={files.length < 2 || merging}
                    >
                        {merging ? 'Combinando...' : 'Combinar PDFs'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PdfMerger;
