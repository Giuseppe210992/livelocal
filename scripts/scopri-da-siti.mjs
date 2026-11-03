// Scoperta dei profili Instagram dai siti ufficiali dei Comuni.
//
// Quasi ogni sito di un Comune ha nel piè di pagina i link ai suoi profili social. Qui proviamo, per ogni
// Comune italiano (src/data/territorio.json), gli indirizzi tipici dei siti comunali
//   comune.<nome>.<sigla provincia>.it   e   comune.<nome>.it
// leggiamo la pagina iniziale e raccogliamo i link a instagram.com. I nomi trovati diventano «candidati»
// di ricerca/instagram-nuovi.json: il controllo di Instagram li prova e tiene solo quelli che sembrano un ente.
//
// Lavora a pezzi: ogni lancio guarda un gruppo di Comuni (cursore nel file di stato) e quando ha finito
// ricomincia dopo 30 giorni. Una sola richiesta per sito, con pause, e un nome chiaro (User-Agent).
// Prova in locale: SITI_URL='http://localhost:PORTA/{slug}' node scripts/scopri-da-siti.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE_ACCOUNT = 'ricerca/instagram-account.json';
const FILE_USCITA = 'ricerca/instagram-nuovi.json';
const PER_LANCIO = Number(process.env.SITI_PER_LANCIO || 700);
const PARALLELE = Number(process.env.SITI_PARALLELE || 8);
const TIMEOUT_MS = 8000;
const GIORNI_TRA_GIRI_COMPLETI = 30;
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
// Indirizzi di Instagram che non sono profili
const RISERVATI = new Set(['p', 'reel', 'reels', 'explore', 'accounts', 'tv', 'stories', 'share', 'about', 'legal', 'developer', 'direct', 'web', 'oauth', 'instagram', 'privacy', 'tags', 'embed', 'static', 'directory', 'press', 'help', 'sharer', 'login', 'challenge']);

const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const sigle = new Map(territorio.province.map((p) => [p.codiceIstat, p.sigla.toLowerCase()]));
const comuni = territorio.comuni;

const uscita = existsSync(FILE_USCITA) ? JSON.parse(readFileSync(FILE_USCITA, 'utf8')) : {};
uscita.candidati ??= {};
uscita.account ??= {};
uscita.scartati ??= [];
uscita.siti ??= { cursore: 0, completatoIl: null, provati: 0, risposto: 0, conInstagram: 0 };
const s = uscita.siti;

const adesso = new Date();
if (s.cursore >= comuni.length) {
  if (s.completatoIl && (adesso - new Date(s.completatoIl)) / 86400000 < GIORNI_TRA_GIRI_COMPLETI && !process.env.FORZA) {
    console.log('Siti dei Comuni: giro completo fatto da meno di 30 giorni, salto.');
    process.exit(0);
  }
  s.cursore = 0; // nuovo giro
  s.provati = s.risposto = s.conInstagram = 0;
}

const elenco = JSON.parse(readFileSync(FILE_ACCOUNT, 'utf8'));
const conosciuti = new Set([
  ...elenco.account.map((n) => n.toLowerCase()),
  ...Object.keys(uscita.account),
  ...Object.keys(uscita.candidati),
  ...uscita.scartati,
]);

/** Estrae i nomi utente di Instagram da una pagina. */
function estraiProfili(html) {
  const trovati = [];
  for (const m of html.matchAll(/instagram\.com\/(?:_u\/)?@?([a-z0-9._]{2,30})/gi)) {
    const nome = m[1].toLowerCase().replace(/\.+$/, '');
    if (RISERVATI.has(nome) || /\.(php|js|css|html?)$/.test(nome) || trovati.includes(nome)) continue;
    trovati.push(nome);
  }
  return trovati.slice(0, 4); // pochi per sito: i primi sono di solito quelli del Comune
}

async function leggiPagina(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!r.ok) return null;
    const tipo = r.headers.get('content-type') || '';
    if (!tipo.includes('text/html')) return null;
    return (await r.text()).slice(0, 1_500_000);
  } catch {
    return null;
  }
}

function indirizzi(c) {
  const modello = process.env.SITI_URL;
  if (modello) return [modello.replace('{slug}', c.slug)];
  const sigla = sigle.get(c.provincia);
  return [`https://www.comune.${c.slug}.${sigla}.it/`, `https://www.comune.${c.slug}.it/`];
}

const gruppo = comuni.slice(s.cursore, s.cursore + PER_LANCIO);
let prossimo = 0;
const novita = { provati: 0, risposto: 0, conInstagram: 0, nuovi: 0 };

async function lavora() {
  while (prossimo < gruppo.length) {
    const c = gruppo[prossimo++];
    novita.provati++;
    let html = null;
    for (const u of indirizzi(c)) {
      html = await leggiPagina(u);
      if (html) break;
    }
    if (!html) continue;
    novita.risposto++;
    const profili = estraiProfili(html);
    if (profili.length) novita.conInstagram++;
    for (const nome of profili) {
      if (conosciuti.has(nome)) continue;
      conosciuti.add(nome);
      uscita.candidati[nome] = { visto: adesso.toISOString().slice(0, 10), fonte: 'sito-comune', comune: c.codiceIstat };
      novita.nuovi++;
    }
    await new Promise((r) => setTimeout(r, 150));
  }
}
await Promise.all(Array.from({ length: PARALLELE }, lavora));

s.cursore += gruppo.length;
s.provati += novita.provati;
s.risposto += novita.risposto;
s.conInstagram += novita.conInstagram;
if (s.cursore >= comuni.length) s.completatoIl = adesso.toISOString();
writeFileSync(FILE_USCITA, JSON.stringify(uscita, null, 2) + '\n');
console.log(
  `Siti dei Comuni: ${novita.provati} provati, ${novita.risposto} con una pagina, ${novita.conInstagram} con Instagram, ${novita.nuovi} candidati nuovi. ` +
    `Avanzamento: ${s.cursore} di ${comuni.length}.`,
);
