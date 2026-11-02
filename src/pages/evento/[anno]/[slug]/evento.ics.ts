// File .ics del singolo evento (bottone "Aggiungi al calendario").
import type { APIRoute } from 'astro';
import { eventi } from '../../../../lib/eventi';
import type { Evento } from '../../../../lib/eventi';
import { calendario } from '../../../../lib/ics';

export function getStaticPaths() {
  return eventi.map((e) => ({ params: { anno: String(e.anno), slug: e.slug }, props: { e } }));
}

export const GET: APIRoute = ({ props }) =>
  new Response(calendario([(props as { e: Evento }).e], (props as { e: Evento }).e.titolo), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
