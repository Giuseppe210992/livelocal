// Indice leggero degli eventi in programma, per la ricerca della home (si carica solo quando l'utente la usa).
// Una riga per evento: [percorso, titolo, categoria, inizio, fine, comune, sigla, lat, lon, gratuito, luogo, etichettaStato].
// Mai contatti privati. L'elenco completo e aperto resta in /eventi.json.
import type { APIRoute } from 'astro';
import { prossimi } from '../lib/eventi';
import { categorie } from '../lib/eventi';

export const GET: APIRoute = () => {
  const e = prossimi().map((x) => [
    x.percorso, x.titolo, x.categoria, x.inizio, x.fine ?? '', x.comuneDati.nome, x.provinciaDati.sigla,
    Number(x.lat.toFixed(4)), Number(x.lon.toFixed(4)), x.prezzo.tipo === 'gratuito' ? 1 : 0, x.luogo, x.etichettaStato ?? '',
  ]);
  const dati = { agg: new Date().toISOString(), cat: Object.fromEntries(categorie.map((c) => [c.slug, c.nome])), e };
  return new Response(JSON.stringify(dati), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
