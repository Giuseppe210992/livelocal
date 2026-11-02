// Eventi: legge src/data/eventi.json, controlla che i dati siano completi
// e aggiunge ciò che serve alle pagine (indirizzo della pagina, stato, luogo completo).
// Se un dato è sbagliato la costruzione del sito si ferma con un messaggio chiaro.

import grezzi from '../data/eventi.json';
import categorieDati from '../data/categorie.json';
import { comune as trovaComune, provincia, regione, percorsoComune, percorsoFrazione } from './luoghi';
import type { Comune, Frazione, Provincia, Regione } from './luoghi';
import { istante, fineGiornata, haOrario, leggi } from './date';

export type TipoPrezzo = 'gratuito' | 'euro' | 'offerta' | 'non-indicato';
export type Stato = 'pubblicato' | 'annullato' | 'rinviato' | 'in-revisione';

export interface Fonte { nome: string; tipo: 'ufficiale' | 'stampa' | 'aggregatore' | 'organizzatore'; url: string; consultata: string }
export interface Categoria { slug: string; nome: string; plurale: string }

export interface EventoGrezzo {
  slug: string;
  titolo: string;
  categoria: string;
  inizio: string;
  fine: string | null;
  luogo: string;
  indirizzo: string;
  comune: string;
  frazione: string | null;
  lat: number;
  lon: number;
  coordinateApprossimate: boolean;
  descrizione: string;
  prezzo: { tipo: TipoPrezzo; importo?: number };
  prenotazione: string | null;
  organizzatore: string | null;
  stato: Stato;
  inizioPrecedente: string | null;
  fonti: Fonte[];
  inserito: string;
}

export interface Evento extends EventoGrezzo {
  anno: number;
  percorso: string; // es. /evento/2026/calici-a-corte-minturno/
  comuneDati: Comune;
  frazioneDati: Frazione | null;
  provinciaDati: Provincia;
  regioneDati: Regione;
  categoriaDati: Categoria;
  inizioIstante: Date;
  fineIstante: Date; // quando l'evento si considera finito
  concluso: boolean;
  etichettaStato: string | null; // "Concluso", "Nuove date", "Annullato", "Rinviato"
}

export const categorie: Categoria[] = categorieDati;

const ORA = new Date(); // momento della costruzione del sito (si rigenera ogni ora)

function errore(e: Partial<EventoGrezzo>, messaggio: string): never {
  throw new Error(`[eventi.json] Evento "${e.titolo ?? e.slug ?? '?'}": ${messaggio}`);
}

function controlla(e: EventoGrezzo): void {
  const obbligatori: (keyof EventoGrezzo)[] = ['slug', 'titolo', 'categoria', 'inizio', 'luogo', 'comune', 'descrizione', 'stato', 'fonti', 'inserito'];
  for (const campo of obbligatori) if (!e[campo]) errore(e, `manca il campo "${campo}"`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug)) errore(e, `slug non valido "${e.slug}" (solo minuscole, numeri e trattini)`);
  leggi(e.inizio);
  if (e.fine) {
    leggi(e.fine);
    if (istante(e.fine) < istante(e.inizio)) errore(e, 'la fine è prima dell\'inizio');
    if (haOrario(e.inizio) !== haOrario(e.fine)) errore(e, 'inizio e fine devono avere entrambi l\'orario o nessuno dei due');
  }
  if (!categorie.some((c) => c.slug === e.categoria)) errore(e, `categoria sconosciuta "${e.categoria}"`);
  const c = trovaComune(e.comune);
  if (!c) errore(e, `comune con codice ISTAT ${e.comune} non presente in luoghi.json`);
  if (e.frazione && !c.frazioni.some((f) => f.slug === e.frazione)) errore(e, `frazione "${e.frazione}" non presente in ${c.nome}`);
  if (typeof e.lat !== 'number' || typeof e.lon !== 'number') errore(e, 'mancano le coordinate');
  if (!['pubblicato', 'annullato', 'rinviato', 'in-revisione'].includes(e.stato)) errore(e, `stato sconosciuto "${e.stato}"`);
  if (!e.fonti.length) errore(e, 'serve almeno una fonte');
  if (/@|\b\d{3}[\s.]?\d{6,7}\b/.test(`${e.descrizione} ${e.organizzatore ?? ''}`))
    errore(e, 'la descrizione o l\'organizzatore sembrano contenere un\'email o un telefono: i contatti non si pubblicano');
}

