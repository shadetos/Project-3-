import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/_tests_/setup.ts'
  },
  server: {
    port: 3000,
    host: '127.0.0.1',
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
