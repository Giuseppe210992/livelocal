// Quanto del sito si fa indicizzare ai motori di ricerca (Google ha tolto le pagine dall'indice il 12/11/2026
// dopo una crescita troppo rapida: si riparte a fasi). Si cambia solo il numero in src/data/indicizzazione.json.
//   Fase 1: solo le pagine principali (PAGINE_PRINCIPALI).
//   Fase 2: in più gli eventi in corso o che iniziano entro 7 giorni.
//   Fase 3: tutte le pagine; gli eventi in corso o che iniziano entro 21 giorni.
// Le pagine fuori fase restano online e raggiungibili, ma hanno «noindex» e non stanno nella mappa del sito.
import dati from '../data/indicizzazione.json';

export const FASE: number = dati.fase;
export const PAGINE_PRINCIPALI = ['/', '/oggi/', '/domani/', '/weekend/', '/luoghi/'];
/** Giorni di anticipo con cui un evento entra nell'indice (0 = nessun evento). */
export const GIORNI_INDICE = FASE >= 3 ? 21 : FASE === 2 ? 7 : 0;

/** Pagine che non sono eventi: indicizzabili se principali, o dalla fase 3 in poi (tranne quelle tecniche). */
export function paginaIndicizzabile(percorso: string): boolean {
  if (PAGINE_PRINCIPALI.includes(percorso)) return true;
  if (FASE < 3) return false;
  return !['/privacy/', '/segnala/', '/segnala/modulo/', '/sponsor/'].includes(percorso);
}
