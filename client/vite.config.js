import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const API_PROXY_TARGET = 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': API_PROXY_TARGET } },
});
