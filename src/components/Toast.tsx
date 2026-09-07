import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-8 sm:bottom-10 right-3 sm:right-4 z-50 flex flex-col gap-1.5 pointer-events-none max-w-[calc(100vw-1.5rem)] sm:max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto flex items-start gap-2.5 p-2.5 bg-slate-900/95 text-white rounded border border-slate-700 shadow-xl backdrop-blur-md transition-all duration-150 animate-in fade-in slide-in-from-bottom-2"
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-100">{toast.title}</p>
            {toast.description && (
              <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{toast.description}</p>
            )}
          </div>
          <button
            id={`dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
