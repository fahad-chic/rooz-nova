// vite.perf.config.js - Maximum Performance Configuration
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
    treeShaking: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 400,
    cssCodeSplit: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React - smallest possible
          if (id.includes('node_modules/react/')) return 'react'
          if (id.includes('node_modules/react-dom/')) return 'react-dom'
          // Firebase - split by module
          if (id.includes('firebase/auth')) return 'fb-auth'
          if (id.includes('firebase/firestore')) return 'fb-firestore'
          if (id.includes('firebase/storage')) return 'fb-storage'
          if (id.includes('firebase/app')) return 'fb-core'
          // Icons - lazy load
          if (id.includes('lucide-react')) return 'icons'
        },
        format: 'es',
        compact: true,
        generatedCode: {
          constBindings: true,
          objectShorthand: true
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage']
  }
})
