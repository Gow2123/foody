import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-linux-x64-musl',
        '@rollup/rollup-win32-x64-msvc',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-darwin-arm64'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  optimizeDeps: {
    disabled: false,
    exclude: [
      '@rollup/rollup-linux-x64-gnu',
      '@rollup/rollup-linux-x64-musl',
      '@rollup/rollup-win32-x64-msvc',
      '@rollup/rollup-darwin-x64',
      '@rollup/rollup-darwin-arm64'
    ]
  }
})
