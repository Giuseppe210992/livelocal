// Avvisa i motori di ricerca (Bing, Yandex e altri che usano IndexNow) quando una pagina evento è nuova o cambiata.
// Così le pagine di LiveLocal entrano nell'indice in ore invece che in settimane: è da lì che pescano anche
// le ricerche delle IA (per esempio ChatGPT usa l'indice di Bing). Google non usa IndexNow: per lui c'è la sitemap.
//
// Si lancia dal workflow «Pubblica il sito», dopo la pubblicazione.
//  - dopo un «push»: invia solo gli eventi nuovi o modificati rispetto al commit precedente (BASE_SHA);
//  - nel giro orario programmato: invia solo gli eventi nuovi o cambiati nell'ultima ora e un quarto;
//  - con «Run workflow» a mano (nessun BASE_SHA): invia TUTTE le pagine evento pubblicate, una tantum.
// Il file con la chiave è in public/<chiave>.txt: è pubblico per costruzione, non è un segreto.
// Prova senza inviare niente:  INDEXNOW_PROVA=1 node scripts/indexnow.mjs

import { readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const SITO = (process.env.SITE_URL || 'https://livelocal.roomandrelax.it').replace(/\/$/, '');
const HOST = new URL(SITO).host;
const CHIAVE = readdirSync('public').map((f) => f.match(/^([0-9a-f]{32})\.txt$/)?.[1]).find(Boolean);
if (!CHIAVE) {
  console.log('IndexNow: nessun file chiave in public/, salto.');
  process.exit(0);
}

const leggi = (testo) => JSON.parse(testo).filter((e) => e.stato === 'pubblicato' || e.stato === 'annullato' || e.stato === 'rinviato');
const adesso = leggi(readFileSync('src/data/eventi.json', 'utf8'));
const percorso = (e) => `/evento/${e.inizio.slice(0, 4)}/${e.slug}/`;

let daInviare;
let base = process.env.BASE_SHA;
// Giro orario programmato: GitHub non dà il commit precedente, e senza questo ogni ora si rimandavano TUTTE le pagine.
// Si prende invece l'ultimo commit di più di 75 minuti fa: si inviano solo gli eventi nuovi o cambiati nell'ultima ora e un quarto.
if ((!base || /^0+$/.test(base)) && process.env.GITHUB_EVENT_NAME === 'schedule') {
  try { base = execFileSync('git', ['rev-list', '-n1', '--before=75 minutes ago', 'HEAD'], { encoding: 'utf8' }).trim(); } catch { /* si ricade sul comportamento di prima */ }
}
if (base && !/^0+$/.test(base)) {
  let prima = [];
  try {
    prima = leggi(execFileSync('git', ['show', `${base}:src/data/eventi.json`], { encoding: 'utf8' }));
  } catch {
    console.log('IndexNow: commit precedente non leggibile, invio tutto.');
  }
  const vecchi = new Map(prima.map((e) => [e.slug, JSON.stringify(e)]));
  daInviare = adesso.filter((e) => vecchi.get(e.slug) !== JSON.stringify(e));
} else {
  daInviare = adesso; // lancio a mano: tutto, una volta
}

const url = daInviare.map((e) => SITO + percorso(e));
if (url.length) url.push(SITO + '/'); // la home elenca i prossimi eventi
console.log(`IndexNow: ${url.length} indirizzi da inviare (${daInviare.length} eventi nuovi o cambiati).`);
if (!url.length || process.env.INDEXNOW_PROVA) {
  if (process.env.INDEXNOW_PROVA) console.log(url.slice(0, 3).join('\n') + (url.length > 3 ? '\n…' : ''));
  process.exit(0);
}

for (let i = 0; i < url.length; i += 5000) {
  const gruppo = url.slice(i, i + 5000);
  const r = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it)' },
    body: JSON.stringify({ host: HOST, key: CHIAVE, keyLocation: `${SITO}/${CHIAVE}.txt`, urlList: gruppo }),
  });
  console.log(`IndexNow: risposta ${r.status} per ${gruppo.length} indirizzi (200 e 202 = accettato).`);
}
