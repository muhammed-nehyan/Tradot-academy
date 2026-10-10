// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO(client): replace with the real domain once it's connected.
  // Used for canonical URLs, Open Graph, the sitemap and the news fallback.
  site: process.env.SITE_URL ?? 'https://tradotacademy.com',
  trailingSlash: 'ignore',
  // Small site: inline CSS so first paint doesn't wait on a stylesheet request.
  build: { inlineStylesheets: 'always' },
});
