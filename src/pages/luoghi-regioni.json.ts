// Elenco delle regioni con luoghi minori da OpenStreetMap: slug, riquadro e quanti sono. La mappa lo usa per sapere cosa caricare.
import type { APIRoute } from 'astro';
import { regioniConOsm, osmPerRegione, riquadroRegione } from '../lib/luoghiOsm';

export const GET: APIRoute = () => {
  const r = regioniConOsm().map((x) => ({ s: x.slug, n: x.nome, b: riquadroRegione(x).map((v) => Number(v.toFixed(3))), c: osmPerRegione(x).length }));
  return new Response(JSON.stringify({ r }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
