import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['language-planet.svg', 'preview.png'],
      manifest: {
        name: 'LangIS',
        short_name: 'LangIS',
        description:
          'Website for language schools developed as an assignment in React development course.',
        icons: [
          {
            src: '/language-planet.svg',
            type: 'image/svg+xml',
            sizes: '48x48 192x192 512x512',
          },
          {
            src: '/preview.png',
            type: 'image/png',
            sizes: '1024x683',
          },
          {
            src: '/preview.png',
            type: 'image/png',
            sizes: '1024x683',
            purpose: 'any maskable',
          },
        ],
        background_color: '#000000',
        theme_color: '#0d47a1',
      },
    }),
  ],
});
