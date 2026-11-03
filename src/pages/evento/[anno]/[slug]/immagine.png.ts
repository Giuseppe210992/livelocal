// Immagine dell'evento (anteprima per WhatsApp, social e dati per Google).
import type { APIRoute } from 'astro';
import { eventi } from '../../../../lib/eventi';
import type { Evento } from '../../../../lib/eventi';
import { immagineEvento } from '../../../../lib/immagine';

export function getStaticPaths() {
  return eventi.map((e) => ({ params: { anno: String(e.anno), slug: e.slug }, props: { e } }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await immagineEvento((props as { e: Evento }).e), { headers: { 'Content-Type': 'image/png' } });
