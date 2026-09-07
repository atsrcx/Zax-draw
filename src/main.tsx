import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './index.css';

// Diagnostic logging & Global error listeners
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    let msg = event.message || String(event.error);
    if (typeof msg === 'string') {
      msg = msg.replace(/([?&][a-zA-Z0-9_-]*(?:key|token|auth|secret)[a-zA-Z0-9_-]*=)[^&]+/gi, '$1[REDACTED]');
    }
    console.error('[DIAGNOSTIC] window error:', msg, event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    let reason = event.reason?.message || String(event.reason);
    if (typeof reason === 'string') {
      reason = reason.replace(/([?&][a-zA-Z0-9_-]*(?:key|token|auth|secret)[a-zA-Z0-9_-]*=)[^&]+/gi, '$1[REDACTED]');
    }
    console.error('[DIAGNOSTIC] unhandled rejection:', reason, event.reason);
  });

  // Production-only cleanup to prevent old deployed service workers from controlling the app
  if (import.meta.env.PROD) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (const registration of registrations) {
            registration.unregister().catch(() => {});
          }
        })
        .catch((e) => {
          console.warn('[DIAGNOSTIC] serviceWorker cleanup error:', e);
        });
    }

    if ('caches' in window) {
      window.caches
        .keys()
        .then((keys) => {
          for (const key of keys) {
            window.caches.delete(key).catch(() => {});
          }
        })
        .catch((e) => {
          console.warn('[DIAGNOSTIC] caches cleanup error:', e);
        });
    }
  }
}

console.log('[DIAGNOSTIC] app boot');

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>,
  );
}
