import { useState, useEffect, useRef, useMemo } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import ReadingTimeBadge from '../ReadingTimeBadge';

// Configurar marked con highlight.js
marked.setOptions({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(code, { language: lang }).value;
            } catch (e) {
                console.error(e);
            }
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
});

/**
 * Visor/Editor de archivos Markdown
 * Panel dividido: editor a la izquierda, preview a la derecha
 */
function MarkdownViewer({ file, onUpdateContent }) {
    const [activeTab, setActiveTab] = useState('split'); // 'edit', 'preview', 'split'

    // Renderizar markdown a HTML
    const htmlContent = useMemo(() => {
        if (!file.content) return '';
        try {
            return marked.parse(file.content);
        } catch (e) {
            console.error('Error parsing markdown:', e);
            return '<p>Error al procesar el Markdown</p>';
        }
    }, [file.content]);

    // Manejar cambios
    const handleChange = (e) => {
        onUpdateContent(e.target.value);
    };

    // Contar estadísticas
    const stats = useMemo(() => {
        const content = file.content || '';
        const lines = content.split('\n').length;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const chars = content.length;
        return { lines, words, chars };
    }, [file.content]);

    return (
        <div className="text-editor">
            {/* Tabs para cambiar vista */}
            <div className="tab-switcher">
                <button
                    className={`tab-btn ${activeTab === 'edit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('edit')}
                >
                    Editar
                </button>
                <button
                    className={`tab-btn ${activeTab === 'split' ? 'active' : ''}`}
                    onClick={() => setActiveTab('split')}
                >
                    Dividido
                </button>
                <button
                    className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                >
                    Vista previa
                </button>
            </div>

            {/* Contenido */}
            <div className="markdown-editor">
                {/* Editor */}
                {(activeTab === 'edit' || activeTab === 'split') && (
                    <div className="markdown-source" style={activeTab === 'edit' ? { borderRight: 'none' } : {}}>
                        <textarea
                            value={file.content || ''}
                            onChange={handleChange}
                            spellCheck="false"
                            placeholder="Escribe tu Markdown aquí..."
                            aria-label="Editor de Markdown"
                        />
                    </div>
                )}

                {/* Preview */}
                {(activeTab === 'preview' || activeTab === 'split') && (
                    <div
                        className="markdown-preview"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                        aria-label="Vista previa del Markdown"
                    />
                )}
            </div>

            {/* Barra de estado */}
            <div className="status-bar">
                <div className="status-bar-left">
                    <span>{stats.lines} líneas</span>
                    <span>{stats.words} palabras</span>
                    <span>{stats.chars} caracteres</span>
                </div>
                <div className="status-bar-right">
                    <span>Markdown</span>
                </div>
            </div>
        </div>
    );
}

export default MarkdownViewer;
