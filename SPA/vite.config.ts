import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'
import { compression } from 'vite-plugin-compression2'

const root = resolve(__dirname, 'src')

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    // Relative to the root
    outDir: '../dist',
  },
  assetsInclude: ['**/*.lottie'],
  resolve: {
    alias: {
      _Home: resolve(root, ''),
      _Images: resolve(root, 'assets/img/'),
      _Module: resolve(root, 'modules/'),
    },
  },
  css: {
    modules: {},
    preprocessorOptions: {
      styl: {
        additionalData: `@import "${resolve(root, './assets/img/global.styl')}"`,
      },
    },
  },
  optimizeDeps: {
    include: ['html2pdf.js', 'tiptap_react.js'],
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    svgr(),
    compression(),
  ],
})
