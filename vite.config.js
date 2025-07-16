import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://pass-op-dkz6.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
