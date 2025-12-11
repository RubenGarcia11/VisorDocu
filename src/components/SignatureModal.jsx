import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Modal para firmar PDF con canvas
 */
function SignatureModal({ onClose, onSave }) {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    // Inicializar canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Ajustar tamaño del canvas
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Fondo blanco
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Estilo de línea
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }, []);

    // Obtener posición del cursor/touch
    const getPos = useCallback((e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }, []);

    const startDrawing = useCallback((e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        setIsDrawing(true);
    }, [getPos]);

    const draw = useCallback((e) => {
        if (!isDrawing) return;
        e.preventDefault();

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const pos = getPos(e);

        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        setHasSignature(true);
    }, [isDrawing, getPos]);

    const stopDrawing = useCallback(() => {
        setIsDrawing(false);
    }, []);

    // Limpiar firma
    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
    };

    // Guardar firma
    const handleSave = () => {
        if (!hasSignature) return;
        const canvas = canvasRef.current;
        const imageData = canvas.toDataURL('image/png');
        onSave(imageData);
    };

    return (
        <div className="signature-modal-overlay" onClick={onClose}>
            <div className="signature-modal" onClick={(e) => e.stopPropagation()}>
                <div className="signature-modal-header">
                    <h2 className="signature-modal-title">Firmar documento</h2>
                    <button className="btn btn-icon" onClick={onClose} aria-label="Cerrar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <p className="signature-position-info">
                    Dibuja tu firma en el área de abajo. La firma se añadirá al documento PDF.
                </p>

                <div className="signature-canvas-container">
                    <canvas
                        ref={canvasRef}
                        className="signature-canvas"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>

                <div className="signature-actions">
                    <button className="btn" onClick={handleClear}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                        <span>Limpiar</span>
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!hasSignature}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span>Aplicar firma</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignatureModal;
