// Scoperta di profili Instagram da Wikidata (banca dati aperta, licenza CC0).
//
// Per molti Comuni, musei, teatri, siti archeologici, festival, biblioteche, parchi e castelli italiani
// Wikidata riporta il nome utente ufficiale di Instagram (proprietà P2003). Qui li raccogliamo e li
// mettiamo tra i «candidati» di ricerca/instagram-nuovi.json: il controllo di Instagram
// (scripts/controlla-instagram.mjs) poi li prova uno per uno e tiene solo quelli leggibili.
//
// Si lancia al massimo una volta ogni 7 giorni (lo decide il file di stato), dal workflow «Controlla Instagram».
// Dalla rete di sviluppo di Claude Wikidata non si raggiunge, da GitHub sì.
// Prova in locale: WIKIDATA_URL=http://localhost:PORTA/sparql node scripts/scopri-account.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const URL_SPARQL = process.env.WIKIDATA_URL || 'https://query.wikidata.org/sparql';
const FILE_ACCOUNT = 'ricerca/instagram-account.json';
const FILE_USCITA = 'ricerca/instagram-nuovi.json';
const GIORNI_TRA_LANCI = 7;
const UA = 'LiveLocalBot/1.0 (https://livelocal.roomandrelax.it; calendario eventi gratuito)';

// Tipi di luogo o ente. Q38 = Italia. «P31/P279*» include i sottotipi (es. museo d'arte → museo).
const TIPI = [
  { nome: 'comuni', query: () => '?item wdt:P31 wd:Q747074 ; wdt:P2003 ?ig .' },
  { nome: 'musei', q: 'Q33506' },
  { nome: 'teatri', q: 'Q24354' },
  { nome: 'siti archeologici', q: 'Q839954' },
  { nome: 'festival', q: 'Q132241' },
  { nome: 'biblioteche', q: 'Q7075' },
  { nome: 'parchi nazionali', q: 'Q46169' },
  { nome: 'castelli', q: 'Q23413' },
  { nome: 'cinema', q: 'Q41253' },
];

const uscita = existsSync(FILE_USCITA) ? JSON.parse(readFileSync(FILE_USCITA, 'utf8')) : {};
uscita.candidati ??= {};
uscita.account ??= {};
uscita.scartati ??= [];

const adesso = new Date();
if (uscita.ultimaScopertaWikidata && (adesso - new Date(uscita.ultimaScopertaWikidata)) / 86400000 < GIORNI_TRA_LANCI && !process.env.FORZA) {
  console.log('Wikidata: già interrogato negli ultimi 7 giorni, salto.');
  process.exit(0);
}

const elenco = JSON.parse(readFileSync(FILE_ACCOUNT, 'utf8'));
const conosciuti = new Set([
  ...elenco.account.map((n) => n.toLowerCase()),
  ...Object.keys(uscita.account),
  ...Object.keys(uscita.candidati),
  ...uscita.scartati,
]);

/** Dal valore di Wikidata (a volte un indirizzo o con la chiocciola) al solo nome utente. */
function pulisci(valore) {
  let v = String(valore).trim().toLowerCase();
  v = v.replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '').split(/[/?#]/)[0].replace(/\.+$/, '');
  return /^[a-z0-9._]{2,30}$/.test(v) ? v : null;
}

async function interroga(sparql) {
  const url = `${URL_SPARQL}?format=json&query=${encodeURIComponent(sparql)}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return (await r.json()).results.bindings.map((b) => b.ig?.value).filter(Boolean);
}

let nuovi = 0;
let riuscite = 0;
const dettaglio = [];
for (const tipo of TIPI) {
  const sparql = tipo.q
    ? `SELECT DISTINCT ?ig WHERE { ?item wdt:P31/wdt:P279* wd:${tipo.q} ; wdt:P17 wd:Q38 ; wdt:P2003 ?ig . }`
    : `SELECT DISTINCT ?ig WHERE { ${tipo.query()} }`;
  try {
    const valori = await interroga(sparql);
    riuscite++;
    let aggiunti = 0;
    for (const v of valori) {
      const nome = pulisci(v);
      if (!nome || conosciuti.has(nome)) continue;
      conosciuti.add(nome);
      uscita.candidati[nome] = { visto: adesso.toISOString().slice(0, 10), fonte: 'wikidata' };
      aggiunti++;
    }
    nuovi += aggiunti;
    dettaglio.push(`${tipo.nome}: ${valori.length} trovati, ${aggiunti} nuovi`);
  } catch (e) {
    dettaglio.push(`${tipo.nome}: errore (${e.message})`);
  }
  await new Promise((r) => setTimeout(r, 2000)); // gentili con Wikidata
}

if (riuscite > 0) uscita.ultimaScopertaWikidata = adesso.toISOString(); // se è fallito tutto, riprova al prossimo lancio
writeFileSync(FILE_USCITA, JSON.stringify(uscita, null, 2) + '\n');
console.log(`Wikidata: ${nuovi} candidati nuovi.`);
dettaglio.forEach((d) => console.log('  ' + d));
// Se ogni interrogazione è fallita non è un errore del lavoro: riprova al prossimo lancio.
