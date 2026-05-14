import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['icons/icon.svg', 'icons/maskable-icon.svg'],
      manifest: {
        id: '/',
        name: 'Flow Assistant',
        short_name: 'Flow',
        description: 'Android-first workflow automation assistant for shared text, links, images, and PDFs.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f8fafc',
        theme_color: '#0f172a',
        categories: ['productivity', 'utilities'],
        icons: [
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: '/icons/maskable-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'New Share', short_name: 'Share', url: '/share', icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
          { name: 'Workflows', short_name: 'Flows', url: '/workflows', icons: [{ src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml' }] },
        ],
        share_target: {
          action: '/share',
          method: 'POST',
          enctype: 'multipart/form-data',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
            files: [
              { name: 'files', accept: ['image/*', 'application/pdf'] },
              { name: 'file', accept: ['image/*', 'application/pdf'] },
            ],
          },
        },
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-api', expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 } },
          },
          {
            urlPattern: ({ request }) => ['document', 'script', 'style', 'image', 'font'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'flow-static' },
          },
        ],
      },
      devOptions: { enabled: true },
    }),
  ],
})
