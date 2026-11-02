// Luoghi: regioni, province, comuni (codice ISTAT) e frazioni.
// - territorio.json: generato da scripts/aggiorna-comuni.mjs (dati ISTAT), non modificarlo a mano
// - frazioni.json: scritto a mano (frazioni, CAP, centro abitato al posto del baricentro)
import territorio from '../data/territorio.json';
import datiFrazioni from '../data/frazioni.json';

export interface Regione { codiceIstat: string; nome: string; slug: string }
export interface Provincia { codiceIstat: string; sigla: string; nome: string; slug: string; tipo: 'Provincia' | 'Città metropolitana'; regione: string }
export interface Frazione { nome: string; slug: string; cap: string; lat: number; lon: number }
export interface Comune {
  codiceIstat: string;
  codiceCatastale: string;
  nome: string;
  slug: string;
  provincia: string;
  lat: number;
  lon: number;
  cap: string | null;
  frazioni: Frazione[];
}

interface Aggiunte { cap?: string; centro?: { lat: number; lon: number }; frazioni?: Frazione[] }
const aggiunte = datiFrazioni as unknown as Record<string, Aggiunte>;

export const regioni: Regione[] = territorio.regioni;
export const province: Provincia[] = territorio.province as Provincia[];
export const comuni: Comune[] = territorio.comuni.map((c) => {
  const extra = aggiunte[c.codiceIstat] ?? {};
  return {
    ...c,
    lat: extra.centro?.lat ?? c.lat,
    lon: extra.centro?.lon ?? c.lon,
    cap: extra.cap ?? null,
    frazioni: extra.frazioni ?? [],
  };
});

const perCodice = new Map(comuni.map((c) => [c.codiceIstat, c]));

export const regione = (codice: string) => regioni.find((r) => r.codiceIstat === codice)!;
export const provincia = (codice: string) => province.find((p) => p.codiceIstat === codice)!;
export const comune = (codice: string) => perCodice.get(codice);

export const provinceDi = (r: Regione) => province.filter((p) => p.regione === r.codiceIstat);
export const comuniDi = (p: Provincia) => comuni.filter((c) => c.provincia === p.codiceIstat);

/** "Provincia di Latina" oppure "Città metropolitana di Napoli" */
export const nomeProvincia = (p: Provincia) => `${p.tipo} di ${p.nome}`;
/** "in provincia di Latina" oppure "nell'area metropolitana di Napoli" */
export const inProvincia = (p: Provincia) =>
  p.tipo === 'Città metropolitana' ? `nell'area metropolitana di ${p.nome}` : `in provincia di ${p.nome}`;
/** "nel Lazio", "in Campania" */
const REGIONI_CON_NEL = ['Lazio', 'Molise', 'Veneto', 'Piemonte', 'Trentino-Alto Adige/Südtirol', 'Friuli-Venezia Giulia'];
export const inRegione = (r: Regione) => (REGIONI_CON_NEL.includes(r.nome) ? `nel ${r.nome}` : `in ${r.nome}`);

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
    { nome: nomeProvincia(p), percorso: percorsoProvincia(p) },
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
