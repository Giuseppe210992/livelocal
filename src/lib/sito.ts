// Impostazioni generali del sito.
// SITE_URL e BASE_PATH si possono cambiare senza toccare il codice (vedi astro.config.mjs).

import impostazioni from '../data/impostazioni.json';

export const IMPOSTAZIONI = impostazioni as { emailContatto: string; formKey: string };

export const SITO = {
  nome: 'LiveLocal',
  slogan: 'Gli eventi vicino a te',
  descrizione:
    'Calendario gratuito e pubblico degli eventi del Lazio e della Campania: mostre, visite guidate, concerti, sagre, feste e conferenze, giorno per giorno e vicino a te.',
  lingua: 'it',
  fuso: 'Europe/Rome',
  promotore: { nome: 'Room & Relax Scauri', url: 'https://roomandrelax.it' },
};

// Indirizzo pubblico del sito, senza barra finale (es. https://giuseppe210992.github.io).
export const SITE_URL: string = (import.meta.env.SITE ?? 'https://giuseppe210992.github.io').replace(/\/$/, '');

// Percorso base, con la barra finale (es. "/" oppure "/livelocal/").
const BASE: string = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Link interno: aggiunge il percorso base. Esempio: href('/eventi/lazio/') */
export function href(percorso: string): string {
  return BASE + percorso.replace(/^\//, '');
}

/** Indirizzo completo, da usare per canonical, sitemap, JSON-LD, feed. */
export function urlAssoluto(percorso: string): string {
  const base = new URL(SITE_URL);
  return `${base.origin}${href(percorso)}`;
}
