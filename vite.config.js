import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
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
