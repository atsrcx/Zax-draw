import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  key: string;
  action: string;
}

interface ShortcutCategory {
  category: string;
  items: ShortcutItem[];
}

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    category: 'Drawing & Creation Tools',
    items: [
      { key: 'V / 1', action: 'Select tool' },
      { key: 'D / 2', action: 'Draw / Pen pencil' },
      { key: 'E / 3', action: 'Eraser' },
      { key: 'H / Space', action: 'Hand / Pan canvas' },
      { key: 'A', action: 'Arrow / Connector' },
      { key: 'T', action: 'Text tool' },
      { key: 'S', action: 'Sticky Note' },
      { key: 'R', action: 'Rectangle' },
      { key: 'O', action: 'Oval / Circle' },
      { key: 'F', action: 'Frame tool' },
      { key: 'K', action: 'Laser pointer' },
    ],
  },
  {
    category: 'Editing & Organization',
    items: [
      { key: '⌘ / Ctrl + Z', action: 'Undo action' },
      { key: '⌘ + Shift + Z / Ctrl + Y', action: 'Redo action' },
      { key: '⌘ / Ctrl + A', action: 'Select all shapes' },
      { key: '⌘ / Ctrl + D', action: 'Duplicate selection' },
      { key: 'Delete / Backspace', action: 'Delete selected shapes' },
      { key: '⌘ / Ctrl + G', action: 'Group selection' },
      { key: '⌘ + Shift + G', action: 'Ungroup selection' },
      { key: '⌘ / Ctrl + [ / ]', action: 'Send backwards / forwards' },
      { key: 'Shift + Click', action: 'Multi-select shapes' },
      { key: 'Alt / Option + Drag', action: 'Duplicate and move' },
    ],
  },
  {
    category: 'Navigation & View',
    items: [
      { key: 'Shift + 1', action: 'Zoom to fit content' },
      { key: 'Shift + 0', action: 'Reset zoom to 100%' },
      { key: '⌘ / Ctrl + + / -', action: 'Zoom in / out' },
      { key: 'Shift + 2', action: 'Zoom to selection' },
      { key: '⌘ / Ctrl + ;', action: 'Toggle background grid' },
      { key: 'Mouse Wheel / Trackpad', action: 'Pinch to zoom / 2-finger scroll' },
    ],
  },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      id="shortcuts-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="shortcuts-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Keyboard Shortcuts & SDK Guide
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                High-density drawing & infinite canvas workflow hotkeys
              </p>
            </div>
          </div>
          <button
            id="close-shortcuts-modal"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 overflow-y-auto space-y-4">
          {SHORTCUT_CATEGORIES.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {cat.category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {cat.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {item.action}
                    </span>
                    <kbd className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Touch & Trackpad hints */}
          <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-xs leading-relaxed flex items-start gap-2.5">
            <Command className="w-4 h-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
              <span className="font-semibold">Pro-tip:</span> Two-finger pinch to zoom smoothly on trackpads or touchscreens. Hold Spacebar at any time to temporarily switch to pan mode.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            id="dismiss-shortcuts-modal-btn"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
