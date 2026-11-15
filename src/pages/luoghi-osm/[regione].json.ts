// Luoghi minori di una regione (da OpenStreetMap), nello stesso formato di /luoghi.json. Si caricano quando la mappa si avvicina.
import type { APIRoute } from 'astro';
import { regioniConOsm, osmPerRegione } from '../../lib/luoghiOsm';

export function getStaticPaths() {
  return regioniConOsm().map((r) => ({ params: { regione: r.slug }, props: { r } }));
}
export const GET: APIRoute = ({ props }) => {
  const l = osmPerRegione(props.r).map((x) => [x.id, x.nome, x.tipo, x.comuneNome, x.sigla, Number(x.lat.toFixed(5)), Number(x.lon.toFixed(5)), 0, '', 0, x.sito]);
  return new Response(JSON.stringify({ l }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
