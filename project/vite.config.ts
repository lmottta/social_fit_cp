import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    exclude: ['sequelize', 'pg-hstore'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['sequelize', 'pg-hstore']
    }
  },
  define: {
    'process.env': process.env,
    global: 'globalThis'
  }
})