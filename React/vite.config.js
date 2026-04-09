import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// No ESM (Vite), precisamos simular o __dirname se necessário
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  // Define a raiz para caminhos absolutos no servidor
  base: '/', 
  plugins: [
    react(), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Opcional: Garante que o build saia na pasta 'dist' que seu Dockerfile espera
  build: {
    outDir: 'dist',
  }
})