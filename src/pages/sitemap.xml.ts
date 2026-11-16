// Indice delle mappe del sito per Google e Bing, rigenerato a ogni pubblicazione. Le pagine stanno in quattro mappe più piccole.
import type { APIRoute } from 'astro';
import { NOMI_SITEMAP, ultimaModifica } from '../lib/sitemap';
import { urlAssoluto } from '../lib/sito';

export const GET: APIRoute = () => {
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${NOMI_SITEMAP.map((n) => { const m = ultimaModifica(n); return `  <sitemap><loc>${urlAssoluto(`/sitemap-${n}.xml`)}</loc>${m ? `<lastmod>${m}</lastmod>` : ''}</sitemap>`; }).join('\n')}
</sitemapindex>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
