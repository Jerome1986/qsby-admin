import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  base: '/admin/',
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({ resolvers: [ElementPlusResolver()] }),
    Components({ resolvers: [ElementPlusResolver()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // vite.config.ts
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/variables.scss" as *;\n@use "@/assets/mixins.scss" as *;\n`,
      },
    },
  },
})
