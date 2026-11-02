// API aperta: tutti gli eventi pubblicati in formato JSON. Mai contatti privati.
import type { APIRoute } from 'astro';
import { eventi, localita } from '../lib/eventi';
import { isoConFuso } from '../lib/date';
import { statoSchema } from '../lib/jsonld';
import { SITO, urlAssoluto } from '../lib/sito';

export const GET: APIRoute = () => {
  const dati = {
    fonte: SITO.nome,
    descrizione: 'Eventi pubblici del territorio, controllati prima della pubblicazione. Orari in ora italiana (Europe/Rome).',
    aggiornato: new Date().toISOString(),
    pagina: urlAssoluto('/'),
    totale: eventi.length,
    eventi: eventi.map((e) => ({
      id: `${e.anno}/${e.slug}`,
      url: urlAssoluto(e.percorso),
      titolo: e.titolo,
      categoria: e.categoriaDati.nome,
      inizio: isoConFuso(e.inizio),
      fine: e.fine ? isoConFuso(e.fine) : null,
      stato: e.stato === 'annullato' ? 'annullato' : e.stato === 'rinviato' ? 'rinviato' : e.concluso ? 'concluso' : 'in programma',
      statoSchemaOrg: statoSchema(e),
      dataPrecedente: e.inizioPrecedente ? isoConFuso(e.inizioPrecedente) : null,
      luogo: {
        nome: e.luogo,
        indirizzo: e.indirizzo,
        localita: localita(e),
        comune: e.comuneDati.nome,
        codiceIstatComune: e.comuneDati.codiceIstat,
        frazione: e.frazioneDati?.nome ?? null,
        provincia: e.provinciaDati.sigla,
        regione: e.regioneDati.nome,
        lat: e.lat,
        lon: e.lon,
        coordinateApprossimate: e.coordinateApprossimate,
      },
      descrizione: e.descrizione,
      prezzo: e.prezzo,
      prenotazione: e.prenotazione,
      organizzatore: e.organizzatore,
      fonti: e.fonti.map((f) => ({ nome: f.nome, tipo: f.tipo, url: f.url })),
      inserito: e.inserito,
    })),
  };
  return new Response(JSON.stringify(dati, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
