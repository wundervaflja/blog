import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://devnullgor.dev',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ua'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
