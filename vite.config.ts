import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

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
      // VitePWA temporarily disabled for diagnostic build
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
