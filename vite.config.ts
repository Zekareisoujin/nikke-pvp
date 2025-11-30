import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/nikke-pvp/',
  plugins: [react()],
  server: {
    host: 'nikke.localhost',
    port: 3000,
  },
});
