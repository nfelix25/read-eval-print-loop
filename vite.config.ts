import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/read-eval-print-loop/",
  server: {
    host: true,
    proxy: {
      "/piston": {
        target: "http://192.168.50.228:2000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/piston/, ""),
      },
    },
  },
  optimizeDeps: {
    exclude: ["sql.js"],
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,wasm}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB for sql.js WASM
      },
      manifest: {
        name: "Read Eval Print Loop",
        short_name: "REPL",
        description:
          "A mobile code playground for experimenting with multiple languages",
        theme_color: "#1e1e2e",
        background_color: "#1e1e2e",
        display: "standalone",
        orientation: "portrait",
        scope: "/read-eval-print-loop/",
        start_url: "/read-eval-print-loop/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
