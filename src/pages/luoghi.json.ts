// Indice leggero dei luoghi da visitare per la mappa (/luoghi/mappa/). Una riga per luogo:
// [id, nome, tipo, comune, sigla, lat, lon, posizioneIndicativa(1/0), orari in breve, schedaCompleta(1/0), sito ufficiale].
// Scheda completa: id = indirizzo della scheda (slug) e orari verificati. Luogo base: id = codice Wikidata, senza orari, con il sito ufficiale.
// Mai contatti privati.
import type { APIRoute } from 'astro';
import { luoghi, luoghiBase } from '../lib/luoghiDaVisitare';

const breve = (t: string, max = 110) => (t.length > max ? t.slice(0, t.lastIndexOf(' ', max)) + '…' : t);

export const GET: APIRoute = () => {
  const complete = luoghi.map((x) => [x.slug, x.nome, x.tipo, x.comuneDati.nome, x.provinciaDati.sigla, Number(x.lat.toFixed(5)), Number(x.lon.toFixed(5)), x.coordinateApprossimate ? 1 : 0, breve(x.orari), 1, x.sito]);
  const base = luoghiBase.map((x) => [x.id, x.nome, x.tipo, x.comuneDati.nome, x.provinciaDati.sigla, Number(x.lat.toFixed(5)), Number(x.lon.toFixed(5)), x.coordinateApprossimate ? 1 : 0, '', 0, x.sito]);
  return new Response(JSON.stringify({ agg: new Date().toISOString(), l: [...complete, ...base] }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
