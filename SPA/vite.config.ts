import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import svgr from 'vite-plugin-svgr'

const root = resolve(__dirname, 'src')

export default defineConfig({
  root: 'src',
  build: {
    // Relative to the root
    outDir: '../dist',
  },
  resolve: {
    alias: {
      _Home: resolve(root, ''),
      _Images: resolve(root, 'assets/img/'),
    },
  },
  css: {
    preprocessorOptions: {
      styl: {
        additionalData: `@import "${resolve(root, './assets/img/global.styl')}"`,
      },
    },
  },
  plugins: [
    react({
      include: '**/*.{jsx,tsx}',
    }),
    svgr(),
  ],
})
