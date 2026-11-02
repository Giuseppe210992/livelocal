// Feed RSS: i nuovi eventi inseriti, dal più recente.
import type { APIRoute } from 'astro';
import { eventi, localita } from '../lib/eventi';
import { quandoEsteso, istante, maiuscola } from '../lib/date';
import { SITO, urlAssoluto } from '../lib/sito';

const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const ordinati = [...eventi].sort((a, b) => b.inserito.localeCompare(a.inserito) || b.inizio.localeCompare(a.inizio));
  const voci = ordinati.map((e) => `
    <item>
      <title>${xml(`${e.titolo} – ${localita(e)}`)}</title>
      <link>${urlAssoluto(e.percorso)}</link>
      <guid isPermaLink="true">${urlAssoluto(e.percorso)}</guid>
      <pubDate>${istante(e.inserito).toUTCString()}</pubDate>
      <category>${xml(e.categoriaDati.nome)}</category>
      <description>${xml(`${maiuscola(quandoEsteso(e.inizio, e.fine))} · ${e.luogo}. ${e.descrizione}`)}</description>
    </item>`).join('');
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${SITO.nome} – nuovi eventi`)}</title>
    <link>${urlAssoluto('/')}</link>
    <atom:link href="${urlAssoluto('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${xml(SITO.descrizione)}</description>
    <language>it-it</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${voci}
  </channel>
</rss>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
