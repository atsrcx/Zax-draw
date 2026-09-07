import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import './index.css';

// Safe, non-intrusive service worker registration in production
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && import.meta.env.PROD) {
  try {
    registerSW({
      immediate: false,
      onNeedRefresh() {
        console.log('[PWA] A newer version of the whiteboard is available.');
        // Do NOT automatically reload or unmount active application.
      },
      onOfflineReady() {
        console.log('[PWA] Offline whiteboard capabilities are ready.');
      },
      onRegisterError(error) {
        console.error('[PWA] Service worker registration error:', error);
      },
    });
  } catch (err) {
    console.warn('[PWA] Service worker registration failed gracefully:', err);
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
}

