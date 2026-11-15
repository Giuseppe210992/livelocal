// Luoghi storici e culturali da visitare (musei, aree archeologiche, castelli, palazzi).
// I dati stanno in src/data/luoghi-da-visitare.json: ogni scheda ha la fonte ufficiale e la data del controllo.
import dati from '../data/luoghi-da-visitare.json';
import { comune, provincia, regione, comuni } from './luoghi';
import type { Comune, Provincia, Regione } from './luoghi';
import { eventiDelComune, prossimi } from './eventi';

export interface LuogoGrezzo {
  slug: string; nome: string; tipo: string; comune: string; indirizzo: string; descrizione: string;
  orari: string; biglietto: string; prenotazione?: string; avviso?: string; sito: string;
  fonte: { nome: string; url: string }; verificato: string; lat?: number; lon?: number;
}
export interface LuogoDaVisitare extends LuogoGrezzo {
  percorso: string; comuneDati: Comune; provinciaDati: Provincia; regioneDati: Regione;
  lat: number; lon: number; coordinateApprossimate: boolean; gratuito: boolean | null;
}

export const percorsoLuogo = (slug: string) => `/luoghi/${slug}/`;
export const percorsoZona = (p: Provincia) => `/luoghi/zona/${regione(p.regione).slug}/${p.slug}/`;

export const luoghi: LuogoDaVisitare[] = (dati.luoghi as LuogoGrezzo[]).map((l) => {
  const c = comune(l.comune);
  if (!c) throw new Error(`Luogo «${l.nome}»: comune ${l.comune} non trovato`);
  if (!/^https?:\/\//.test(l.fonte.url) || !/^https?:\/\//.test(l.sito)) throw new Error(`Luogo «${l.nome}»: fonte o sito non validi`);
  const p = provincia(c.provincia);
  const preciso = Number.isFinite(l.lat) && Number.isFinite(l.lon);
  return {
    ...l, percorso: percorsoLuogo(l.slug), comuneDati: c, provinciaDati: p, regioneDati: regione(p.regione),
    lat: preciso ? (l.lat as number) : c.lat, lon: preciso ? (l.lon as number) : c.lon, coordinateApprossimate: !preciso,
    gratuito: /^(gratuit|ingresso libero)/i.test(l.biglietto) ? true : null,
  };
}).sort((a, b) => a.nome.localeCompare(b.nome, 'it'));

export const luoghiDelComune = (c: Comune) => luoghi.filter((l) => l.comune === c.codiceIstat);
export const eventiVicino = (l: LuogoDaVisitare) => prossimi(eventiDelComune(l.comuneDati));
export const regioniConLuoghi = () => [...new Map(luoghi.map((l) => [l.regioneDati.codiceIstat, l.regioneDati])).values()].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
export const provinceConLuoghi = (r: Regione) => [...new Map(luoghi.filter((l) => l.regioneDati.codiceIstat === r.codiceIstat).map((l) => [l.provinciaDati.codiceIstat, l.provinciaDati])).values()].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
export const luoghiDellaProvincia = (p: Provincia) => luoghi.filter((l) => l.provinciaDati.codiceIstat === p.codiceIstat);
export const comuniConLuoghi = () => comuni.filter((c) => luoghiDelComune(c).length > 0);
/** Ricerca su OpenStreetMap con il nome del posto (si evita di inventare coordinate precise). */
export const linkMappa = (l: LuogoDaVisitare) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${l.nome}, ${l.comuneDati.nome}`)}`;
