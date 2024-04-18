import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lib.ts'),
      name: 'Vue3Tour'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: `vue3-tour.[ext]`,
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [vue()]
})
