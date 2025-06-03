import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      proxy: {
        "/api": {
          target: mode === "development"
            ? "http://localhost:3000"
            : "https://e2425-wads-l4acg7-server.csbihub.id",
          changeOrigin: true,
          secure: true,
          ws: true,
        },
      },
    },
    build: {
      outDir: "dist",
    },
    plugins: [react()],
  }
})