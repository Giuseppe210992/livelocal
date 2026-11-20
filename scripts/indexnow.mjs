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
// Gli eventi già conclusi non si inviano: restano online come archivio ma non servono a nessuno nell'indice.
const OGGI = new Date().toISOString().slice(0, 10);
// Fase di indicizzazione (src/data/indicizzazione.json): si avvisa solo per ciò che le pagine lasciano indicizzare.
const FASE = JSON.parse(readFileSync('src/data/indicizzazione.json', 'utf8')).fase;
const GIORNI = FASE >= 3 ? 21 : FASE === 2 ? 7 : 0;
const LIMITE = new Date(Date.now() + GIORNI * 86400000).toISOString().slice(0, 10);
const inCorso = (e) => GIORNI > 0 && (e.fine || e.inizio).slice(0, 10) >= OGGI && e.inizio.slice(0, 10) <= LIMITE;
const adesso = leggi(readFileSync('src/data/eventi.json', 'utf8')).filter(inCorso);
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
    prima = leggi(execFileSync('git', ['show', `${base}:src/data/eventi.json`], { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 })); // il file supera 1 MB: senza maxBuffer la lettura falliva e si rimandava tutto
  } catch {
    console.log('IndexNow: commit precedente non leggibile, invio tutto.');
  }
  const vecchi = new Map(prima.map((e) => [e.slug, JSON.stringify(e)]));
  daInviare = adesso.filter((e) => vecchi.get(e.slug) !== JSON.stringify(e));
} else {
  daInviare = adesso; // lancio a mano: tutto, una volta
}

// Pagine fisse che cambiano quando cambiano gli eventi o i luoghi, e mappe del sito.
const PILASTRI = FASE >= 3 ? ['/', '/oggi/', '/domani/', '/weekend/', '/mappa/', '/luoghi/', '/luoghi/mappa/', '/luoghi/europa/'] : ['/', '/oggi/', '/domani/', '/weekend/', '/luoghi/'];
const MAPPE = FASE >= 3 ? ['/sitemap.xml', '/sitemap-principali.xml', '/sitemap-territorio.xml', '/sitemap-eventi.xml', '/sitemap-luoghi.xml'] : FASE === 2 ? ['/sitemap.xml', '/sitemap-principali.xml', '/sitemap-eventi.xml'] : ['/sitemap.xml', '/sitemap-principali.xml'];
// Luoghi da visitare nuovi o cambiati (stesso confronto degli eventi).
const slugLuoghi = (testo) => new Map((JSON.parse(testo).luoghi ?? []).map((l) => [l.slug, JSON.stringify(l)]));
let luoghiCambiati = [];
{
  const ora = slugLuoghi(readFileSync('src/data/luoghi-da-visitare.json', 'utf8'));
  let prima = new Map();
  if (base && !/^0+$/.test(base)) { try { prima = slugLuoghi(execFileSync('git', ['show', `${base}:src/data/luoghi-da-visitare.json`], { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 })); } catch { /* file nuovo o commit non leggibile */ } }
  if (FASE >= 3) luoghiCambiati = [...ora].filter(([slug, json]) => prima.get(slug) !== json).map(([slug]) => `/luoghi/${slug}/`);
}
// Modifiche al codice o ai testi del sito (non solo ai dati): si avvisa anche per le pagine fisse e le mappe.
let sitoCambiato = false;
if (base && !/^0+$/.test(base)) {
  try { sitoCambiato = execFileSync('git', ['diff', '--name-only', base, 'HEAD'], { encoding: 'utf8' }).split('\n').some((f) => /^src\/(pages|layouts|components|lib|scripts|styles)\//.test(f)); } catch { /* si ignora */ }
}
const url = daInviare.map((e) => SITO + percorso(e));
url.push(...luoghiCambiati.map((p) => SITO + p));
if (url.length || sitoCambiato || !base || /^0+$/.test(base)) { url.push(...PILASTRI.map((p) => SITO + p)); }
if (sitoCambiato || !base || /^0+$/.test(base)) url.push(...MAPPE.map((p) => SITO + p));
const unici = [...new Set(url)];
url.length = 0; url.push(...unici);
console.log(`IndexNow: ${url.length} indirizzi da inviare (${daInviare.length} eventi e ${luoghiCambiati.length} luoghi nuovi o cambiati${sitoCambiato ? ', sito modificato' : ''}).`);
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
