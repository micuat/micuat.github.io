import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    root: '.',
    build: {
      cssCodeSplit: false,
      outDir: "dist",
      rollupOptions: {
        input: {
          // the default entry point
          app: './index.html',

          // 1️⃣
        },
        output: {
          // 2️⃣
          entryFileNames: assetInfo => {
            return assetInfo.name === 'service-worker'
               ? '[name].js'                  // put service worker in root
               : 'assets/js/[name].js' // others in `assets/js/`
          },
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
          exclude: ['hydra-synth'],
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
      }
    },
    server: {
      host:"0.0.0.0",
      port:3000,
      strictPort: true,
    },
    preview: {
      host:"0.0.0.0",
      port:3000,
      strictPort: true,
    },
  };
});
