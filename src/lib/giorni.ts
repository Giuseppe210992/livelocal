// Pagine "Oggi", "Domani" e "Questo weekend".
// Il sito si ricostruisce ogni ora, quindi "domani" è sempre il giorno dopo la costruzione (ora italiana).
// Chi chiede a un assistente "eventi di domani" trova così una pagina già pronta, senza JavaScript.

import { eventi } from './eventi';
import type { Evento } from './eventi';
import { istante, fineGiornata, maiuscola } from './date';

const ORA = new Date(); // momento della costruzione del sito

/** Data italiana di un istante, nel formato AAAA-MM-GG. */
const dataRoma = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);

function spostaGiorni(data: string, n: number): string {
  const [a, m, g] = data.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, g + n)).toISOString().slice(0, 10);
}

/** "mercoledì 4 novembre 2026" */
export function dataEstesa(data: string): string {
  const [a, m, g] = data.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, g)).toLocaleDateString('it-IT', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });
}

export const oggiData = () => dataRoma(ORA);
export const domaniData = () => spostaGiorni(oggiData(), 1);

/** Sabato e domenica di questo weekend (se oggi è domenica, il sabato è ieri). */
export function giorniWeekend(): [string, string] {
  const [a, m, g] = oggiData().split('-').map(Number);
  const w = new Date(Date.UTC(a, m - 1, g)).getUTCDay(); // 0 = domenica
  const sabato = w === 0 ? -1 : 6 - w;
  return [spostaGiorni(oggiData(), sabato), spostaGiorni(oggiData(), sabato + 1)];
}

/** Eventi non ancora finiti che toccano almeno uno dei giorni indicati. Prima quelli che iniziano quel giorno, poi quelli già in corso. */
export function eventiDei(giorni: string[]): Evento[] {
  const da = istante(giorni[0]).getTime();
  const a = fineGiornata(giorni[giorni.length - 1]).getTime();
  const trovati = eventi.filter((e) => !e.concluso && e.inizioIstante.getTime() <= a && e.fineIstante.getTime() >= da);
  const iniziaNei = (e: Evento) => e.inizioIstante.getTime() >= da;
  return trovati.sort((x, y) => Number(iniziaNei(y)) - Number(iniziaNei(x)) || x.inizioIstante.getTime() - y.inizioIstante.getTime());
}

export const titoloGiorno = (data: string) => maiuscola(dataEstesa(data));
