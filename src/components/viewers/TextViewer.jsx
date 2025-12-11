import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Visor/Editor de archivos de texto plano
 * Incluye numeración de líneas sincronizada
 */
function TextViewer({ file, onUpdateContent }) {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);

    // Calcular números de línea
    const lineNumbers = useMemo(() => {
        if (!file.content) return [1];
        const lines = file.content.split('\n');
        return lines.map((_, i) => i + 1);
    }, [file.content]);

    // Sincronizar scroll de números de línea con textarea
    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    // Manejar cambios en el contenido
    const handleChange = (e) => {
        onUpdateContent(e.target.value);
    };

    return (
        <div className="text-editor">
            <div className="text-editor-content">
                {/* Números de línea */}
                <div className="line-numbers" ref={lineNumbersRef} aria-hidden="true">
                    {lineNumbers.map(num => (
                        <span key={num}>{num}</span>
                    ))}
                </div>

                {/* Área de texto */}
                <textarea
                    ref={textareaRef}
                    className="text-area"
                    value={file.content || ''}
                    onChange={handleChange}
                    onScroll={handleScroll}
                    spellCheck="false"
                    aria-label={`Editor de contenido para ${file.name}`}
                />
            </div>

            {/* Barra de estado */}
            <div className="status-bar">
                <div className="status-bar-left">
                    <span>{lineNumbers.length} líneas</span>
                    <span>{file.content?.length || 0} caracteres</span>
                </div>
                <div className="status-bar-right">
                    <span>UTF-8</span>
                    <span>Texto plano</span>
                </div>
            </div>
        </div>
    );
}

export default TextViewer;
