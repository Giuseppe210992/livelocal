// Date e orari. Gli eventi sono salvati in ora italiana, così come li scrive chi organizza:
//   "2026-11-06T19:00" (giorno e ora)   oppure   "2026-11-07" (solo giorno).
// Qui le trasformiamo per le pagine (testo in italiano) e per le macchine (ISO 8601 con fuso).

const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const MESI = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];

export interface Parti {
  anno: number;
  mese: number; // 1-12
  giorno: number;
  ora: number | null;
  minuti: number | null;
}

const FORMATO = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/;

export function leggi(valore: string): Parti {
  const m = FORMATO.exec(valore);
  if (!m) throw new Error(`Data non valida: "${valore}". Usa AAAA-MM-GG oppure AAAA-MM-GGTHH:MM`);
  return {
    anno: Number(m[1]),
    mese: Number(m[2]),
    giorno: Number(m[3]),
    ora: m[4] ? Number(m[4]) : null,
    minuti: m[5] ? Number(m[5]) : null,
  };
}

export const haOrario = (valore: string) => leggi(valore).ora !== null;

const due = (n: number) => String(n).padStart(2, '0');

/** Scarto di Roma rispetto a UTC in minuti (60 d'inverno, 120 d'estate) in un certo istante. */
function scartoRoma(istante: Date): number {
  const testo = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Rome',
    timeZoneName: 'longOffset',
  })
    .formatToParts(istante)
    .find((p) => p.type === 'timeZoneName')!.value; // es. "GMT+01:00"
  const m = /GMT([+-])(\d{2}):(\d{2})/.exec(testo);
  if (!m) return 0;
  const minuti = Number(m[2]) * 60 + Number(m[3]);
  return m[1] === '-' ? -minuti : minuti;
}

/** Istante esatto (Date) di un'ora italiana. Senza orario vale la mezzanotte. */
export function istante(valore: string): Date {
  const p = leggi(valore);
  const comeUtc = Date.UTC(p.anno, p.mese - 1, p.giorno, p.ora ?? 0, p.minuti ?? 0);
  const prova = scartoRoma(new Date(comeUtc - 60 * 60 * 1000));
  const scarto = scartoRoma(new Date(comeUtc - prova * 60 * 1000));
  return new Date(comeUtc - scarto * 60 * 1000);
}

/** Fine della giornata italiana (23:59:59) di una data. */
export function fineGiornata(valore: string): Date {
  const p = leggi(valore);
  return new Date(istante(`${p.anno}-${due(p.mese)}-${due(p.giorno)}`).getTime() + 86_400_000 - 1000);
}

/** ISO 8601 per schema.org: "2026-11-06T19:00:00+01:00", oppure "2026-11-07" se manca l'orario. */
export function isoConFuso(valore: string): string {
  const p = leggi(valore);
  const data = `${p.anno}-${due(p.mese)}-${due(p.giorno)}`;
  if (p.ora === null) return data;
  const scarto = scartoRoma(istante(valore));
  const segno = scarto >= 0 ? '+' : '-';
  const ass = Math.abs(scarto);
  return `${data}T${due(p.ora)}:${due(p.minuti ?? 0)}:00${segno}${due(Math.floor(ass / 60))}:${due(ass % 60)}`;
}

function giornoSettimana(p: Parti): string {
  return GIORNI[new Date(Date.UTC(p.anno, p.mese - 1, p.giorno)).getUTCDay()];
}

const orario = (p: Parti) => `${p.ora}:${due(p.minuti ?? 0)}`;

/** "l'8" e "l'11" vogliono l'apostrofo: dall'8, all'11. */
const conArticolo = (prep: 'dal' | 'al', giorno: number) =>
  giorno === 8 || giorno === 11 ? `${prep.slice(0, -1)}ll'${giorno}` : `${prep} ${giorno}`;

