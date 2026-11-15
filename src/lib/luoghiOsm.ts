// Luoghi «minori» da OpenStreetMap (ricerca/luoghi-osm.json, generato da scripts/scopri-luoghi-osm.mjs): musei, siti archeologici,
// castelli, rovine, monasteri, ville, porte e mura. Compaiono solo sulla mappa dei luoghi, caricati per regione quando la mappa
// si avvicina (così la pagina resta leggera). Si tolgono i doppioni con le schede e con i luoghi base di Wikidata.
import { osmGrezzi, simili } from './osmGrezzi';
import { comune, provincia, regione, comuni, regioni } from './luoghi';
import type { Regione } from './luoghi';
import { luoghi, luoghiBase } from './luoghiDaVisitare';

export interface LuogoOsm { id: string; nome: string; tipo: string; comuneNome: string; sigla: string; lat: number; lon: number; sito: string; regioneSlug: string }
const TIPO: Record<string, string> = { 'Museo': 'Museo', 'Area archeologica': 'Area archeologica', 'Castello': 'Castello', 'Chiesa e abbazia': 'Chiesa e abbazia', 'Palazzo e villa': 'Palazzo e villa' };
function carica(): LuogoOsm[] {
  const elenco = osmGrezzi;
  // indice spaziale dei luoghi già presenti (celle di circa 1 km)
  const cella = (lat: number, lon: number) => `${Math.round(lat * 100)}:${Math.round(lon * 100)}`;
  const presenti = new Map<string, string[]>();
  const wikidata = new Set<string>();
  for (const l of [...luoghi, ...luoghiBase]) {
    const k = cella(l.lat, l.lon); presenti.set(k, [...(presenti.get(k) ?? []), l.nome]);
    const o = (l as unknown as { origine?: string }).origine ?? (l as unknown as { id?: string }).id;
    if (o && /^Q\d+$/.test(o)) wikidata.add(o);
  }
  const out: LuogoOsm[] = [];
  for (const e of elenco) {
    if (e.wikidata && wikidata.has(e.wikidata)) continue;
    const c = comune(e.comune);
    if (!c || !Number.isFinite(e.lat) || !Number.isFinite(e.lon)) continue;
    const gx = Math.round(e.lat * 100), gy = Math.round(e.lon * 100);
    let doppio = false;
    for (let dx = -1; dx <= 1 && !doppio; dx++) for (let dy = -1; dy <= 1 && !doppio; dy++) for (const n of presenti.get(`${gx + dx}:${gy + dy}`) ?? []) if (simili(n, e.nome)) { doppio = true; break; }
    if (doppio) continue;
    const k = cella(e.lat, e.lon); presenti.set(k, [...(presenti.get(k) ?? []), e.nome]);
    const p = provincia(c.provincia), r = regione(p.regione);
    const [, tipoOsm, num] = /^osm:([nwr])(\d+)$/.exec(e.id) ?? [];
    const link = e.sito && /^https?:\/\//.test(e.sito) ? e.sito : `https://www.openstreetmap.org/${{ n: 'node', w: 'way', r: 'relation' }[tipoOsm as 'n'] ?? 'node'}/${num ?? ''}`;
    out.push({ id: e.id, nome: e.nome, tipo: TIPO[e.classe] ?? 'Monumento', comuneNome: c.nome, sigla: p.sigla, lat: e.lat, lon: e.lon, sito: link, regioneSlug: r.slug });
  }
  return out;
}
export const luoghiOsm: LuogoOsm[] = carica();
export const osmPerRegione = (r: Regione) => luoghiOsm.filter((l) => l.regioneSlug === r.slug);
export const regioniConOsm = () => regioni.filter((r) => osmPerRegione(r).length > 0);
/** Riquadro della regione [latMin, lonMin, latMax, lonMax], dai suoi comuni, con un margine. */
export function riquadroRegione(r: Regione): [number, number, number, number] {
  const cs = comuni.filter((c) => provincia(c.provincia).regione === r.codiceIstat);
  const la = cs.map((c) => c.lat), lo = cs.map((c) => c.lon);
  return [Math.min(...la) - 0.1, Math.min(...lo) - 0.1, Math.max(...la) + 0.1, Math.max(...lo) + 0.1];
}
