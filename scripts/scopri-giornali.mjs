// Scopre i giornali italiani (anche online e locali) e, per ciascuno, la pagina con l'agenda degli eventi.
// Scrive l'elenco in ricerca/giornali.json; poi scripts/estrai-eventi-ia.mjs riapre ogni agenda trovata insieme alle altre fonti fisse.
//
// Fonte dell'elenco: Wikidata (dati aperti CC0): testate con sito ufficiale, Italia, non cessate. Non sono tutte le testate d'Italia
// (Wikidata non conosce i giornali più piccoli): le altre si aggiungono a mano in ricerca/fonti-automatiche.json con "tipo": "stampa".
// Per ogni sito si apre solo la pagina iniziale e si cerca un link «Eventi / Agenda / Manifestazioni». Se non c'è, il giornale si
// segna «senza agenda» e si riprova dopo 30 giorni: la cronaca non serve (gli eventi si leggono solo da agende e calendari).
//
// Si lancia con:   node scripts/scopri-giornali.mjs
//   WIKIDATA_FIXTURE=file.json    (prova senza rete: legge la risposta di Wikidata da un file)
//   MAX_GIORNALI=300              quanti siti controllare in un lancio (default 300)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'ricerca/giornali.json';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
const MAX = Number(process.env.MAX_GIORNALI || 300);
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const oggi = new Date().toISOString().slice(0, 10);
const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;

const prec = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { elencoDel: null, giornali: [] };
const perSito = new Map(prec.giornali.map((g) => [g.sito, g]));

// ---- 1) Elenco delle testate da Wikidata (si rifà al massimo ogni 30 giorni) ----
async function elencoWikidata() {
  if (process.env.WIKIDATA_FIXTURE) return JSON.parse(readFileSync(process.env.WIKIDATA_FIXTURE, 'utf8'));
  const sparql = `SELECT ?item ?nome ?sito WHERE {
    ?item wdt:P31/wdt:P279* wd:Q11032 .
    { ?item wdt:P495 wd:Q38 } UNION { ?item wdt:P17 wd:Q38 }
    ?item wdt:P856 ?sito .
    FILTER NOT EXISTS { ?item wdt:P576 ?fine }
    OPTIONAL { ?item rdfs:label ?nome FILTER(lang(?nome) = "it") }
  }`;
  const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql), { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }, signal: AbortSignal.timeout(120000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
if (!prec.elencoDel || giorniDa(prec.elencoDel) >= 30 || process.env.WIKIDATA_FIXTURE) {
  try {
    const dati = await elencoWikidata();
    let nuovi = 0;
    for (const b of dati.results.bindings) {
      let sito = String(b.sito?.value ?? '').trim();
      if (!/^https?:\/\//i.test(sito)) continue;
      try { const u = new URL(sito); if (/(facebook|instagram|twitter|x\.com|youtube|wikipedia|linkedin)\./i.test(u.host)) continue; sito = u.origin + '/'; } catch { continue; }
      if (perSito.has(sito)) continue;
      const g = { nome: String(b.nome?.value ?? new URL(sito).hostname.replace(/^www\./, '')).slice(0, 80), sito };
      prec.giornali.push(g); perSito.set(sito, g); nuovi++;
    }
    prec.elencoDel = oggi;
    console.log(`Elenco da Wikidata: ${nuovi} testate nuove, ${prec.giornali.length} in tutto.`);
  } catch (e) {
    console.log(`Wikidata non raggiungibile (${String(e.message ?? e).slice(0, 60)}): si lavora sull'elenco già salvato.`);
  }
}

// ---- 2) Per ogni sito, la pagina «Eventi / Agenda» ----
const decodifica = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const soloTesto = (h) => decodifica(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
function trovaAgenda(html, base) {
  const trovati = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u;
    try { u = new URL(decodifica(m[1]), base); } catch { continue; }
    if (u.host.replace(/^www\./, '') !== new URL(base).host.replace(/^www\./, '') || !/^https?:$/.test(u.protocol)) continue;
    if (/\.(pdf|jpe?g|png|gif|zip|docx?)$/i.test(u.pathname)) continue;
    const testo = soloTesto(m[2]).toLowerCase().slice(0, 60);
    const percorso = (u.pathname + u.search).toLowerCase();
    let punti = 0;
    if (/^(eventi|agenda|agenda eventi|calendario eventi|tutti gli eventi|eventi e manifestazioni|manifestazioni|eventi in programma|cosa fare|events)$/.test(testo)) punti += 5;
    else if (/\b(eventi|agenda|manifestazioni|appuntamenti)\b/.test(testo)) punti += 3;
    if (/\/(eventi|events|agenda|manifestazioni|appuntamenti|cosa-fare)\/?$/.test(u.pathname.toLowerCase())) punti += 4;
    else if (/(eventi|events|agenda|manifestazioni)/.test(percorso)) punti += 1;
    if (/news|notizie|cronaca|politica|sport|necrolog|annunci|lavoro|tag\/|category\/|author|privacy|cookie|pubblicit/.test(percorso)) punti -= 3;
    if (punti >= 3) trovati.push({ url: u.toString(), punti });
  }
  trovati.sort((a, b) => b.punti - a.punti || a.url.length - b.url.length);
  return trovati[0]?.url ?? null;
}
async function scarica(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'it' }, signal: AbortSignal.timeout(20000), redirect: 'follow' });
    if (!r.ok || !/html|text/i.test(r.headers.get('content-type') ?? '')) return null;
    return { html: (await r.text()).slice(0, 1_500_000), url: r.url };
  } catch { return null; }
}
// Si controllano prima i siti mai visti; poi quelli senza agenda dopo 30 giorni; le agende trovate si riverificano dopo 90.
const dovuto = (g) => !g.controllato || giorniDa(g.controllato) >= (g.agenda ? 90 : 30);
const coda = prec.giornali.filter(dovuto).sort((a, b) => String(a.controllato ?? '').localeCompare(String(b.controllato ?? ''))).slice(0, MAX);
console.log(`Siti da controllare in questo lancio: ${coda.length} (su ${prec.giornali.length}).`);
let i = 0, trovate = 0;
const salva = () => writeFileSync(FILE, `{"_nota":"Giornali italiani da Wikidata (CC0) e la loro pagina eventi: generato da scripts/scopri-giornali.mjs, non modificare a mano.","elencoDel":${JSON.stringify(prec.elencoDel)},"giornali":[\n${prec.giornali.map((g) => JSON.stringify(g)).join(',\n')}\n]}\n`);
async function lavora() {
  while (i < coda.length) {
    const g = coda[i++];
    const s = await scarica(g.sito);
    g.controllato = oggi;
    if (!s) { g.agenda = null; g.esito = 'sito-non-letto'; continue; }
    const agenda = trovaAgenda(s.html, s.url);
    g.agenda = agenda; g.esito = agenda ? 'agenda' : 'senza-agenda';
    if (agenda) trovate++;
    if (i % 50 === 0) salva();
    await pausa(300);
  }
}
await Promise.all(Array.from({ length: 6 }, lavora));
salva();
const conAgenda = prec.giornali.filter((g) => g.agenda).length;
console.log(`Agende trovate in questo lancio: ${trovate}. In totale: ${conAgenda} giornali con agenda su ${prec.giornali.length}.`);
