import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,      // or "0.0.0.0"
    port: 5173,
  },
});
