// Luoghi storici di un paese europeo, nello stesso formato di /luoghi.json. Si caricano quando la mappa si avvicina.
import type { APIRoute } from 'astro';
import { paesiEuropa, luoghiDelPaese, slugPaese } from '../../lib/luoghiEuropa';

export function getStaticPaths() {
  return paesiEuropa().map((iso) => ({ params: { paese: slugPaese(iso) }, props: { iso } }));
}
export const GET: APIRoute = ({ props }) => {
  const l = luoghiDelPaese(props.iso).map((x) => [x.id, x.nome, x.tipo, x.localita || '—', x.paese, Number(x.lat.toFixed(5)), Number(x.lon.toFixed(5)), 0, '', 0, x.sito]);
  return new Response(JSON.stringify({ l }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
