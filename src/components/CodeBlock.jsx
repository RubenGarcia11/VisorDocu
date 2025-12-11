import { useState, useCallback } from 'react';

/**
 * Bloque de código con botón de copiar
 */
function CodeBlock({ code, language = 'plaintext' }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    }, [code]);

    return (
        <div className="code-block-container">
            <div className="code-block-header">
                <span className="code-block-language">{language}</span>
                <button
                    className="code-copy-btn"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copiado' : 'Copiar código'}
                >
                    {copied ? (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span>¡Copiado!</span>
                        </>
                    ) : (
                        <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copiar</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="code-block">
                <code>{code}</code>
            </pre>
        </div>
    );
}

export default CodeBlock;
