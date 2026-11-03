// Dati strutturati schema.org (JSON-LD) per Google e per gli assistenti AI.
// Riferimento: https://developers.google.com/search/docs/appearance/structured-data/event

import type { Evento } from './eventi';
import { capEvento } from './eventi';
import { isoConFuso } from './date';
import { SITO, urlAssoluto } from './sito';

const STATO_SCHEMA = {
  programmato: 'https://schema.org/EventScheduled',
  annullato: 'https://schema.org/EventCancelled',
  rinviato: 'https://schema.org/EventPostponed',
  spostato: 'https://schema.org/EventRescheduled',
};

export function statoSchema(e: Evento): string {
  if (e.stato === 'annullato') return STATO_SCHEMA.annullato;
  if (e.stato === 'rinviato') return STATO_SCHEMA.rinviato;
  if (e.inizioPrecedente) return STATO_SCHEMA.spostato;
  return STATO_SCHEMA.programmato;
}

export function jsonLdEvento(e: Evento) {
  const url = urlAssoluto(e.percorso);
  const via = e.frazioneDati && !e.indirizzo.includes(e.frazioneDati.nome)
    ? `${e.indirizzo}, ${e.frazioneDati.nome}`
    : e.indirizzo;

  const dati: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#evento`,
    name: e.titolo,
    description: e.descrizione,
    url,
    image: [urlAssoluto(`${e.percorso}immagine.png`)],
    inLanguage: SITO.lingua,
    startDate: isoConFuso(e.inizio),
    ...(e.fine ? { endDate: isoConFuso(e.fine) } : {}),
    eventStatus: statoSchema(e),
    ...(e.inizioPrecedente ? { previousStartDate: isoConFuso(e.inizioPrecedente) } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: e.luogo,
      address: {
        '@type': 'PostalAddress',
        streetAddress: via,
        addressLocality: e.comuneDati.nome,
        ...(capEvento(e) ? { postalCode: capEvento(e) } : {}),
        addressRegion: e.provinciaDati.sigla,
        addressCountry: 'IT',
      },
      geo: { '@type': 'GeoCoordinates', latitude: e.lat, longitude: e.lon },
    },
  };

  if (e.prezzo.tipo === 'gratuito') {
    dati.isAccessibleForFree = true;
    dati.offers = { '@type': 'Offer', price: 0, priceCurrency: 'EUR', url, availability: 'https://schema.org/InStock' };
  } else if (e.prezzo.tipo === 'euro' && typeof e.prezzo.importo === 'number') {
    dati.offers = { '@type': 'Offer', price: e.prezzo.importo, priceCurrency: 'EUR', url: e.prenotazione?.startsWith('http') ? e.prenotazione : url };
  }

  if (e.organizzatore) dati.organizer = { '@type': 'Organization', name: e.organizzatore };

  return dati;
}

export function jsonLdBriciole(voci: { nome: string; percorso: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: voci.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: v.nome,
      item: urlAssoluto(v.percorso),
    })),
  };
}

export function jsonLdSito() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITO.nome,
    alternateName: SITO.slogan,
    url: urlAssoluto('/'),
    inLanguage: SITO.lingua,
    description: SITO.descrizione,
  };
}
