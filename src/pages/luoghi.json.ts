// Indice leggero dei luoghi da visitare per la mappa (/luoghi/mappa/). Una riga per luogo:
// [slug, nome, tipo, comune, sigla, lat, lon, posizioneIndicativa(1/0), orari in breve]. Mai contatti privati.
import type { APIRoute } from 'astro';
import { luoghi } from '../lib/luoghiDaVisitare';

const breve = (t: string, max = 110) => (t.length > max ? t.slice(0, t.lastIndexOf(' ', max)) + '…' : t);

export const GET: APIRoute = () => {
  const l = luoghi.map((x) => [x.slug, x.nome, x.tipo, x.comuneDati.nome, x.provinciaDati.sigla, Number(x.lat.toFixed(5)), Number(x.lon.toFixed(5)), x.coordinateApprossimate ? 1 : 0, breve(x.orari)]);
  return new Response(JSON.stringify({ agg: new Date().toISOString(), l }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
