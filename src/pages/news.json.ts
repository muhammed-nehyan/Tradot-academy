// Snapshot of this build's headlines; the next build falls back to it if the feeds fail.
import type { APIRoute } from 'astro';
import { getNews } from '../data/news';

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ updated: new Date().toISOString(), items: await getNews() }), {
    headers: { 'Content-Type': 'application/json' },
  });
