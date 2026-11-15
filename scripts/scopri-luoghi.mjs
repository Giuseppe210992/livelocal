// Elenca da Wikidata i luoghi storici e culturali d'Italia che hanno un sito ufficiale (musei, aree archeologiche, castelli, palazzi,
// cattedrali) e scrive l'elenco in ricerca/luoghi-elenco.json. Poi scripts/estrai-luoghi-ia.mjs ne legge i siti per orari e prezzi.
//
// Fonte: Wikidata (dati aperti CC0). Si tengono solo luoghi con sito ufficiale, in un comune italiano (codice ISTAT), non cessati.
// Per ogni luogo: id Wikidata, nome, classe, comune (ISTAT), coordinate se presenti, sito. Mai telefoni, email o nomi di persone.
//
// Si lancia con:   node scripts/scopri-luoghi.mjs
//   WIKIDATA_FIXTURE=file.json    prova senza rete (risposta di Wikidata salvata in un file)
//   FORZA=1                       rifà l'elenco anche se ha meno di 30 giorni
// Salva dopo ogni gruppo di risultati: se il lancio si interrompe si riparte da dove era arrivato.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'ricerca/luoghi-elenco.json';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
// Classi (istanza di): museo, museo d'arte, sito archeologico, castello, palazzo, cattedrale.
const CLASSI = { Q33506: 'Museo', Q207694: 'Museo', Q839954: 'Area archeologica', Q23413: 'Castello', Q16560: 'Palazzo', Q2977: 'Chiesa e cattedrale' };
const PAGINA = 1500;
const oggi = new Date().toISOString().slice(0, 10);
const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

const prec = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : null;
if (prec && prec.completo !== false && !process.env.FORZA && !process.env.WIKIDATA_FIXTURE && giorniDa(prec.aggiornato) < 30) {
  console.log(`Elenco dei luoghi aggiornato ${Math.floor(giorniDa(prec.aggiornato))} giorni fa: salto.`); process.exit(0);
}
const trovati = new Map();
if (prec) for (const l of prec.luoghi ?? []) trovati.set(l.id, l);
let offsetIniziale = prec && prec.completo === false ? prec.offset ?? 0 : 0;

const salva = (completo, offset) => {
  const luoghi = [...trovati.values()].sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(FILE, `{"_nota":"Luoghi storici e culturali da Wikidata (CC0), con sito ufficiale: generato da scripts/scopri-luoghi.mjs, non modificare a mano.","aggiornato":"${oggi}","completo":${completo},"offset":${offset},"luoghi":[\n${luoghi.map((l) => JSON.stringify(l)).join(',\n')}\n]}\n`);
  return luoghi.length;
};

async function interroga(offset) {
  if (process.env.WIKIDATA_FIXTURE) return offset === 0 ? JSON.parse(readFileSync(process.env.WIKIDATA_FIXTURE, 'utf8')) : { results: { bindings: [] } };
  const sparql = `SELECT ?item ?nome ?sito ?istat ?cls ?lat ?lon WHERE {
    VALUES ?cls { ${Object.keys(CLASSI).map((q) => 'wd:' + q).join(' ')} }
    ?item wdt:P31 ?cls .
    ?item wdt:P17 wd:Q38 .
    ?item wdt:P856 ?sito .
    ?item wdt:P131 ?c . ?c wdt:P635 ?istat .
    ?item rdfs:label ?nome . FILTER(lang(?nome) = "it")
    FILTER NOT EXISTS { ?item wdt:P576 ?fine }
    OPTIONAL { ?item p:P625/psv:P625 [ wikibase:geoLatitude ?lat ; wikibase:geoLongitude ?lon ] }
  } ORDER BY ?item LIMIT ${PAGINA} OFFSET ${offset}`;
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql), { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }, signal: AbortSignal.timeout(120000) });
      if (r.ok) return await r.json();
      console.log(`  Wikidata HTTP ${r.status}, riprovo`);
    } catch (e) { console.log(`  Wikidata: ${String(e.message ?? e).slice(0, 60)}, riprovo`); }
    await pausa(20000 * (t + 1));
  }
  return null;
}

let offset = offsetIniziale, finito = false, aggiunti = 0;
while (!finito) {
  const r = await interroga(offset);
  if (!r) { console.log('Wikidata non risponde: si riparte da qui al prossimo lancio.'); salva(false, offset); process.exit(0); }
  const righe = r.results.bindings;
  for (const b of righe) {
    const id = b.item.value.split('/').pop();
    let sito = String(b.sito?.value ?? '').trim();
    if (!/^https?:\/\//i.test(sito)) continue;
    try { const u = new URL(sito); if (/(facebook|instagram|twitter|x\.com|youtube|wikipedia|tripadvisor|linkedin)\./i.test(u.host)) continue; sito = u.toString(); } catch { continue; }
    const cls = CLASSI[String(b.cls?.value ?? '').split('/').pop()] ?? 'Luogo';
    const lat = Number(b.lat?.value), lon = Number(b.lon?.value);
    const l = { id, nome: String(b.nome.value).slice(0, 120), classe: cls, comune: String(b.istat.value).padStart(6, '0'), sito, ...(Number.isFinite(lat) && Number.isFinite(lon) ? { lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)) } : {}) };
    if (!trovati.has(id)) aggiunti++;
    trovati.set(id, { ...(trovati.get(id) ?? {}), ...l });
  }
  offset += righe.length;
  console.log(`  letti ${righe.length} risultati (da ${offset - righe.length}), in tutto ${trovati.size} luoghi`);
  finito = righe.length < PAGINA;
  salva(!finito ? false : true, offset);
  if (!finito) await pausa(5000);
}
console.log(`Elenco dei luoghi: ${trovati.size} (${aggiunti} nuovi), ${[...trovati.values()].filter((l) => l.lat).length} con coordinate.`);
