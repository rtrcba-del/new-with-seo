import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(({ command }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:4000", changeOrigin: true } }
  },
  esbuild: {
    // Strip console/debugger statements from the production bundle only —
    // `vite dev` keeps them for local debugging.
    drop: command === "build" ? ["console", "debugger"] : [],
  },
  build: {
    minify: "esbuild",
  }
}));
