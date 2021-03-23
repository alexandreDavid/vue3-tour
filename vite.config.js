import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, 'src/main.js'),
  //     name: 'Vue3Tour'
  //   },
  //   rollupOptions: {
  //     external: ['vue'],
  //     output: {
  //       assetFileNames: `vue3-tour.[ext]`,
  //       globals: {
  //         vue: 'Vue'
  //       }
  //     }
  //   }
  // },
  plugins: [vue()]
})
