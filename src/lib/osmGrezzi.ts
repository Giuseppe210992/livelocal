// Elenco grezzo dei luoghi di OpenStreetMap (ricerca/luoghi-osm.json) e ricerca delle coordinate per nome.
// I luoghi storici sono fissi: se una scheda o un luogo di Wikidata non ha le coordinate esatte, si prendono da un luogo
// di OpenStreetMap con lo stesso nome nello stesso comune (fonte © contributori di OpenStreetMap, ODbL).
import { readFileSync, existsSync } from 'node:fs';

export interface OsmGrezzo { id: string; nome: string; classe: string; comune: string; lat: number; lon: number; sito?: string; wikidata?: string }

export const normNome = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const parole = (t: string) => new Set(normNome(t).split(' ').filter((p) => p.length >= 4));
/** Quanto due nomi si somigliano (0-1): parole di almeno 4 lettere in comune rispetto al nome più corto. */
export function somiglianza(a: string, b: string): number {
  const x = parole(a), y = parole(b);
  if (!x.size || !y.size) return normNome(a) === normNome(b) ? 1 : 0;
  let n = 0; for (const p of x) if (y.has(p)) n++;
  return n / Math.min(x.size, y.size);
}
export const simili = (a: string, b: string) => somiglianza(a, b) >= 0.5;

function carica(): OsmGrezzo[] {
  const file = 'ricerca/luoghi-osm.json';
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')).luoghi ?? []) : [];
}
export const osmGrezzi: OsmGrezzo[] = carica();
const perComune = new Map<string, OsmGrezzo[]>();
for (const o of osmGrezzi) perComune.set(o.comune, [...(perComune.get(o.comune) ?? []), o]);

/** Coordinate esatte di un luogo da OpenStreetMap, cercando per nome nello stesso comune (soglia 0,6). */
export function cercaCoordinate(nome: string, codiceComune: string): { lat: number; lon: number } | null {
  let migliore: OsmGrezzo | null = null, punti = 0.6;
  for (const o of perComune.get(codiceComune) ?? []) { const s = somiglianza(nome, o.nome); if (s >= punti) { punti = s; migliore = o; } }
  return migliore ? { lat: migliore.lat, lon: migliore.lon } : null;
}
