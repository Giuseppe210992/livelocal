// Gruppi di pagine per la mappa del sito. Una sola lista di 8.000+ indirizzi è lenta da rileggere (Bing l'aveva letta una volta sola),
// quindi /sitemap.xml è un indice che rimanda a quattro mappe più piccole: principali, territorio, eventi e luoghi.
import { eventi, eventiDelComune, eventiDellaFrazione, eventiDellaProvincia, eventiDellaRegione, comuniConPagina, regioniConEventi } from './eventi';
import type { Evento } from './eventi';
import { province, comuni, percorsoRegione, percorsoProvincia, percorsoComune, percorsoFrazione } from './luoghi';
import { paginaIndicizzabile } from './indicizzazione';
import { luoghi, regioniConLuoghi, provinceConLuoghi, percorsoZona } from './luoghiDaVisitare';

export interface VocePagina { percorso: string; lastmod?: string }
const ultima = (lista: Evento[]) => lista.map((e) => e.inserito).sort().at(-1);
const ultimaLuoghi = luoghi.map((l) => l.verificato).sort().at(-1);

export const NOMI_SITEMAP = ['principali', 'territorio', 'eventi', 'luoghi'] as const;
export type NomeSitemap = (typeof NOMI_SITEMAP)[number];

export function gruppo(nome: NomeSitemap): VocePagina[] {
  return tutte(nome).filter((v) => v.percorso.startsWith('/evento/') || paginaIndicizzabile(v.percorso));
}
function tutte(nome: NomeSitemap): VocePagina[] {
  if (nome === 'principali') return [
    { percorso: '/', lastmod: ultima(eventi) }, { percorso: '/oggi/' }, { percorso: '/domani/' }, { percorso: '/weekend/' },
    { percorso: '/mappa/', lastmod: ultima(eventi) }, { percorso: '/vicino-a-me/', lastmod: ultima(eventi) },
    { percorso: '/luoghi/', lastmod: ultimaLuoghi }, { percorso: '/luoghi/mappa/' }, { percorso: '/luoghi/europa/' },
    { percorso: '/sponsor/' }, { percorso: '/segnala/' }, { percorso: '/segnala/modulo/' }, { percorso: '/privacy/' },
  ];
  if (nome === 'territorio') return [
    ...regioniConEventi().map((r) => ({ percorso: percorsoRegione(r), lastmod: ultima(eventiDellaRegione(r)) })),
    ...province.filter((p) => eventiDellaProvincia(p).length > 0).map((p) => ({ percorso: percorsoProvincia(p), lastmod: ultima(eventiDellaProvincia(p)) })),
    ...comuniConPagina(comuni).map((c) => ({ percorso: percorsoComune(c), lastmod: ultima(eventiDelComune(c)) })),
    ...comuni.flatMap((c) => c.frazioni.map((f) => ({ percorso: percorsoFrazione(c, f), lastmod: ultima(eventiDellaFrazione(c, f)) }))),
    ...regioniConLuoghi().flatMap((r) => provinceConLuoghi(r).map((p) => ({ percorso: percorsoZona(p) }))),
  ];
  // Solo gli eventi in corso o che iniziano entro GIORNI_INDICE giorni (gli altri hanno «noindex»): i conclusi restano online come archivio (e raggiungibili dai link),
  // ma non vanno in mappa. Così i motori di ricerca spendono le visite sulle pagine che servono a chi cerca
  // un evento oggi, e non sulle migliaia già finite (quasi il 43% del totale).
  if (nome === 'eventi') return eventi.filter((e) => e.indicizzabile).map((e) => ({ percorso: e.percorso, lastmod: e.inserito }));
  return luoghi.map((l) => ({ percorso: l.percorso, lastmod: l.verificato }));
}
/** Mappe che hanno almeno una pagina (in fase 1 restano solo quelle principali). */
export const sitemapNonVuote = () => NOMI_SITEMAP.filter((n) => gruppo(n).length > 0);
export const ultimaModifica = (nome: NomeSitemap) => gruppo(nome).map((v) => v.lastmod ?? '').filter(Boolean).sort().at(-1);
