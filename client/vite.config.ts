import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://3.6.92.179:4323',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {         
        target: 'http://3.6.92.179:4323',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
})