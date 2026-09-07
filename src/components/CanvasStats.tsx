import React from 'react';
import { Layers, MousePointerClick, ZoomIn } from 'lucide-react';

interface CanvasStatsProps {
  shapeCount: number;
  selectedCount: number;
  zoomLevel: number;
}

export const CanvasStats: React.FC<CanvasStatsProps> = ({
  shapeCount,
  selectedCount,
  zoomLevel,
}) => {
  return (
    <div
      id="canvas-stats-pill"
      className="fixed bottom-3 left-3 z-30 flex items-center gap-2.5 px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md shadow-md backdrop-blur-md text-[10px] font-mono tracking-tight pointer-events-auto select-none transition-colors"
    >
      <div className="flex items-center gap-1.5" title="Total shapes on canvas">
        <Layers className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <span>{shapeCount} {shapeCount === 1 ? 'shape' : 'shapes'}</span>
      </div>

      <div className="w-px h-2.5 bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5" title="Selected shapes">
        <MousePointerClick className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <span>{selectedCount} selected</span>
      </div>

      <div className="w-px h-2.5 bg-slate-200 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5" title="Current zoom level">
        <ZoomIn className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        <span>{Math.round(zoomLevel * 100)}%</span>
      </div>
    </div>
  );
};
