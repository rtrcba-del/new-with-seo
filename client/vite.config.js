import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:4000", changeOrigin: true } }
  },
  build: {
    // Vite 8 minifies with Oxc (via Rolldown). Strip console/debugger
    // statements from the production bundle only; `vite dev` keeps them for
    // local debugging.
    rolldownOptions: {
      output: {
        minify: command === "build"
          ? { compress: { dropConsole: true, dropDebugger: true } }
          : undefined,
      },
    },
  }
}));
