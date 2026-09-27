import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://nagi.tw',
  base: '/',
  output: 'static',
  integrations: [sitemap()],
});
