import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';
import { safeDeleteIndexedDB, safeStorageRemove } from '../utils/storage';
import { clearDocPersistence } from '../lib/blocksuite/store';

interface Props {
  children: ReactNode;
  onResetData?: () => Promise<void> | void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isResetting: boolean;
}

export class CanvasErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isResetting: false,
  };

  public static getDerivedStateFromError(error: unknown): Partial<State> {
    const err = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: err };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const timestamp = new Date().toISOString();
    console.error(`[DIAGNOSTIC] CanvasErrorBoundary (${timestamp}):`, error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleHardReset = async () => {
    this.setState({ isResetting: true });
    try {
      if (this.props.onResetData) {
        await this.props.onResetData();
      }

      // Safely clear Zax-draw board local persistence
      safeStorageRemove('zaxdraw_board_title');
      safeStorageRemove('zaxdraw_welcome_shown');
      safeStorageRemove('tldraw_board_title');
      safeStorageRemove('tldraw_welcome_shown');
      safeStorageRemove('tldraw_sdk_main_board');

      // Clear BlockSuite IndexedDB persistence
      await clearDocPersistence();
      await safeDeleteIndexedDB('tldraw_sdk_main_board');
      await safeDeleteIndexedDB('tldraw');
    } catch (e) {
      console.warn('[CanvasErrorBoundary] Error while clearing corrupted canvas persistence:', e);
    } finally {
      if (typeof window !== 'undefined') {
        window.location.reload();
      } else {
        this.setState({ hasError: false, error: null, isResetting: false });
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      const isPersistenceLikely =
        this.state.error?.message?.toLowerCase().includes('indexeddb') ||
        this.state.error?.message?.toLowerCase().includes('store') ||
        this.state.error?.message?.toLowerCase().includes('record') ||
        this.state.error?.message?.toLowerCase().includes('migration');

      return (
        <div
          id="canvas-error-boundary"
          className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white p-6 z-40 select-none"
        >
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h2 className="text-lg font-bold mb-2">Canvas Encountered an Issue</h2>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              {isPersistenceLikely
                ? 'A local board storage or schema conflict was detected. Resetting the board data will restore a clean canvas.'
                : 'A temporary canvas render error occurred. You can easily recover by reloading the canvas or resetting local session data.'}
            </p>

            {this.state.error?.message && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-rose-300 text-left mb-5 overflow-auto max-h-24">
                {this.state.error.message.replace(/([?&][a-zA-Z0-9_-]*(?:key|token|auth|secret)[a-zA-Z0-9_-]*=)[^&]+/gi, '$1[REDACTED]')}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
              <button
                id="canvas-reload-btn"
                onClick={this.handleReload}
                disabled={this.state.isResetting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Canvas
              </button>

              <button
                id="canvas-reset-data-btn"
                onClick={this.handleHardReset}
                disabled={this.state.isResetting}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-rose-600 active:bg-rose-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                title="Clears corrupted local board storage"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {this.state.isResetting ? 'Resetting...' : 'Reset Board Data'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
