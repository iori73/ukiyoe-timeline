import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Enable SPA fallback for React Router
  server: {
    historyApiFallback: true,
    // 同一WiFiのiPhone等から実機テストするためLANでリッスン
    host: true,
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
})
