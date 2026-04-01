import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    
    // 【关键修改】添加 host: '0.0.0.0' 以允许外部访问
    host: '0.0.0.0', 
    
    // 可选：明确指定端口，虽然默认就是 5173
    port: 5173, 

    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后台服务所在的源
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // "/api替换成空字符串"
      }
    }
  }
})