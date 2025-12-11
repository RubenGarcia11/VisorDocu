import { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { createSearchIndex, searchInIndex } from '../utils/searchIndex';

/**
 * Modal de búsqueda fuzzy (Command Palette)
 * Se abre con Ctrl+K
 */
function SearchModal({ files, isOpen, onClose, onSelectFile }) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Crear índice de búsqueda
    const searchIndex = useMemo(() => {
        return files.length > 0 ? createSearchIndex(files) : null;
    }, [files]);

    // Resultados de búsqueda
    const results = useMemo(() => {
        if (!searchIndex || !query) return [];
        return searchInIndex(searchIndex, query, 8);
    }, [searchIndex, query]);

    // Focus en input al abrir
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Navegación con teclado
    useEffect(() => {
        function handleKeyDown(e) {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(i => Math.min(i + 1, results.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(i => Math.max(i - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        onSelectFile(results[selectedIndex].id);
                        onClose();
                    }
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onSelectFile, onClose]);

    if (!isOpen) return null;

    const fileTypeIcons = {
        txt: '📄',
        pdf: '📕',
        md: '📝',
        json: '📊'
    };

    return createPortal(
        <div className="search-modal-overlay" onClick={onClose}>
            <div className="search-modal" onClick={e => e.stopPropagation()}>
                <div className="search-input-container">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="search-input"
                        placeholder="Buscar archivos..."
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                    />
                    <kbd className="search-shortcut">ESC</kbd>
                </div>

                {query && (
                    <div className="search-results">
                        {results.length === 0 ? (
                            <div className="search-empty">
                                No se encontraron resultados para "{query}"
                            </div>
                        ) : (
                            results.map((result, index) => (
                                <div
                                    key={result.id}
                                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                    onClick={() => {
                                        onSelectFile(result.id);
                                        onClose();
                                    }}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <span className="search-result-icon">
                                        {fileTypeIcons[result.type] || '📄'}
                                    </span>
                                    <span className="search-result-name">{result.name}</span>
                                    <span className="search-result-type">{result.type.toUpperCase()}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {!query && files.length > 0 && (
                    <div className="search-hint">
                        Escribe para buscar en {files.length} archivo{files.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}

export default SearchModal;
