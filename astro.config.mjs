import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://seraphforge.github.io',
  base: '/notes.nagi.tw',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
