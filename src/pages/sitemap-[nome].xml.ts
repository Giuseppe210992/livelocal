// Una delle quattro mappe del sito (principali, territorio, eventi, luoghi): vedi src/lib/sitemap.ts.
import type { APIRoute } from 'astro';
import { NOMI_SITEMAP, gruppo } from '../lib/sitemap';
import type { NomeSitemap } from '../lib/sitemap';
import { urlAssoluto } from '../lib/sito';

export function getStaticPaths() {
  return NOMI_SITEMAP.map((nome) => ({ params: { nome } }));
}
export const GET: APIRoute = ({ params }) => {
  const pagine = gruppo(params.nome as NomeSitemap);
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagine.map((p) => `  <url><loc>${urlAssoluto(p.percorso)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
