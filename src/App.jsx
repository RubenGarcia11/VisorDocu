import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ViewerPanel from './components/ViewerPanel';
import EmptyState from './components/EmptyState';
import SearchModal from './components/SearchModal';
import PdfMerger from './components/PdfMerger';

// URL del sonido de confetti (sonido corto de celebración)
const CONFETTI_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3';

/**
 * Dispara confetti desde los lados con sonido opcional
 */
function fireConfetti(withSound = true) {
  const defaults = {
    spread: 80,
    ticks: 100,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 40,
    scalar: 1.5,
    colors: ['#6366f1', '#8b5cf6', '#a855f7', '#22c55e', '#f59e0b', '#ec4899']
  };

  confetti({
    ...defaults,
    particleCount: 120,
    origin: { x: 0, y: 0.6 },
    angle: 60
  });

  confetti({
    ...defaults,
    particleCount: 120,
    origin: { x: 1, y: 0.6 },
    angle: 120
  });

  if (withSound) {
    const audio = new Audio(CONFETTI_SOUND_URL);
    audio.volume = 0.4;
    audio.play().catch(() => { });
  }
}

/**
 * Aplicación principal del Visor de Documentación
 */
function App() {
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [pdfMergerOpen, setPdfMergerOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('docviewer-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [confettiMode, setConfettiMode] = useState(() => {
    return localStorage.getItem('docviewer-confetti') === 'true';
  });

  // Keyboard shortcut: Ctrl+K para búsqueda
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Aplicar tema al body
  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('docviewer-theme', theme);
  }, [theme]);

  // Guardar preferencia de confetti
  useEffect(() => {
    localStorage.setItem('docviewer-confetti', confettiMode.toString());
  }, [confettiMode]);

  const activeFile = files.find(f => f.id === activeFileId);

  const handleAddFile = useCallback((file) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      type: getFileType(file.name),
      content: null,
      originalContent: null,
      modified: false,
      signature: null,
    };

    const reader = new FileReader();

    if (newFile.type === 'pdf') {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }

    reader.onload = (e) => {
      newFile.content = e.target.result;
      newFile.originalContent = e.target.result;
      setFiles(prev => [...prev, newFile]);
      setActiveFileId(newFile.id);
      setSidebarOpen(false);

      if (confettiMode) {
        fireConfetti(true);
      }
    };
  }, [confettiMode]);

  const handleUpdateContent = useCallback((fileId, newContent) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          content: newContent,
          modified: newContent !== f.originalContent
        };
      }
      return f;
    }));
  }, []);

  const handleAddSignature = useCallback((fileId, signatureData) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          signature: signatureData,
          modified: true
        };
      }
      return f;
    }));
  }, []);

  const handleSaveFile = useCallback(() => {
    if (!activeFile || activeFile.type === 'pdf') return;

    const blob = new Blob([activeFile.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);

    setFiles(prev => prev.map(f => {
      if (f.id === activeFile.id) {
        return { ...f, originalContent: f.content, modified: false };
      }
      return f;
    }));
  }, [activeFile]);

  const handleCloseFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(files.length > 1 ? files.find(f => f.id !== fileId)?.id : null);
    }
  }, [activeFileId, files]);

  // Seleccionar archivo desde búsqueda
  const handleSelectFromSearch = useCallback((fileId) => {
    setActiveFileId(fileId);
  }, []);

  function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    if (['txt', 'text'].includes(ext)) return 'txt';
    if (ext === 'pdf') return 'pdf';
    if (['md', 'markdown'].includes(ext)) return 'md';
    if (ext === 'json') return 'json';
    if (ext === 'drawio' || ext === 'xml') return 'drawio';
    return 'txt';
  }

  return (
    <div className="app-container">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <Sidebar
        files={files}
        activeFileId={activeFileId}
        isOpen={sidebarOpen}
        onSelectFile={setActiveFileId}
        onAddFile={handleAddFile}
        onCloseFile={handleCloseFile}
      />

      <main className="main-content">
        <Toolbar
          activeFile={activeFile}
          theme={theme}
          onThemeChange={setTheme}
          confettiMode={confettiMode}
          onConfettiChange={setConfettiMode}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSave={handleSaveFile}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenPdfMerger={() => setPdfMergerOpen(true)}
        />

        <div className="viewer-container">
          {activeFile ? (
            <ViewerPanel
              file={activeFile}
              onUpdateContent={(content) => handleUpdateContent(activeFile.id, content)}
              onAddSignature={(sig) => handleAddSignature(activeFile.id, sig)}
            />
          ) : (
            <EmptyState onAddFile={handleAddFile} />
          )}
        </div>
      </main>

      {/* Modal de búsqueda (Ctrl+K) */}
      <SearchModal
        files={files}
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectFile={handleSelectFromSearch}
      />

      {/* Modal de unificar PDFs */}
      <PdfMerger
        isOpen={pdfMergerOpen}
        onClose={() => setPdfMergerOpen(false)}
      />
    </div>
  );
}

export default App;
