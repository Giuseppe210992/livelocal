// Elenco delle zone con luoghi da caricare a richiesta: regioni italiane (OpenStreetMap) e paesi europei (Wikidata).
// Per ogni zona: slug, nome, riquadro, quanti sono e file da caricare. La mappa lo usa per sapere cosa caricare quando ci si avvicina.
import type { APIRoute } from 'astro';
import { regioniConOsm, osmPerRegione, riquadroRegione } from '../lib/luoghiOsm';
import { paesiEuropa, luoghiDelPaese, riquadroPaese, nomePaese, slugPaese } from '../lib/luoghiEuropa';

export const GET: APIRoute = () => {
  const italia = regioniConOsm().map((x) => ({ s: x.slug, n: x.nome, b: riquadroRegione(x).map((v) => Number(v.toFixed(3))), c: osmPerRegione(x).length, u: `luoghi-osm/${x.slug}.json` }));
  const europa = paesiEuropa().map((iso) => ({ s: slugPaese(iso), n: nomePaese(iso), b: riquadroPaese(iso).map((v) => Number(v.toFixed(3))), c: luoghiDelPaese(iso).length, u: `luoghi-europa/${slugPaese(iso)}.json`, e: 1 }));
  return new Response(JSON.stringify({ r: [...italia, ...europa] }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
