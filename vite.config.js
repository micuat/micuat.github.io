import { resolve } from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  return {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: '2022/',
            dest: ''
          },
          {
            src: 'img/',
            dest: ''
          }
        ]
      })
    ],
    root: '.',
    build: {
      cssCodeSplit: false,
      outDir: "dist",
      rollupOptions: {
        input: {
          // the default entry point
          app: './index.html',
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          // fix for hydra-synth
          global: "window"
        },
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
