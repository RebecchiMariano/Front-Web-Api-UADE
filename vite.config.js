import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 🔹 Login y registro → backend ya tiene /api/
      "/api/v1/auth": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },

      // 🔹 Otras rutas → backend NO tiene /api/
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // quita "/api"
      },
    },
  },
});
