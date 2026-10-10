// Hand-rolled sitemap (no extra dependency). Add new pages here.
import type { APIRoute } from 'astro';

const pages = ['/', '/about/', '/course/', '/market-news/', '/contact/', '/privacy/', '/terms/', '/disclaimer/'];

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
