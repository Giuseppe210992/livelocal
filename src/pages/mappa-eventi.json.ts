// Dati degli eventi per la mappa (/mappa/ e /vicino-a-me/). Sono in un file a parte, caricato solo quando serve,
// così le pagine restano leggere. Niente contatti: solo ciò che serve a mappa ed elenco.
// Si tengono gli eventi in programma e quelli conclusi da meno di 7 giorni; l'archivio resta nelle pagine dei singoli eventi.
import type { APIRoute } from 'astro';
import { eventi, localita } from '../lib/eventi';
import { quandoBreve, riquadroData } from '../lib/date';
import { href } from '../lib/sito';

export const GET: APIRoute = () => {
  const limite = Date.now() - 7 * 24 * 3600 * 1000;
  const lista = eventi.filter((e) => e.fineIstante.getTime() >= limite).map((e) => ({
    titolo: e.titolo,
    url: href(e.percorso),
    categoria: e.categoriaDati.nome,
    giornoInizio: e.inizio.slice(0, 10),
    giornoFine: (e.fine ?? e.inizio).slice(0, 10),
    fineMs: e.fineIstante.getTime(),
    quando: quandoBreve(e.inizio, e.fine),
    luogo: e.luogo,
    localita: localita(e),
    lat: e.lat,
    lon: e.lon,
    approssimata: e.coordinateApprossimate,
    stato: e.stato,
    nuoveDate: Boolean(e.inizioPrecedente),
    data: riquadroData(e.inizio),
  }));
  return new Response(JSON.stringify({ eventi: lista }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
