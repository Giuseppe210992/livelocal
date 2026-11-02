// Elenco compatto dei luoghi di partenza per la mappa: [codice, nome, sigla provincia, lat, lon].
// Comprende tutti i comuni (codice ISTAT) e le frazioni descritte (codice-frazione).
import type { APIRoute } from 'astro';
import { comuni, provincia } from '../lib/luoghi';

export const GET: APIRoute = () => {
  const luoghi: [string, string, string, number, number][] = [];
  for (const c of comuni) {
    const sigla = provincia(c.provincia).sigla;
    luoghi.push([c.codiceIstat, c.nome, sigla, c.lat, c.lon]);
    for (const f of c.frazioni) luoghi.push([`${c.codiceIstat}-${f.slug}`, `${f.nome}, ${c.nome}`, sigla, f.lat, f.lon]);
  }
  luoghi.sort((a, b) => a[1].localeCompare(b[1], 'it'));
  return new Response(JSON.stringify({ luoghi }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
