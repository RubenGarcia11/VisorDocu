import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Menú de ajustes desplegable
 * Usa portal para evitar problemas de z-index con backdrop-filter
 */
function SettingsMenu({ theme, onThemeChange, confettiMode, onConfettiChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const buttonRef = useRef(null);
    const menuRef = useRef(null);

    // Calcular posición del menú al abrir
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }
    }, [isOpen]);

    // Cerrar al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    // Cerrar al presionar Escape
    useEffect(() => {
        function handleEscape(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen]);

    const isLight = theme === 'light';

    const menu = isOpen ? (
        <div
            ref={menuRef}
            className="settings-menu"
            role="menu"
            style={{
                position: 'fixed',
                top: menuPosition.top,
                right: menuPosition.right,
            }}
        >
            <div className="settings-menu-title">Apariencia</div>

            <div
                className="settings-item"
                onClick={() => onThemeChange(isLight ? 'dark' : 'light')}
                role="menuitem"
                tabIndex={0}
            >
                <span className="settings-item-label">
                    {isLight ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                    Modo {isLight ? 'claro' : 'oscuro'}
                </span>
                <div className={`toggle-switch ${isLight ? 'active' : ''}`} />
            </div>

            {/* Modo confetti */}
            <div
                className="settings-item"
                onClick={() => onConfettiChange(!confettiMode)}
                role="menuitem"
                tabIndex={0}
            >
                <span className="settings-item-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5.8 11.3L2 22l10.7-3.79" />
                        <path d="M4 3h.01" />
                        <path d="M22 8h.01" />
                        <path d="M15 2h.01" />
                        <path d="M22 20h.01" />
                        <path d="M22 2l-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                        <path d="M22 13l-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                        <path d="M11 2l.33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
                    </svg>
                    Modo fiesta 🎉
                </span>
                <div className={`toggle-switch ${confettiMode ? 'active' : ''}`} />
            </div>

            <div className="settings-divider" />

            <div className="settings-menu-title">Información</div>

            <div
                className="settings-item"
                onClick={() => window.open('https://github.com/RubenGarcia11', '_blank')}
                role="menuitem"
                tabIndex={0}
            >
                <span className="settings-item-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                    RubenGarcia11
                </span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ color: 'var(--color-text-muted)' }}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
            </div>

            <div className="settings-item" style={{ cursor: 'default' }}>
                <span className="settings-item-label">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Versión 1.0.0
                </span>
            </div>
        </div>
    ) : null;

    return (
        <div className="settings-container">
            <button
                ref={buttonRef}
                className="btn btn-icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Abrir ajustes"
                aria-expanded={isOpen}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
            </button>

            {/* Renderizar menú como portal en el body */}
            {createPortal(menu, document.body)}
        </div>
    );
}

export default SettingsMenu;
