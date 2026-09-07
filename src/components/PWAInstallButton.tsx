import React, { useState } from 'react';
import { DownloadCloud, Smartphone, X, Check, Laptop, Share2, PlusSquare, Tablet, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'dropdown' | 'compact';
  onInstalled?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', onInstalled }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // If already installed and running standalone, do not display install CTA
  if (isInstalled) {
    if (variant === 'dropdown') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5" />
          <span>App Installed (Standalone)</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setIsInstalling(true);
      try {
        const success = await install();
        if (success && onInstalled) {
          onInstalled();
        }
      } finally {
        setIsInstalling(false);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          id="pwa-header-install-btn"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white transition-all shadow-xs shrink-0 cursor-pointer"
          title="Install Zax-draw as a native desktop or mobile PWA"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      ) : variant === 'compact' ? (
        <button
          id="pwa-compact-install-btn"
          onClick={handleInstallClick}
          className="flex items-center gap-1 p-1.5 rounded-md border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors shadow-xs cursor-pointer"
          title="Install Zax-draw PWA"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          id="pwa-dropdown-install-btn"
          onClick={handleInstallClick}
          className="w-full text-left px-3 py-2 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 rounded flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 transition-colors group cursor-pointer"
        >
          <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0">
            <DownloadCloud className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>Install Zax-draw</span>
              <span className="text-[9px] px-1 py-0.2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 rounded font-mono font-normal">
                PWA
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Offline mode & standalone window
            </div>
          </div>
        </button>
      )}

      {/* Guide Modal for Multi-Device / Browser Installation */}
      {showGuideModal && (
        <div
          id="pwa-guide-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            id="pwa-guide-modal-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-sm w-full p-5 text-slate-800 dark:text-slate-100 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ZD
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Install Zax-draw
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Progressive Web Application
                  </p>
                </div>
              </div>
              <button
                id="close-pwa-guide-modal"
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              {isIOS ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>Install on iPhone & iPad (Safari):</span>
                  </div>
                  <ol className="space-y-2.5 pl-1 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        1
                      </span>
                      <span>
                        Tap the <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1"><Share2 className="w-3 h-3 text-blue-600 inline" /> Share</strong> button at the bottom of Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        2
                      </span>
                      <span>
                        Scroll down the menu and tap <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1"><PlusSquare className="w-3 h-3 text-blue-600 inline" /> Add to Home Screen</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        3
                      </span>
                      <span>
                        Tap <strong>Add</strong> in the top-right corner to launch Zax-draw fullscreen.
                      </span>
                    </li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>Install on Chrome, Edge & Android:</span>
                  </div>
                  <ol className="space-y-2.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        1
                      </span>
                      <span>
                        Click the <strong className="text-slate-900 dark:text-white">Install</strong> icon (<DownloadCloud className="w-3 h-3 inline text-emerald-600" />) in the right side of the URL address bar, or open the browser menu (<strong>⋮</strong>).
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        2
                      </span>
                      <span>
                        Select <strong className="text-slate-900 dark:text-white">Install Zax-draw</strong> or <strong className="text-slate-900 dark:text-white">Add to Home screen</strong>.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        3
                      </span>
                      <span>
                        Confirm <strong>Install</strong> to enjoy a native, distraction-free drawing app window.
                      </span>
                    </li>
                  </ol>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>PWA Features:</span>
                </div>
                <div>• Complete offline whiteboard functionality with local persistence</div>
                <div>• Instant launch from dock, desktop, or mobile home screen</div>
                <div>• Fullscreen edgeless canvas without browser address bar clutter</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                id="dismiss-pwa-guide-btn"
                onClick={() => setShowGuideModal(false)}
                className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
