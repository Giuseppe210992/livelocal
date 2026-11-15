// Luoghi storici e culturali da visitare (musei, aree archeologiche, castelli, palazzi).
// I dati stanno in src/data/luoghi-da-visitare.json: ogni scheda ha la fonte ufficiale e la data del controllo.
import dati from '../data/luoghi-da-visitare.json';
import { comune, provincia, regione, comuni } from './luoghi';
import type { Comune, Provincia, Regione } from './luoghi';
import { eventiDelComune, prossimi } from './eventi';
import { readFileSync, existsSync } from 'node:fs';

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

// ---- Luoghi «base»: elenco da Wikidata (nome, tipo, comune, coordinate, sito ufficiale) senza orari e costi verificati.
// Compaiono sulla mappa e negli elenchi per provincia con il rinvio al sito ufficiale; diventano schede complete quando
// la lettura automatica (scripts/estrai-luoghi-ia.mjs) trova orari e costi citabili. Niente pagina propria finché la scheda non è completa.
export interface LuogoBase { id: string; nome: string; tipo: string; comuneDati: Comune; provinciaDati: Provincia; regioneDati: Regione; lat: number; lon: number; coordinateApprossimate: boolean; sito: string }
const TIPO_BASE: Record<string, string> = { 'Museo': 'Museo', 'Area archeologica': 'Area archeologica', 'Castello': 'Castello', 'Palazzo': 'Palazzo e villa', 'Chiesa e cattedrale': 'Chiesa e abbazia' };
const normNome = (t: string) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const distKm = (la1: number, lo1: number, la2: number, lo2: number) => { const r = Math.PI / 180, dx = (lo2 - lo1) * r * Math.cos(((la1 + la2) / 2) * r), dy = (la2 - la1) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };
function caricaBase(): LuogoBase[] {
  const file = 'ricerca/luoghi-elenco.json';
  if (!existsSync(file)) return [];
  const elenco: { id: string; nome: string; classe: string; comune: string; sito: string; lat?: number; lon?: number }[] = JSON.parse(readFileSync(file, 'utf8')).luoghi ?? [];
  const idCompleti = new Set(luoghi.map((l) => (l as unknown as { origine?: string }).origine).filter(Boolean));
  const chiavi = new Set(luoghi.map((l) => `${l.comune}|${normNome(l.nome)}`));
  const out: LuogoBase[] = [];
  for (const e of elenco) {
    if (idCompleti.has(e.id) || !e.nome || e.nome.trim().length < 4 || !/^https?:\/\//.test(e.sito)) continue;
    let c = comune(e.comune);
    if (!c && Number.isFinite(e.lat)) { let d = 12; for (const x of comuni) { const k = distKm(e.lat as number, e.lon as number, x.lat, x.lon); if (k < d) { d = k; c = x; } } }
    if (!c) continue;
    const chiave = `${c.codiceIstat}|${normNome(e.nome)}`;
    if (chiavi.has(chiave)) continue;
    chiavi.add(chiave);
    const p = provincia(c.provincia);
    const preciso = Number.isFinite(e.lat) && Number.isFinite(e.lon);
    out.push({ id: e.id, nome: e.nome.trim(), tipo: TIPO_BASE[e.classe] ?? 'Monumento', comuneDati: c, provinciaDati: p, regioneDati: regione(p.regione), lat: preciso ? (e.lat as number) : c.lat, lon: preciso ? (e.lon as number) : c.lon, coordinateApprossimate: !preciso, sito: e.sito });
  }
  return out.sort((a, b) => a.comuneDati.nome.localeCompare(b.comuneDati.nome, 'it') || a.nome.localeCompare(b.nome, 'it'));
}
export const luoghiBase: LuogoBase[] = caricaBase();
export const baseDellaProvincia = (p: Provincia) => luoghiBase.filter((l) => l.provinciaDati.codiceIstat === p.codiceIstat);
export const totaleProvincia = (p: Provincia) => luoghiDellaProvincia(p).length + baseDellaProvincia(p).length;

export const regioniConLuoghi = () => [...new Map([...luoghi, ...luoghiBase].map((l) => [l.regioneDati.codiceIstat, l.regioneDati])).values()].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
export const provinceConLuoghi = (r: Regione) => [...new Map([...luoghi, ...luoghiBase].filter((l) => l.regioneDati.codiceIstat === r.codiceIstat).map((l) => [l.provinciaDati.codiceIstat, l.provinciaDati])).values()].sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
export const luoghiDellaProvincia = (p: Provincia) => luoghi.filter((l) => l.provinciaDati.codiceIstat === p.codiceIstat);
export const totaleLuoghi = () => luoghi.length + luoghiBase.length;
export const comuniConLuoghi = () => comuni.filter((c) => luoghiDelComune(c).length > 0);
/** Ricerca su OpenStreetMap con il nome del posto (si evita di inventare coordinate precise). */
export const linkMappa = (l: LuogoDaVisitare) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${l.nome}, ${l.comuneDati.nome}`)}`;
