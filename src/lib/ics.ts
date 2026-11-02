// Calendario .ics (si apre con Google Calendar, Calendario di Samsung, iPhone...).
// Regole del formato: RFC 5545. Righe con CRLF e al massimo 75 byte.

import type { Evento } from './eventi';
import { istante, leggi } from './date';
import { SITO, urlAssoluto } from './sito';

const due = (n: number) => String(n).padStart(2, '0');

function utc(d: Date): string {
  return `${d.getUTCFullYear()}${due(d.getUTCMonth() + 1)}${due(d.getUTCDate())}T${due(d.getUTCHours())}${due(d.getUTCMinutes())}${due(d.getUTCSeconds())}Z`;
}

function soloData(valore: string, giorniInPiu = 0): string {
  const p = leggi(valore);
  const d = new Date(Date.UTC(p.anno, p.mese - 1, p.giorno + giorniInPiu));
  return `${d.getUTCFullYear()}${due(d.getUTCMonth() + 1)}${due(d.getUTCDate())}`;
}

const testo = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Spezza le righe lunghe come vuole lo standard (senza tagliare a metà una lettera accentata). */
function piega(riga: string): string {
  const enc = new TextEncoder();
  if (enc.encode(riga).length <= 75) return riga;
  const pezzi: string[] = [];
  let corrente = '';
  for (const carattere of riga) {
    const limite = pezzi.length === 0 ? 75 : 74; // le righe di continuazione iniziano con uno spazio
    if (enc.encode(corrente + carattere).length > limite) {
      pezzi.push(corrente);
      corrente = carattere;
    } else corrente += carattere;
  }
  pezzi.push(corrente);
  return pezzi.join('\r\n ');
}

function vevento(e: Evento, adesso: Date): string[] {
  const righe = [
    'BEGIN:VEVENT',
    `UID:${e.anno}-${e.slug}@succedequi`,
    `DTSTAMP:${utc(adesso)}`,
  ];
  if (leggi(e.inizio).ora === null) {
    righe.push(`DTSTART;VALUE=DATE:${soloData(e.inizio)}`);
    righe.push(`DTEND;VALUE=DATE:${soloData(e.fine ?? e.inizio, 1)}`); // la fine è esclusa
  } else {
    righe.push(`DTSTART:${utc(istante(e.inizio))}`);
    if (e.fine) righe.push(`DTEND:${utc(istante(e.fine))}`);
  }
  const dove = [e.luogo, e.indirizzo, e.frazioneDati?.nome, `${e.comuneDati.nome} (${e.provinciaDati.sigla})`]
    .filter((v, i, a) => v && a.indexOf(v) === i)
    .join(', ');
  righe.push(
    `SUMMARY:${testo(e.titolo)}`,
    `LOCATION:${testo(dove)}`,
    `GEO:${e.lat};${e.lon}`,
    `DESCRIPTION:${testo(`${e.descrizione}\n\nDettagli e aggiornamenti: ${urlAssoluto(e.percorso)}`)}`,
    `URL:${urlAssoluto(e.percorso)}`,
    `STATUS:${e.stato === 'annullato' ? 'CANCELLED' : e.stato === 'rinviato' ? 'TENTATIVE' : 'CONFIRMED'}`,
    `CATEGORIES:${testo(e.categoriaDati.nome)}`,
    'END:VEVENT',
  );
  return righe;
}

export function calendario(lista: Evento[], nome = `${SITO.nome} – eventi`): string {
  const adesso = new Date();
  const righe = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SuccedeQui//Calendario eventi//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${testo(nome)}`,
    'X-WR-TIMEZONE:Europe/Rome',
    ...lista.flatMap((e) => vevento(e, adesso)),
    'END:VCALENDAR',
  ];
  return righe.map(piega).join('\r\n') + '\r\n';
}
