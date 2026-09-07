import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// Wrap @tailwindcss/vite to safely guard against hotUpdate crashes when HMR/WebSockets are disabled
function safeTailwindcss(): Plugin[] {
  const plugins = tailwindcss();
  return plugins.map((plugin) => {
    if (plugin.name === '@tailwindcss/vite:generate:serve' && plugin.hotUpdate) {
      const originalHotUpdate = plugin.hotUpdate;
      return {
        ...plugin,
        hotUpdate(ctx: any) {
          // Prevent "[vite] Cannot read properties of undefined (reading 'send')" when server.hot or server.ws is undefined
          if (
            process.env.DISABLE_HMR === 'true' ||
            !ctx.server?.hot ||
            !ctx.server?.ws
          ) {
            return [];
          }
          try {
            return (originalHotUpdate as any).call(this, ctx);
          } catch {
            return [];
          }
        },
      };
    }
    return plugin;
  });
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      safeTailwindcss(),
      VitePWA({
        registerType: 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'Tldraw Canvas',
          short_name: 'TldrawCanvas',
          description: 'An infinite canvas whiteboard powered by the Tldraw SDK with collaborative-grade drawing tools, templates, and export features.',
          theme_color: '#1e293b',
          background_color: '#f8f9fa',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: false,
          skipWaiting: false,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\/.*/],
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/cdn\.tldraw\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'tldraw-cdn-cache',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
