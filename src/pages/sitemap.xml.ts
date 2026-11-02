// Mappa del sito per Google e Bing: tutte le pagine, rigenerata a ogni pubblicazione.
import type { APIRoute } from 'astro';
import { eventi, eventiDelComune, eventiDellaFrazione, eventiDellaProvincia, eventiDellaRegione, comuniConPagina } from '../lib/eventi';
import type { Evento } from '../lib/eventi';
import { regioni, province, comuni, percorsoRegione, percorsoProvincia, percorsoComune, percorsoFrazione } from '../lib/luoghi';
import { urlAssoluto } from '../lib/sito';

// Data dell'ultima modifica: l'evento inserito più di recente in quella pagina.
const ultima = (lista: Evento[]) => lista.map((e) => e.inserito).sort().at(-1);

export const GET: APIRoute = () => {
  const pagine: { percorso: string; lastmod?: string }[] = [
    { percorso: '/', lastmod: ultima(eventi) },
    { percorso: '/mappa/', lastmod: ultima(eventi) },
    { percorso: '/vicino-a-me/', lastmod: ultima(eventi) },
    ...regioni.map((r) => ({ percorso: percorsoRegione(r), lastmod: ultima(eventiDellaRegione(r)) })),
    ...province.map((p) => ({ percorso: percorsoProvincia(p), lastmod: ultima(eventiDellaProvincia(p)) })),
    ...comuniConPagina(comuni).map((c) => ({ percorso: percorsoComune(c), lastmod: ultima(eventiDelComune(c)) })),
    ...comuni.flatMap((c) => c.frazioni.map((f) => ({ percorso: percorsoFrazione(c, f), lastmod: ultima(eventiDellaFrazione(c, f)) }))),
    ...eventi.map((e) => ({ percorso: e.percorso, lastmod: e.inserito })),
  ];
  const corpo = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagine.map((p) => `  <url><loc>${urlAssoluto(p.percorso)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}</url>`).join('\n')}
</urlset>
`;
  return new Response(corpo, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
