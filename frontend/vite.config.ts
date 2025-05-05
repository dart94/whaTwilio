import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: Number(process.env.PORT) || 3000
  },
  preview: {
    host: true,
    port: Number(process.env.PORT) || 3000,
    strictPort: false 
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})