import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 3000
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})