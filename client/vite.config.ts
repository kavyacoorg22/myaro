import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
       base: '/', 
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined  
        }
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'https://api.myaro.shop'
      ),
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:4323',
          changeOrigin: true,
          secure: false,
        },
        '/socket.io': {
          target: 'http://localhost:4323',
          changeOrigin: true,
          secure: false,
          ws: true,
        }
      }
    }
  }
})