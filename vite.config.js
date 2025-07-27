import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // ✅ Enable source maps for debugging
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pass-op-dkz6.onrender.com', // 👈 or use http://localhost:5000 for dev
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
