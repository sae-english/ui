import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // В CI/проде gzip-отчёты заметно замедляют сборку, отключаем.
    reportCompressedSize: false,
    // Чуть выше порог, чтобы не отвлекать предупреждениями (параллельно всё равно уменьшаем размер чанков через manualChunks).
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Внутренние чанки остаются дефолтными; только гарантированно разделяем крупные вендоры.
          if (!id.includes('node_modules')) return undefined

          if (id.includes('element-plus')) return 'vendor-element-plus'
          if (id.includes('vue-router')) return 'vendor-vue-router'
          if (id.includes('vue')) return 'vendor-vue'
          if (id.includes('@tanstack')) return 'vendor-tanstack'
          if (id.includes('pinia')) return 'vendor-pinia'
          if (id.includes('@vueuse')) return 'vendor-vueuse'

          return 'vendor'
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
