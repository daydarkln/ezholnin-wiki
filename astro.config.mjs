import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://wiki.ezholnin.ru',
  output: 'static',
  build: {
    format: 'directory',
  },
})
