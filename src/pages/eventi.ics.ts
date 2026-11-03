// Calendario completo da aggiungere a Google Calendar ("Aggiungi da URL").
import type { APIRoute } from 'astro';
import { eventi } from '../lib/eventi';
import { calendario } from '../lib/ics';
import { SITO } from '../lib/sito';

export const GET: APIRoute = () =>
  new Response(calendario(eventi, `${SITO.nome} – Italia`), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
