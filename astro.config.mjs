import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://seraphforge.github.io',
  base: '/Nagi.tw',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
