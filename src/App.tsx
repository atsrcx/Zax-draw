import React, { useState, useEffect, useCallback, useRef } from 'react';
import '@toeverything/theme/style.css';
import { Maximize2 } from 'lucide-react';
import { Header } from './components/Header';
import { CanvasBoard } from './components/CanvasBoard';
import { CanvasStats } from './components/CanvasStats';
import { ShortcutsModal } from './components/ShortcutsModal';
import { ClearConfirmModal } from './components/ClearConfirmModal';
import { Toast } from './components/Toast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { ToastMessage, ZaxDrawEditor } from './types';
import { safeStorageGet, safeStorageSet } from './utils/storage';

export default function App() {
  const [editor, setEditor] = useState<ZaxDrawEditor | null>(null);
  const [boardTitle, setBoardTitle] = useState(() => {
    return safeStorageGet('zaxdraw_board_title', 'Infinite Whiteboard');
  });

  const [isZenMode, setIsZenMode] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Canvas reactive states
  const [shapeCount, setShapeCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
    }
    return false;
  });
  const [isGridMode, setIsGridMode] = useState(true);
  const [isSnapMode, setIsSnapMode] = useState(false);
  const isOnline = useOnlineStatus();

  // Guard against repeated onboarding across StrictMode mounts
  const onboardingTriggeredRef = useRef(false);

  // Stable memoized callback for editor mount
  const handleMount = useCallback((inst: ZaxDrawEditor) => {
    setEditor(inst);
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleTitleChange = (newTitle: string) => {
    setBoardTitle(newTitle);
    safeStorageSet('zaxdraw_board_title', newTitle);
    addToast({
      title: 'Title Updated',
      description: `Renamed to "${newTitle}"`,
      type: 'info',
    });
  };

  // Sync editor state with animation frame throttling
  useEffect(() => {
    if (!editor) return;

    let isSubscribed = true;
    let rafId: number | null = null;

    const syncState = () => {
      if (!isSubscribed) return;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!isSubscribed || !editor) return;
        try {
          setShapeCount(editor.getShapesCount());
          setSelectedCount(editor.getSelectedCount());
          setZoomLevel(editor.getZoomLevel());
        } catch {
          // Safe fallback during layout transitions
        }
      });
    };

    // Immediate initial sync
    syncState();

    // Periodic check for viewport zoom/selection changes
    const interval = setInterval(syncState, 800);

    // Listen to Yjs document updates for shape additions/removals
    const updateHandler = () => {
      syncState();
    };
    editor.doc.spaceDoc.on('update', updateHandler);

    // Initial onboarding check: run once only if board is truly uninitialized
    if (!onboardingTriggeredRef.current) {
      const hasInitialized = safeStorageGet('zaxdraw_welcome_shown');
      if (!hasInitialized) {
        onboardingTriggeredRef.current = true;
        // Delay slightly so IndexedDB store records can populate if present
        const timer = setTimeout(() => {
          if (!isSubscribed || !editor) return;
          try {
            const currentCount = editor.getShapesCount();
            if (currentCount === 0) {
              safeStorageSet('zaxdraw_welcome_shown', 'true');
              editor.addStickyNote({
                color: 'yellow',
                text: '✨ Welcome to Zax-draw!\n\n• Infinite canvas powered by BlockSuite\n• Shapes, connectors & sticky notes\n• All work auto-saves persistently',
              });
              editor.zoomToFit();
            } else {
              safeStorageSet('zaxdraw_welcome_shown', 'true');
            }
          } catch {
            // Safe onboarding fallback
          }
        }, 400);

        return () => {
          isSubscribed = false;
          clearInterval(interval);
          clearTimeout(timer);
          if (rafId) cancelAnimationFrame(rafId);
          editor.doc.spaceDoc.off('update', updateHandler);
        };
      }
    }

    return () => {
      isSubscribed = false;
      clearInterval(interval);
      if (rafId) cancelAnimationFrame(rafId);
      editor.doc.spaceDoc.off('update', updateHandler);
    };
  }, [editor]);

  // Dark mode class & theme sync on document element
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [isDarkMode]);

  // Canvas actions
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleGridMode = () => {
    setIsGridMode((prev) => !prev);
    // Grid mode styling toggle on wrapper if desired
  };

  const handleToggleSnapMode = () => {
    setIsSnapMode((prev) => !prev);
  };

  const handleClearCanvas = () => {
    if (!editor) return;
    editor.clearAll();
    setShapeCount(0);
    setSelectedCount(0);
    addToast({
      title: 'Canvas Cleared',
      description: 'All shapes have been removed from the board.',
      type: 'info',
    });
  };

  return (
    <div
      id="zaxdraw-app-root"
      className="relative w-screen h-screen overflow-hidden bg-[#f8f9fa] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100"
    >
      {/* Top Application Header */}
      <Header
        editor={editor}
        boardTitle={boardTitle}
        onTitleChange={handleTitleChange}
        isZenMode={isZenMode}
        onToggleZenMode={() => setIsZenMode((prev) => !prev)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenClearModal={() => setIsClearModalOpen(true)}
        addToast={addToast}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isGridMode={isGridMode}
        onToggleGridMode={handleToggleGridMode}
        isSnapMode={isSnapMode}
        onToggleSnapMode={handleToggleSnapMode}
      />

      {/* Zen Mode Floating Exit Button */}
      {isZenMode && (
        <button
          id="exit-zen-mode-btn"
          onClick={() => setIsZenMode(false)}
          className="fixed top-3 right-3 z-50 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 text-white border border-slate-700 rounded shadow-md text-xs font-medium hover:bg-slate-800 transition-all hover:scale-105 animate-in fade-in slide-in-from-top-2 cursor-pointer"
          title="Exit Zen Mode (Show controls)"
        >
          <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Show Controls</span>
        </button>
      )}

      {/* Main Canvas Container */}
      <div
        id="zaxdraw-canvas-wrapper"
        className={`absolute inset-x-0 ${
          isZenMode ? 'top-0 bottom-0' : 'top-12 bottom-0 sm:bottom-6'
        }`}
      >
        <CanvasBoard onMount={handleMount} />
      </div>

      {/* High Density Status Bar */}
      {!isZenMode ? (
        <footer
          id="app-status-bar"
          className="hidden sm:flex fixed bottom-0 left-0 right-0 h-6 bg-slate-800 dark:bg-slate-900 text-white dark:text-slate-300 border-t border-slate-700 dark:border-slate-800 items-center px-3 justify-between text-[10px] font-mono select-none z-30 tracking-tight"
        >
          <div className="flex items-center gap-3">
            <span className="opacity-70">Status:</span>
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live (Connected)
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                Offline (Cached)
              </span>
            )}
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="opacity-80 hidden sm:inline">Shapes: {shapeCount}</span>
            {selectedCount > 0 && (
              <span className="text-blue-400 font-semibold">({selectedCount} selected)</span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="opacity-70 hidden sm:inline">Zoom: {Math.round(zoomLevel * 100)}%</span>
            <span className="opacity-40 hidden sm:inline">•</span>
            <span className="opacity-70 hidden md:inline">Auto-saved (IndexedDB)</span>
            <span className="opacity-40 hidden lg:inline">•</span>
            <span className="text-emerald-400 hidden lg:inline">BlockSuite Engine</span>
            <span>Shortcut: ⌘Z (Undo)</span>
          </div>
        </footer>
      ) : (
        <CanvasStats
          shapeCount={shapeCount}
          selectedCount={selectedCount}
          zoomLevel={zoomLevel}
        />
      )}

      {/* Offline Mode Indicator */}
      <OfflineIndicator />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Clear Confirmation Modal */}
      <ClearConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearCanvas}
        shapeCount={shapeCount}
      />

      {/* Notification Toasts */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
