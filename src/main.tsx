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
