import { useState, useMemo, useCallback } from 'react';

/**
 * Visor/Editor de archivos JSON
 * Con validación, formateo y vista de árbol
 */
function JsonViewer({ file, onUpdateContent }) {
    const [viewMode, setViewMode] = useState('split'); // 'edit', 'tree', 'split'

    // Validar y parsear JSON
    const { isValid, parsed, error } = useMemo(() => {
        if (!file.content) return { isValid: true, parsed: null, error: null };
        try {
            const parsed = JSON.parse(file.content);
            return { isValid: true, parsed, error: null };
        } catch (e) {
            return { isValid: false, parsed: null, error: e.message };
        }
    }, [file.content]);

    // Manejar cambios
    const handleChange = (e) => {
        onUpdateContent(e.target.value);
    };

    // Formatear JSON
    const handleFormat = useCallback(() => {
        if (isValid && parsed !== null) {
            const formatted = JSON.stringify(parsed, null, 2);
            onUpdateContent(formatted);
        }
    }, [isValid, parsed, onUpdateContent]);

    // Minificar JSON
    const handleMinify = useCallback(() => {
        if (isValid && parsed !== null) {
            const minified = JSON.stringify(parsed);
            onUpdateContent(minified);
        }
    }, [isValid, parsed, onUpdateContent]);

    return (
        <div className="json-editor">
            {/* Toolbar de JSON */}
            <div className="json-toolbar">
                <button className="btn btn-icon" onClick={handleFormat} disabled={!isValid} title="Formatear">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <polyline points="4 7 4 4 20 4 20 7" />
                        <line x1="9" y1="20" x2="15" y2="20" />
                        <line x1="12" y1="4" x2="12" y2="20" />
                    </svg>
                </button>
                <button className="btn btn-icon" onClick={handleMinify} disabled={!isValid} title="Minificar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>

                {/* Tabs */}
                <div className="tab-switcher" style={{ flex: 1, border: 'none', marginLeft: '16px' }}>
                    <button
                        className={`tab-btn ${viewMode === 'edit' ? 'active' : ''}`}
                        onClick={() => setViewMode('edit')}
                    >
                        Editor
                    </button>
                    <button
                        className={`tab-btn ${viewMode === 'split' ? 'active' : ''}`}
                        onClick={() => setViewMode('split')}
                    >
                        Dividido
                    </button>
                    <button
                        className={`tab-btn ${viewMode === 'tree' ? 'active' : ''}`}
                        onClick={() => setViewMode('tree')}
                        disabled={!isValid}
                    >
                        Árbol
                    </button>
                </div>

                {/* Estado de validación */}
                <span className={`json-status ${isValid ? 'valid' : 'invalid'}`}>
                    {isValid ? '✓ Válido' : '✗ Inválido'}
                </span>
            </div>

            {/* Contenido */}
            <div className={`json-content ${viewMode === 'split' ? 'split' : ''}`}>
                {/* Editor */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className="json-textarea-container">
                        <textarea
                            className="json-textarea"
                            value={file.content || ''}
                            onChange={handleChange}
                            spellCheck="false"
                            placeholder='{ "clave": "valor" }'
                            aria-label="Editor de JSON"
                        />
                    </div>
                )}

                {/* Vista de árbol */}
                {(viewMode === 'tree' || viewMode === 'split') && isValid && (
                    <div className="json-tree-container">
                        <JsonTree data={parsed} />
                    </div>
                )}

                {/* Error */}
                {!isValid && viewMode === 'tree' && (
                    <div className="json-tree-container">
                        <div style={{ color: '#ef4444', padding: '16px' }}>
                            <strong>Error de sintaxis:</strong><br />
                            {error}
                        </div>
                    </div>
                )}
            </div>

            {/* Barra de estado */}
            <div className="status-bar">
                <div className="status-bar-left">
                    <span>{(file.content || '').split('\n').length} líneas</span>
                    <span>{(file.content || '').length} caracteres</span>
                </div>
                <div className="status-bar-right">
                    <span>JSON</span>
                </div>
            </div>
        </div>
    );
}

/**
 * Componente recursivo para renderizar árbol JSON
 */
function JsonTree({ data, depth = 0 }) {
    const [collapsed, setCollapsed] = useState(depth > 2);

    if (data === null) {
        return <span className="json-null">null</span>;
    }

    if (typeof data === 'boolean') {
        return <span className="json-boolean">{data.toString()}</span>;
    }

    if (typeof data === 'number') {
        return <span className="json-number">{data}</span>;
    }

    if (typeof data === 'string') {
        return <span className="json-string">"{data}"</span>;
    }

    if (Array.isArray(data)) {
        if (data.length === 0) {
            return <span className="json-bracket">[]</span>;
        }

        return (
            <div>
                <span
                    className="json-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    role="button"
                    tabIndex={0}
                >
                    {collapsed ? '▶' : '▼'}
                </span>
                <span className="json-bracket">[</span>
                {collapsed ? (
                    <span className="json-bracket" style={{ color: 'var(--color-text-muted)' }}> {data.length} items </span>
                ) : (
                    <div className="json-node">
                        {data.map((item, index) => (
                            <div key={index}>
                                <JsonTree data={item} depth={depth + 1} />
                                {index < data.length - 1 && ','}
                            </div>
                        ))}
                    </div>
                )}
                <span className="json-bracket">]</span>
            </div>
        );
    }

    if (typeof data === 'object') {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return <span className="json-bracket">{'{}'}</span>;
        }

        return (
            <div>
                <span
                    className="json-toggle"
                    onClick={() => setCollapsed(!collapsed)}
                    role="button"
                    tabIndex={0}
                >
                    {collapsed ? '▶' : '▼'}
                </span>
                <span className="json-bracket">{'{'}</span>
                {collapsed ? (
                    <span className="json-bracket" style={{ color: 'var(--color-text-muted)' }}> {keys.length} keys </span>
                ) : (
                    <div className="json-node">
                        {keys.map((key, index) => (
                            <div key={key}>
                                <span className="json-key">"{key}"</span>: <JsonTree data={data[key]} depth={depth + 1} />
                                {index < keys.length - 1 && ','}
                            </div>
                        ))}
                    </div>
                )}
                <span className="json-bracket">{'}'}</span>
            </div>
        );
    }

    return <span>{String(data)}</span>;
}

export default JsonViewer;
