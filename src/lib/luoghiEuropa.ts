// Luoghi storici d'Europa (esclusa l'Italia) da Wikidata: ricerca/luoghi-europa.json, generato da scripts/scopri-luoghi-europa.mjs.
// Compaiono sulla mappa dei luoghi, caricati per paese quando la mappa si avvicina, e nell'indice /luoghi/europa/.
import { readFileSync, existsSync } from 'node:fs';

export interface LuogoEuropa { id: string; nome: string; tipo: string; paese: string; localita: string; lat: number; lon: number; sito: string }
interface Grezzo { id: string; nome: string; classe: string; paese: string; localita?: string; lat: number; lon: number; sito?: string }

const NOMI: Record<string, string> = {};
function carica(): LuogoEuropa[] {
  const file = 'ricerca/luoghi-europa.json';
  if (!existsSync(file)) return [];
  const dati = JSON.parse(readFileSync(file, 'utf8'));
  Object.assign(NOMI, dati.paesi ?? {});
  return ((dati.luoghi ?? []) as Grezzo[]).filter((l) => l.paese !== 'IT' && Number.isFinite(l.lat) && Number.isFinite(l.lon)).map((l) => ({
    id: l.id, nome: l.nome, tipo: l.classe, paese: l.paese, localita: l.localita ?? '', lat: l.lat, lon: l.lon,
    sito: l.sito && /^https?:\/\//.test(l.sito) ? l.sito : `https://www.wikidata.org/wiki/${l.id}`,
  }));
}
export const luoghiEuropa: LuogoEuropa[] = carica();
export const nomePaese = (iso: string) => NOMI[iso] ?? iso;
export const paesiEuropa = () => [...new Set(luoghiEuropa.map((l) => l.paese))].sort((a, b) => nomePaese(a).localeCompare(nomePaese(b), 'it'));
export const luoghiDelPaese = (iso: string) => luoghiEuropa.filter((l) => l.paese === iso);
export const slugPaese = (iso: string) => iso.toLowerCase();
/** Riquadro del paese [latMin, lonMin, latMax, lonMax], dai suoi luoghi (ignora i valori estremi dei territori d'oltremare). */
export function riquadroPaese(iso: string): [number, number, number, number] {
  const l = luoghiDelPaese(iso);
  const q = (v: number[], p: number) => { const s = [...v].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.floor(s.length * p)))]; };
  const la = l.map((x) => x.lat), lo = l.map((x) => x.lon);
  return [q(la, 0.02) - 0.2, q(lo, 0.02) - 0.2, q(la, 0.98) + 0.2, q(lo, 0.98) + 0.2];
}
