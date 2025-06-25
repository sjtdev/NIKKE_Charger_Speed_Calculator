import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

// 自动检测环境
const isProduction = process.env.NODE_ENV === 'production'
const basePath = isProduction 
  ? '/NIKKE_Charger_Speed_Calculator/' 
  : '/'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: basePath,
  
  // 添加构建优化
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  
  // 添加开发服务器配置
  server: {
    port: 5173,
    strictPort: true
  }
})