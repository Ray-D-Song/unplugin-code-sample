import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Unplugin from '../src/vite'

export default defineConfig({
  server: {
    port: 6636,
  },
  plugins: [
    Unplugin(),
    Vue(),
  ],
})