function arricchisci(e: EventoGrezzo): Evento {
  const comuneDati = trovaComune(e.comune)!;
  const frazioneDati = e.frazione ? comuneDati.frazioni.find((f) => f.slug === e.frazione)! : null;
  const provinciaDati = provincia(comuneDati.provincia);
  const regioneDati = regione(provinciaDati.regione);
  const inizioIstante = istante(e.inizio);
  // Fine: l'orario di fine se c'è, altrimenti la fine della giornata (ultima o unica).
  const fineIstante = e.fine
    ? haOrario(e.fine) ? istante(e.fine) : fineGiornata(e.fine)
    : fineGiornata(e.inizio);
  const concluso = fineIstante < ORA;

  let etichettaStato: string | null = null;
  if (e.stato === 'annullato') etichettaStato = 'Annullato';
  else if (e.stato === 'rinviato') etichettaStato = 'Rinviato a data da definire';
  else if (concluso) etichettaStato = 'Concluso';
  else if (e.inizioPrecedente) etichettaStato = 'Nuove date';

  return {
    ...e,
    anno: leggi(e.inizio).anno,
    percorso: `/evento/${leggi(e.inizio).anno}/${e.slug}/`,
    comuneDati,
    frazioneDati,
    provinciaDati,
    regioneDati,
    categoriaDati: categorie.find((c) => c.slug === e.categoria)!,
    inizioIstante,
    fineIstante,
    concluso,
    etichettaStato,
  };
}

function carica(): Evento[] {
  const lista = (grezzi as EventoGrezzo[]).filter((e) => e.stato !== 'in-revisione');
  lista.forEach(controlla);
  const visti = new Set<string>();
  for (const e of lista) {
    const chiave = `${leggi(e.inizio).anno}/${e.slug}`;
    if (visti.has(chiave)) errore(e, `indirizzo doppio /evento/${chiave}/: cambia lo slug, ad esempio aggiungendo la data`);
    visti.add(chiave);
  }
  return lista.map(arricchisci).sort((a, b) => a.inizioIstante.getTime() - b.inizioIstante.getTime());
}

export const eventi: Evento[] = carica();

/** Eventi non ancora finiti, dal più vicino. */
export const prossimi = (lista: Evento[] = eventi) => lista.filter((e) => !e.concluso);
/** Eventi conclusi, dal più recente. Restano online come archivio. */
export const passati = (lista: Evento[] = eventi) => lista.filter((e) => e.concluso).reverse();

export const eventiDelComune = (c: Comune) => eventi.filter((e) => e.comune === c.codiceIstat);
export const eventiDellaFrazione = (c: Comune, f: Frazione) =>
  eventi.filter((e) => e.comune === c.codiceIstat && e.frazione === f.slug);
export const eventiDellaProvincia = (p: Provincia) => eventi.filter((e) => e.provinciaDati.codiceIstat === p.codiceIstat);
export const eventiDellaRegione = (r: Regione) => eventi.filter((e) => e.regioneDati.codiceIstat === r.codiceIstat);

/** "Scauri, Minturno (LT)" oppure "Minturno (LT)" */
export function localita(e: Evento): string {
  const base = `${e.comuneDati.nome} (${e.provinciaDati.sigla})`;
  return e.frazioneDati ? `${e.frazioneDati.nome}, ${base}` : base;
}

export function percorsoLocalita(e: Evento): string {
  return e.frazioneDati ? percorsoFrazione(e.comuneDati, e.frazioneDati) : percorsoComune(e.comuneDati);
}

export function testoPrezzo(e: Evento): string {
  switch (e.prezzo.tipo) {
    case 'gratuito': return 'Gratuito';
    case 'euro': return `${e.prezzo.importo?.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}`;
    case 'offerta': return 'A offerta libera';
    default: return 'Non indicato dalla fonte';
  }
}

/** Testo breve per la meta description (massimo ~155 caratteri). */
export function riassunto(testo: string, max = 155): string {
  if (testo.length <= max) return testo;
  const taglio = testo.slice(0, max - 1);
  return `${taglio.slice(0, taglio.lastIndexOf(' '))}…`;
}

export const ETICHETTA_FONTE: Record<Fonte['tipo'], string> = {
  ufficiale: 'fonte ufficiale',
  stampa: 'giornale locale',
  aggregatore: 'sito di eventi',
  organizzatore: 'chi organizza',
};
