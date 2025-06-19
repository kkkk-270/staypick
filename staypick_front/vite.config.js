import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/upload': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      }
    }
  },
  // ✅ React Router SPA 대응 (새로고침 시 index.html로 리디렉션)
  resolve: {
    alias: {
      // (선택 사항) @ → src/ 로 줄여서 import
      '@': '/src',
    }
  },
  build: {
    rollupOptions: {
      input: './index.html'
    }
  },
  // 👇 Vite 5 기준 새로고침 대응용 설정
  // Vite 4 이하라면 devServer에서 `historyApiFallback: true`로 따로 설정 가능
  // 하지만 현재는 위 프록시로 충분함
});
