import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Enable SPA fallback for React Router
  server: {
    historyApiFallback: true,
  },
})
