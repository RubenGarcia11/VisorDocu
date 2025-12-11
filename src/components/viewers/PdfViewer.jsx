import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import SignatureModal from '../SignatureModal';

// Configurar worker de PDF.js usando import directo (compatible con Vite)
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Visor de archivos PDF
 * Con controles de navegación, zoom y firma
 */
function PdfViewer({ file, onAddSignature }) {
    const [pdfDoc, setPdfDoc] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.2);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSignatureModal, setShowSignatureModal] = useState(false);

    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Cargar PDF
    useEffect(() => {
        if (!file.content) return;

        setLoading(true);
        setError(null);

        const loadPdf = async () => {
            try {
                // Crear copia del ArrayBuffer para evitar error de "detached"
                const arrayBuffer = file.content.slice(0);
                const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                const pdf = await loadingTask.promise;
                setPdfDoc(pdf);
                setTotalPages(pdf.numPages);
                setCurrentPage(1);
                setLoading(false);
            } catch (err) {
                console.error('Error loading PDF:', err);
                setError('Error al cargar el PDF: ' + err.message);
                setLoading(false);
            }
        };

        loadPdf();
    }, [file.content]);

    // Renderizar página
    useEffect(() => {
        if (!pdfDoc || !canvasRef.current) return;

        const renderPage = async () => {
            try {
                const page = await pdfDoc.getPage(currentPage);
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Si hay firma, dibujarla sobre el PDF
                if (file.signature) {
                    const img = new Image();
                    img.onload = () => {
                        // Dibujar firma en esquina inferior derecha
                        const sigWidth = Math.min(150, canvas.width * 0.3);
                        const sigHeight = sigWidth * 0.5;
                        const x = canvas.width - sigWidth - 20;
                        const y = canvas.height - sigHeight - 20;
                        context.drawImage(img, x, y, sigWidth, sigHeight);
                    };
                    img.src = file.signature;
                }
            } catch (err) {
                console.error('Error rendering page:', err);
            }
        };

        renderPage();
    }, [pdfDoc, currentPage, scale, file.signature]);

    // Navegación
    const goToPrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    // Zoom
    const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
    const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
    const resetZoom = () => setScale(1.2);

    // Manejar firma
    const handleSignature = (signatureData) => {
        onAddSignature(signatureData);
        setShowSignatureModal(false);
    };

    if (loading) {
        return (
            <div className="pdf-viewer">
                <div className="pdf-loading">
                    <p>Cargando PDF...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pdf-viewer">
                <div className="pdf-error">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pdf-viewer">
            {/* Controles */}
            <div className="pdf-controls">
                {/* Navegación */}
                <button
                    className="btn btn-icon"
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1}
                    aria-label="Página anterior"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <span className="pdf-page-info">
                    Página {currentPage} de {totalPages}
                </span>

                <button
                    className="btn btn-icon"
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages}
                    aria-label="Página siguiente"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                </button>

                {/* Separador */}
                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }} />

                {/* Zoom */}
                <button className="btn btn-icon" onClick={zoomOut} aria-label="Alejar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>

                <button
                    className="btn btn-icon"
                    onClick={resetZoom}
                    title={`${Math.round(scale * 100)}%`}
                    aria-label="Restablecer zoom"
                >
                    <span style={{ fontSize: '12px', minWidth: '45px' }}>{Math.round(scale * 100)}%</span>
                </button>

                <button className="btn btn-icon" onClick={zoomIn} aria-label="Acercar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </button>

                {/* Separador */}
                <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)', margin: '0 8px' }} />

                {/* Botón de firma */}
                <button
                    className="btn"
                    onClick={() => setShowSignatureModal(true)}
                    aria-label="Firmar PDF"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <path d="M12 19l7-7 3 3-7 7-3-3z" />
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                        <path d="M2 2l7.586 7.586" />
                        <circle cx="11" cy="11" r="2" />
                    </svg>
                    <span>Firmar</span>
                    {file.signature && (
                        <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22c55e',
                            marginLeft: '4px'
                        }} title="Documento firmado" />
                    )}
                </button>

                {/* Botón descargar PDF firmado */}
                {file.signature && (
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            if (canvasRef.current) {
                                const canvas = canvasRef.current;
                                const imgData = canvas.toDataURL('image/png');

                                // Determinar orientación según dimensiones
                                const orientation = canvas.width > canvas.height ? 'landscape' : 'portrait';

                                // Crear PDF con dimensiones del canvas
                                const pdf = new jsPDF({
                                    orientation,
                                    unit: 'px',
                                    format: [canvas.width, canvas.height]
                                });

                                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                                pdf.save(`${file.name.replace('.pdf', '')}_firmado.pdf`);
                            }
                        }}
                        aria-label="Descargar PDF firmado"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Descargar PDF</span>
                    </button>
                )}
            </div>

            {/* Canvas del PDF */}
            <div className="pdf-canvas-container" ref={containerRef}>
                <canvas ref={canvasRef} />
            </div>

            {/* Modal de firma */}
            {showSignatureModal && (
                <SignatureModal
                    onClose={() => setShowSignatureModal(false)}
                    onSave={handleSignature}
                />
            )}
        </div>
    );
}

export default PdfViewer;
