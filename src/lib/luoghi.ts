// Luoghi: regioni, province, comuni (codice ISTAT) e frazioni.
import dati from '../data/luoghi.json';

export interface Regione { codiceIstat: string; nome: string; slug: string }
export interface Provincia { codiceIstat: string; sigla: string; nome: string; slug: string; regione: string }
export interface Frazione { nome: string; slug: string; cap: string; lat: number; lon: number }
export interface Comune {
  codiceIstat: string;
  codiceCatastale: string;
  nome: string;
  slug: string;
  provincia: string;
  cap: string;
  lat: number;
  lon: number;
  frazioni: Frazione[];
}

export const regioni: Regione[] = dati.regioni;
export const province: Provincia[] = dati.province;
export const comuni: Comune[] = dati.comuni;

export const regione = (codice: string) => regioni.find((r) => r.codiceIstat === codice)!;
export const provincia = (codice: string) => province.find((p) => p.codiceIstat === codice)!;
export const comune = (codice: string) => comuni.find((c) => c.codiceIstat === codice);

export const provinceDi = (r: Regione) => province.filter((p) => p.regione === r.codiceIstat);
export const comuniDi = (p: Provincia) => comuni.filter((c) => c.provincia === p.codiceIstat);

export const percorsoRegione = (r: Regione) => `/eventi/${r.slug}/`;
export const percorsoProvincia = (p: Provincia) => `${percorsoRegione(regione(p.regione))}${p.slug}/`;
export const percorsoComune = (c: Comune) => `${percorsoProvincia(provincia(c.provincia))}${c.slug}/`;
export const percorsoFrazione = (c: Comune, f: Frazione) => `${percorsoComune(c)}${f.slug}/`;

/** Elenco per le briciole di pane (dal più grande al più piccolo). */
export function briciole(c: Comune, f?: Frazione | null) {
  const p = provincia(c.provincia);
  const r = regione(p.regione);
  const voci = [
    { nome: r.nome, percorso: percorsoRegione(r) },
    { nome: `Provincia di ${p.nome}`, percorso: percorsoProvincia(p) },
    { nome: c.nome, percorso: percorsoComune(c) },
  ];
  if (f) voci.push({ nome: f.nome, percorso: percorsoFrazione(c, f) });
  return voci;
}

/** Distanza in km tra due punti (formula dell'emisenoverso). */
export function distanzaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
