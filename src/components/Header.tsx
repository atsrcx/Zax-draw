import React, { useState, useRef, useEffect } from 'react';
import {
  Editor,
  createShapeId,
  getSnapshot,
  loadSnapshot,
  toRichText,
} from 'tldraw';
import {
  Sparkles,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Grid,
  Moon,
  Sun,
  Trash2,
  HelpCircle,
  ChevronDown,
  FileImage,
  FileCode,
  FileText,
  Copy,
  Plus,
  StickyNote,
  Square,
  Circle,
  Diamond,
  Triangle,
  Star,
  Cloud,
  ArrowRight,
  Type,
  Layout,
  Maximize2,
  Minimize2,
  Workflow,
  Kanban,
  Cpu,
  Smartphone,
  Check,
  Edit2,
} from 'lucide-react';
import { CANVAS_TEMPLATES } from '../templates/canvasTemplates';
import { ToastMessage } from '../types';

interface HeaderProps {
  editor: Editor | null;
  boardTitle: string;
  onTitleChange: (title: string) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  onOpenShortcuts: () => void;
  onOpenClearModal: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isGridMode: boolean;
  onToggleGridMode: () => void;
  isSnapMode: boolean;
  onToggleSnapMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  editor,
  boardTitle,
  onTitleChange,
  isZenMode,
  onToggleZenMode,
  onOpenShortcuts,
  onOpenClearModal,
  addToast,
  isDarkMode,
  onToggleDarkMode,
  isGridMode,
  onToggleGridMode,
  isSnapMode,
  onToggleSnapMode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(boardTitle);
  const [openDropdown, setOpenDropdown] = useState<'templates' | 'quickAdd' | 'export' | 'view' | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    const trimmed = tempTitle.trim();
    if (trimmed) {
      onTitleChange(trimmed);
    } else {
      setTempTitle(boardTitle);
    }
    setIsEditingTitle(false);
  };

  const toggleDropdown = (key: 'templates' | 'quickAdd' | 'export' | 'view') => {
    setOpenDropdown((curr) => (curr === key ? null : key));
  };

  // Template insert handler
  const handleInsertTemplate = (templateId: string) => {
    if (!editor) return;
    const tpl = CANVAS_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    try {
      tpl.create(editor);
      addToast({
        title: `Loaded ${tpl.title}`,
        description: 'Template components have been added to the canvas.',
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to load template', err);
      addToast({
        title: 'Could not load template',
        description: 'An error occurred while creating shapes.',
        type: 'error',
      });
    }
    setOpenDropdown(null);
  };

  // Quick shape additions
  const handleAddSticky = (color: 'yellow' | 'light-blue' | 'light-green' | 'light-violet' | 'light-red') => {
    if (!editor) return;
    const center = editor.getViewportPageBounds().center;
    editor.createShape({
      id: createShapeId(),
      type: 'note',
      x: Math.round(center.x - 80),
      y: Math.round(center.y - 80),
      props: {
        color: color as any,
        richText: toRichText('New Note'),
        size: 's',
      },
    });
    setOpenDropdown(null);
  };

  const handleAddGeo = (geo: 'rectangle' | 'ellipse' | 'diamond' | 'triangle' | 'star' | 'cloud', color = 'black') => {
    if (!editor) return;
    const center = editor.getViewportPageBounds().center;
    editor.createShape({
      id: createShapeId(),
      type: 'geo',
      x: Math.round(center.x - 90),
      y: Math.round(center.y - 60),
      props: {
        geo,
        w: 180,
        h: 120,
        color: color as any,
        fill: 'semi',
        richText: toRichText(''),
      },
    });
    setOpenDropdown(null);
  };

  const handleAddText = () => {
    if (!editor) return;
    const center = editor.getViewportPageBounds().center;
    editor.createShape({
      id: createShapeId(),
      type: 'text',
      x: Math.round(center.x - 70),
      y: Math.round(center.y - 20),
      props: {
        richText: toRichText('Heading Text'),
        size: 'm',
        autoSize: true,
      },
    });
    setOpenDropdown(null);
  };

  const handleAddArrow = () => {
    if (!editor) return;
    const center = editor.getViewportPageBounds().center;
    editor.createShape({
      id: createShapeId(),
      type: 'arrow',
      x: Math.round(center.x - 80),
      y: Math.round(center.y),
      props: {
        start: { x: 0, y: 0 },
        end: { x: 160, y: 0 },
        richText: toRichText('Connect'),
        size: 'm',
      },
    });
    setOpenDropdown(null);
  };

  const handleAddFrame = () => {
    if (!editor) return;
    const center = editor.getViewportPageBounds().center;
    editor.createShape({
      id: createShapeId(),
      type: 'frame',
      x: Math.round(center.x - 200),
      y: Math.round(center.y - 150),
      props: {
        w: 400,
        h: 300,
        name: 'Design Frame',
      },
    });
    setOpenDropdown(null);
  };

  // Export handlers
  const handleExport = async (format: 'png' | 'svg' | 'json') => {
    if (!editor) return;
    setOpenDropdown(null);

    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (shapeIds.length === 0) {
      addToast({
        title: 'Canvas is empty',
        description: 'Draw or insert some shapes before exporting.',
        type: 'info',
      });
      return;
    }

    try {
      if (format === 'json') {
        const snapshot = getSnapshot(editor.store);
        const jsonStr = JSON.stringify(snapshot, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${boardTitle.toLowerCase().replace(/\s+/g, '-')}-snapshot.tldr`;
        a.click();
        URL.revokeObjectURL(url);
        addToast({
          title: 'Snapshot Exported',
          description: 'Downloaded .tldr snapshot successfully.',
          type: 'success',
        });
        return;
      }

      const res = await editor.toImage(shapeIds, {
        format,
        background: true,
        padding: 32,
        scale: 2,
      });

      const blob = (res as any)?.blob || res;
      if (!blob) throw new Error('No blob returned from editor');

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardTitle.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      a.click();
      URL.revokeObjectURL(url);

      addToast({
        title: `Exported as ${format.toUpperCase()}`,
        description: `Saved high-resolution ${format.toUpperCase()} image.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Export error:', err);
      addToast({
        title: 'Export Failed',
        description: 'Could not generate export file. Please try again.',
        type: 'error',
      });
    }
  };

  const handleCopyPng = async () => {
    if (!editor) return;
    setOpenDropdown(null);

    const shapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (shapeIds.length === 0) {
      addToast({
        title: 'Canvas is empty',
        description: 'Nothing to copy to clipboard.',
        type: 'info',
      });
      return;
    }

    try {
      const res = await editor.toImage(shapeIds, {
        format: 'png',
        background: true,
        padding: 24,
        scale: 2,
      });

      const blob = (res as any)?.blob || res;
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        addToast({
          title: 'Copied to Clipboard',
          description: 'Canvas image copied as PNG.',
          type: 'success',
        });
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      addToast({
        title: 'Copy Failed',
        description: 'Could not copy to clipboard. Try standard PNG export instead.',
        type: 'warning',
      });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);
        loadSnapshot(editor.store, data);
        editor.zoomToFit({ animation: { duration: 300 } });
        addToast({
          title: 'Snapshot Imported',
          description: `Restored whiteboard from ${file.name}.`,
          type: 'success',
        });
      } catch (err) {
        console.error('Failed to parse snapshot:', err);
        addToast({
          title: 'Import Failed',
          description: 'The selected file is not a valid Tldraw snapshot.',
          type: 'error',
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
    setOpenDropdown(null);
  };

  const getTemplateIcon = (icon: string) => {
    switch (icon) {
      case 'Workflow':
        return <Workflow className="w-4 h-4 text-emerald-500" />;
      case 'Kanban':
        return <Kanban className="w-4 h-4 text-blue-500" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-500" />;
      case 'Smartphone':
        return <Smartphone className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-violet-500" />;
    }
  };

  return (
    <header
      id="app-header-container"
      ref={dropdownRef}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isZenMode
          ? '-translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <div
        id="app-header-bar"
        className="h-12 px-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-slate-800 dark:text-slate-200 z-20"
      >
        {/* Left Section: Brand & Editable Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs tracking-tight shadow-xs">
              td
            </div>
            <div className="flex flex-col min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-1">
                  <input
                    ref={titleInputRef}
                    id="board-title-input"
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSubmit();
                      if (e.key === 'Escape') {
                        setTempTitle(boardTitle);
                        setIsEditingTitle(false);
                      }
                    }}
                    onBlur={handleTitleSubmit}
                    className="px-2 py-0.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-36 sm:w-48 text-slate-900 dark:text-slate-100"
                    maxLength={60}
                  />
                  <button
                    id="save-board-title-btn"
                    onClick={handleTitleSubmit}
                    className="p-1 rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    title="Save title"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="edit-board-title-trigger"
                  onClick={() => setIsEditingTitle(true)}
                  className="group flex items-center gap-1.5 text-left -ml-1 px-1 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors truncate max-w-[140px] sm:max-w-[220px]"
                  title="Click to rename"
                >
                  <span className="text-xs font-bold leading-tight text-slate-800 dark:text-slate-200 truncate">
                    {boardTitle}
                  </span>
                  <Edit2 className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              )}
              <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">
                Edited just now
              </span>
            </div>
          </div>
        </div>

        {/* Center / Action Dropdowns */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Templates Dropdown */}
          <div className="relative">
            <button
              id="templates-dropdown-trigger"
              onClick={() => toggleDropdown('templates')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                openDropdown === 'templates'
                  ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Templates</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'templates' && (
              <div
                id="templates-dropdown-menu"
                className="absolute left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  Starter Templates
                </div>
                <div className="py-1 max-h-80 overflow-y-auto">
                  {CANVAS_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      id={`template-item-${tpl.id}`}
                      onClick={() => handleInsertTemplate(tpl.id)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start gap-2.5 transition-colors group"
                    >
                      <div className="p-1 rounded bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        {getTemplateIcon(tpl.icon)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {tpl.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {tpl.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Dropdown */}
          <div className="relative">
            <button
              id="quick-add-dropdown-trigger"
              onClick={() => toggleDropdown('quickAdd')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                openDropdown === 'quickAdd'
                  ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-blue-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Quick Insert</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {openDropdown === 'quickAdd' && (
              <div
                id="quick-add-dropdown-menu"
                className="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* Sticky Notes */}
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Sticky Notes
                </div>
                <div className="flex items-center gap-1.5 mb-3 px-1">
                  <button
                    id="add-sticky-yellow"
                    onClick={() => handleAddSticky('yellow')}
                    className="w-6 h-6 rounded bg-amber-200 hover:scale-110 transition-transform shadow-xs"
                    title="Yellow Note"
                  />
                  <button
                    id="add-sticky-blue"
                    onClick={() => handleAddSticky('light-blue')}
                    className="w-6 h-6 rounded bg-sky-200 hover:scale-110 transition-transform shadow-xs"
                    title="Blue Note"
                  />
                  <button
                    id="add-sticky-green"
                    onClick={() => handleAddSticky('light-green')}
                    className="w-6 h-6 rounded bg-emerald-200 hover:scale-110 transition-transform shadow-xs"
                    title="Green Note"
                  />
                  <button
                    id="add-sticky-violet"
                    onClick={() => handleAddSticky('light-violet')}
                    className="w-6 h-6 rounded bg-purple-200 hover:scale-110 transition-transform shadow-xs"
                    title="Violet Note"
                  />
                  <button
                    id="add-sticky-red"
                    onClick={() => handleAddSticky('light-red')}
                    className="w-6 h-6 rounded bg-rose-200 hover:scale-110 transition-transform shadow-xs"
                    title="Pink Note"
                  />
                </div>

                {/* Geo Shapes */}
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                  Shapes & Connectors
                </div>
                <div className="grid grid-cols-3 gap-1 mb-2">
                  <button
                    id="add-geo-rectangle"
                    onClick={() => handleAddGeo('rectangle', 'light-blue')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <Square className="w-3.5 h-3.5 text-blue-600" />
                    <span>Box</span>
                  </button>
                  <button
                    id="add-geo-ellipse"
                    onClick={() => handleAddGeo('ellipse', 'green')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <Circle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Circle</span>
                  </button>
                  <button
                    id="add-geo-diamond"
                    onClick={() => handleAddGeo('diamond', 'yellow')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <Diamond className="w-3.5 h-3.5 text-amber-500" />
                    <span>Diamond</span>
                  </button>
                  <button
                    id="add-geo-star"
                    onClick={() => handleAddGeo('star', 'yellow')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span>Star</span>
                  </button>
                  <button
                    id="add-geo-cloud"
                    onClick={() => handleAddGeo('cloud', 'light-blue')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <Cloud className="w-3.5 h-3.5 text-sky-500" />
                    <span>Cloud</span>
                  </button>
                  <button
                    id="add-arrow-connector"
                    onClick={handleAddArrow}
                    className="flex flex-col items-center gap-1 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>Arrow</span>
                  </button>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Text & Frame */}
                <div className="grid grid-cols-2 gap-1">
                  <button
                    id="add-text-block"
                    onClick={handleAddText}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <Type className="w-3.5 h-3.5 text-slate-500" />
                    <span>Text Block</span>
                  </button>
                  <button
                    id="add-frame-container"
                    onClick={handleAddFrame}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300"
                  >
                    <Layout className="w-3.5 h-3.5 text-slate-500" />
                    <span>Frame</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Zoom & Fit Controls */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded">
            <button
              id="zoom-out-btn"
              onClick={() => editor?.zoomOut()}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Zoom Out (Cmd -)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              id="zoom-in-btn"
              onClick={() => editor?.zoomIn()}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Zoom In (Cmd +)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="zoom-to-fit-btn"
              onClick={() => editor?.zoomToFit({ animation: { duration: 300 } })}
              className="px-2 py-0.5 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Zoom to Fit (Shift 1)"
            >
              Fit
            </button>
          </div>
        </div>

        {/* Right Section: Collaborators, View Toggles, Export & Utilities */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Collaborator Avatars (High Density theme) */}
          <div className="hidden md:flex -space-x-1.5 items-center mr-2">
            <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white font-semibold">
              JD
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white font-semibold">
              AM
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] text-white font-semibold">
              +3
            </div>
          </div>

          {/* Grid Toggle */}
          <button
            id="toggle-grid-btn"
            onClick={onToggleGridMode}
            className={`p-1.5 rounded border text-xs font-medium transition-colors ${
              isGridMode
                ? 'bg-blue-50 dark:bg-slate-800 border-blue-500 text-blue-700 dark:text-blue-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
            title={`Toggle Grid (${isGridMode ? 'On' : 'Off'})`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Theme Toggle (Dark/Light) */}
          <button
            id="toggle-dark-mode-btn"
            onClick={onToggleDarkMode}
            className="p-1.5 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} Mode`}
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {/* Export & Share Dropdown (Primary Action) */}
          <div className="relative">
            <button
              id="export-dropdown-trigger"
              onClick={() => toggleDropdown('export')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Share & Export</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {openDropdown === 'export' && (
              <div
                id="export-dropdown-menu"
                className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  Export Canvas
                </div>

                <button
                  id="export-png-btn"
                  onClick={() => handleExport('png')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <FileImage className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Export as PNG</div>
                    <div className="text-[10px] text-slate-400">Crisp high-res raster</div>
                  </div>
                </button>

                <button
                  id="export-svg-btn"
                  onClick={() => handleExport('svg')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Export as SVG</div>
                    <div className="text-[10px] text-slate-400">Scalable vector artwork</div>
                  </div>
                </button>

                <button
                  id="copy-png-clipboard-btn"
                  onClick={handleCopyPng}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Copy className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold">Copy Image to Clipboard</div>
                    <div className="text-[10px] text-slate-400">Paste directly into apps</div>
                  </div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  id="export-json-snapshot-btn"
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-500" />
                  <div>
                    <div className="font-semibold">Save Snapshot (.tldr)</div>
                    <div className="text-[10px] text-slate-400">Complete board backup</div>
                  </div>
                </button>

                <button
                  id="import-json-snapshot-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <Upload className="w-4 h-4 text-teal-600" />
                  <div>
                    <div className="font-semibold">Import Snapshot</div>
                    <div className="text-[10px] text-slate-400">Restore from .tldr or JSON</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Hidden File Input for snapshot loading */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.tldr"
            className="hidden"
            onChange={handleImportFile}
          />

          {/* Clear Canvas */}
          <button
            id="clear-canvas-trigger"
            onClick={onOpenClearModal}
            className="p-1.5 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Shortcuts Guide Modal */}
          <button
            id="shortcuts-modal-trigger"
            onClick={onOpenShortcuts}
            className="p-1.5 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Shortcuts & Gestures Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Zen / Fullscreen Toggle */}
          <button
            id="toggle-zen-mode-btn"
            onClick={onToggleZenMode}
            className="p-1.5 rounded border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Toggle Zen Mode (Fullscreen Whiteboard)"
          >
            {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
