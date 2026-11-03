// Immagine per ogni evento (1200x630): serve per l'anteprima su WhatsApp e social e per i risultati di Google.
// Si disegna in fase di costruzione con satori (testo -> SVG) e resvg (SVG -> PNG). Font: Inter (licenza OFL).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { Evento } from './eventi';
import { quandoEsteso, maiuscola } from './date';
import { SITE_URL } from './sito';

const cartellaFont = join(process.cwd(), 'node_modules', '@fontsource', 'inter', 'files');
const font = (peso: 400 | 700 | 800) => readFileSync(join(cartellaFont, `inter-latin-${peso}-normal.woff`));
let caricati: { name: string; data: Buffer; weight: 400 | 700 | 800; style: 'normal' }[] | null = null;
const fonts = () => (caricati ??= ([400, 700, 800] as const).map((peso) => ({ name: 'Inter', data: font(peso), weight: peso, style: 'normal' as const })));

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function immagineEvento(e: Evento): Promise<Buffer> {
  const titolo = e.titolo;
  const grandezza = titolo.length > 70 ? 50 : titolo.length > 45 ? 60 : 72;
  const luogo = [e.luogo, e.frazioneDati?.nome, `${e.comuneDati.nome} (${e.provinciaDati.sigla})`].filter((v, i, a) => v && a.indexOf(v) === i).join(', ');
  const dominio = SITE_URL.replace(/^https?:\/\//, '');

  const albero = el('div', { width: '1200px', height: '630px', display: 'flex', flexDirection: 'column', background: '#faf7f2', color: '#1b2430', fontFamily: 'Inter' }, [
    el('div', { display: 'flex', flexDirection: 'column', flex: 1, padding: '56px 72px 24px 72px' }, [
      el('div', { display: 'flex', fontSize: 28, fontWeight: 800, color: '#c85d1e', letterSpacing: 2, textTransform: 'uppercase' }, e.categoriaDati.nome + (e.etichettaStato ? `  ·  ${e.etichettaStato}` : '')),
      el('div', { display: 'flex', flex: 1, alignItems: 'center' }, el('div', { display: 'flex', fontSize: grandezza, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, lineClamp: 3 }, titolo)),
      el('div', { display: 'flex', fontSize: 34, fontWeight: 700, color: '#0b5e8a' }, maiuscola(quandoEsteso(e.inizio, e.fine))),
      el('div', { display: 'flex', fontSize: 30, fontWeight: 400, color: '#5a6472', marginTop: 8, lineClamp: 2 }, luogo),
    ]),
    el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#0b5e8a', color: '#ffffff', padding: '0 72px', height: 84 }, [
      el('div', { display: 'flex', fontSize: 36, fontWeight: 800 }, [el('span', {}, 'Live'), el('span', { color: '#ffd2b3' }, 'Local')]),
      el('div', { display: 'flex', fontSize: 26, fontWeight: 400 }, dominio),
    ]),
  ]);

  const svg = await satori(albero as never, { width: 1200, height: 630, fonts: fonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
