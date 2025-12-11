import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Enlace inteligente con popover de previsualización
 * Estilo Wikipedia/Notion
 */
function SmartLink({ href, children, files }) {
    const [showPopover, setShowPopover] = useState(false);
    const [preview, setPreview] = useState(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const linkRef = useRef(null);
    const timeoutRef = useRef(null);

    // Buscar el archivo destino por nombre
    useEffect(() => {
        if (showPopover && !preview && files) {
            const targetFile = files.find(f =>
                f.name.toLowerCase() === href.toLowerCase() ||
                f.name.toLowerCase().includes(href.toLowerCase())
            );

            if (targetFile && typeof targetFile.content === 'string') {
                // Extraer título y primer párrafo
                const lines = targetFile.content.split('\n').filter(l => l.trim());
                const title = lines[0]?.replace(/^#+\s*/, '') || targetFile.name;
                const excerpt = lines.slice(1, 4).join(' ').substring(0, 200) + '...';

                setPreview({ title, excerpt, type: targetFile.type });
            }
        }
    }, [showPopover, preview, href, files]);

    const handleMouseEnter = () => {
        timeoutRef.current = setTimeout(() => {
            if (linkRef.current) {
                const rect = linkRef.current.getBoundingClientRect();
                setPosition({
                    top: rect.bottom + 8,
                    left: Math.max(16, Math.min(rect.left, window.innerWidth - 320))
                });
            }
            setShowPopover(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowPopover(false);
    };

    const popover = showPopover && preview ? (
        <div
            className="smart-link-popover"
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
            }}
        >
            <div className="smart-link-popover-header">
                <span className="smart-link-popover-type">{preview.type?.toUpperCase()}</span>
                <h4>{preview.title}</h4>
            </div>
            <p className="smart-link-popover-excerpt">{preview.excerpt}</p>
        </div>
    ) : null;

    return (
        <>
            <a
                ref={linkRef}
                href={href}
                className="smart-link"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </a>
            {createPortal(popover, document.body)}
        </>
    );
}

export default SmartLink;
