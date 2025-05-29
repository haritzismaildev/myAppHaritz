import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // misalnya, jika semua endpoint API diawali dengan '/api'
        target: 'https://localhost:7164',
        changeOrigin: true,
        secure: false, // jika menggunakan self-signed certificate
      },
    },
  },
})