/** Testo completo, in minuscolo: "venerdì 6 novembre 2026, dalle 19:00 alle 22:00" oppure "dal 7 all'8 novembre 2026". */
export function quandoEsteso(inizio: string, fine: string | null): string {
  const a = leggi(inizio);
  const b = fine ? leggi(fine) : null;
  const giornoA = `${giornoSettimana(a)} ${a.giorno} ${MESI[a.mese - 1]} ${a.anno}`;

  const stessoGiorno = !b || (a.anno === b.anno && a.mese === b.mese && a.giorno === b.giorno);
  if (stessoGiorno) {
    if (a.ora === null) return giornoA;
    if (b && b.ora !== null) return `${giornoA}, dalle ${orario(a)} alle ${orario(b)}`;
    return `${giornoA}, ore ${orario(a)}`;
  }

  // Più giorni
  const b2 = b!;
  const fineTesto = `${conArticolo('al', b2.giorno)} ${MESI[b2.mese - 1]} ${b2.anno}`;
  const inizioTesto =
    a.anno === b2.anno && a.mese === b2.mese
      ? conArticolo('dal', a.giorno)
      : a.anno === b2.anno
        ? `${conArticolo('dal', a.giorno)} ${MESI[a.mese - 1]}`
        : `${conArticolo('dal', a.giorno)} ${MESI[a.mese - 1]} ${a.anno}`;
  let testo = `${inizioTesto} ${fineTesto}`;
  if (a.ora !== null) testo += `, dalle ${orario(a)}`;
  if (b2.ora !== null) testo += a.ora !== null ? ` alle ${orario(b2)} dell'ultimo giorno` : `, fino alle ${orario(b2)}`;
  return testo;
}

/** Prima lettera maiuscola: "venerdì 6 novembre" -> "Venerdì 6 novembre". */
export const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Parti brevi per il riquadro della data nelle schede: { giorno: "6", mese: "nov", settimana: "ven" } */
export function riquadroData(valore: string) {
  const p = leggi(valore);
  return {
    giorno: String(p.giorno),
    mese: MESI[p.mese - 1].slice(0, 3),
    settimana: giornoSettimana(p).slice(0, 3),
    anno: String(p.anno),
  };
}

/** Riga corta per le schede: "ven 6 nov, 19:00" oppure "7–8 nov". */
export function quandoBreve(inizio: string, fine: string | null): string {
  const a = leggi(inizio);
  const b = fine ? leggi(fine) : null;
  const corto = (p: Parti) => `${p.giorno} ${MESI[p.mese - 1].slice(0, 3)}`;
  if (b && !(a.anno === b.anno && a.mese === b.mese && a.giorno === b.giorno)) {
    return a.mese === b.mese ? `${a.giorno}–${corto(b)}` : `${corto(a)} – ${corto(b)}`;
  }
  const base = `${giornoSettimana(a).slice(0, 3)} ${corto(a)}`;
  if (a.ora === null) return base;
  return b && b.ora !== null ? `${base}, ${orario(a)}–${orario(b)}` : `${base}, ore ${orario(a)}`;
}

/** "2 novembre 2026" da "2026-11-02" */
export function dataSemplice(valore: string): string {
  const p = leggi(valore);
  return `${p.giorno} ${MESI[p.mese - 1]} ${p.anno}`;
}

export const nomeMese = (mese: number) => MESI[mese - 1];

/** Data per i titoli: "6 novembre 2026", "7-8 novembre 2026", "30 ottobre - 2 novembre 2026". */
export function dataTitolo(inizio: string, fine: string | null): string {
  const a = leggi(inizio);
  const b = fine ? leggi(fine) : null;
  if (!b || (a.anno === b.anno && a.mese === b.mese && a.giorno === b.giorno)) return `${a.giorno} ${MESI[a.mese - 1]} ${a.anno}`;
  if (a.anno === b.anno && a.mese === b.mese) return `${a.giorno}-${b.giorno} ${MESI[b.mese - 1]} ${b.anno}`;
  if (a.anno === b.anno) return `${a.giorno} ${MESI[a.mese - 1]} - ${b.giorno} ${MESI[b.mese - 1]} ${b.anno}`;
  return `${a.giorno} ${MESI[a.mese - 1]} ${a.anno} - ${b.giorno} ${MESI[b.mese - 1]} ${b.anno}`;
}
