import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: unknown): State {
    let message = 'An unexpected render error occurred.';
    if (error instanceof Error && error.message) {
      // Strip any potential sensitive details/tokens
      message = error.message.replace(/([?&][a-zA-Z0-9_-]*(?:key|token|auth|secret)[a-zA-Z0-9_-]*=)[^&]+/gi, '$1[REDACTED]');
    }
    return {
      hasError: true,
      errorMessage: message,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const timestamp = new Date().toISOString();
    console.error(`[AppErrorBoundary ${timestamp}] Runtime failure caught:`, error, errorInfo);
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  private handleResetData = async () => {
    try {
      if (typeof window !== 'undefined') {
        // Clear local storage keys used by tldraw board
        try {
          localStorage.removeItem('tldraw_board_title');
          localStorage.removeItem('tldraw_welcome_shown');
          localStorage.removeItem('tldraw_sdk_main_board');
        } catch {
          // localStorage access might be restricted in private mode
        }

        // Clear tldraw IndexedDB database safely
        if (window.indexedDB) {
          try {
            window.indexedDB.deleteDatabase('tldraw_sdk_main_board');
            window.indexedDB.deleteDatabase('tldraw');
          } catch (e) {
            console.warn('[AppErrorBoundary] Could not clear IndexedDB database:', e);
          }
        }

        // Also clean up caches if available
        if ('caches' in window) {
          try {
            const cacheKeys = await window.caches.keys();
            await Promise.all(cacheKeys.map((k) => window.caches.delete(k)));
          } catch {
            // cache deletion fallback
          }
        }
      }
    } finally {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          id="app-error-boundary-root"
          className="min-h-screen w-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-6 select-none font-sans"
        >
          <div
            id="app-error-card"
            className="max-w-md w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-5 border border-amber-500/20 shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white mb-2">
              Application Encountered an Error
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              A runtime or data conflict interrupted the application. You can recover immediately by reloading or resetting local board storage.
            </p>

            {this.state.errorMessage && (
              <div
                id="app-error-details"
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs font-mono text-rose-300 text-left mb-6 overflow-auto max-h-28 scrollbar-thin"
              >
                {this.state.errorMessage}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <button
                id="error-reload-app-btn"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md hover:shadow-blue-500/20 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Reload App
              </button>

              <button
                id="error-reset-data-btn"
                onClick={this.handleResetData}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-700/80 hover:bg-rose-600 active:bg-rose-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Clears local board cache and reloads cleanly"
              >
                <Trash2 className="w-4 h-4" />
                Reset Local Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
