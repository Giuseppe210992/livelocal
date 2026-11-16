// Elenca da Wikidata i luoghi storici e culturali più noti dei paesi europei (esclusa l'Italia, che ha il suo elenco):
// musei, musei d'arte, siti archeologici, castelli e palazzi, con coordinate. Scrive ricerca/luoghi-europa.json.
//
// Fonte: Wikidata (dati aperti CC0). Si tengono i luoghi con coordinate, un nome in italiano o in inglese e almeno 2 pagine di
// Wikipedia in lingue diverse (un modo semplice e onesto per tenere solo i luoghi davvero noti e non riempire la mappa di voci minori).
// Per ogni luogo: codice Wikidata, nome, classe, paese (ISO), località (come scritta in Wikidata), coordinate, sito ufficiale se c'è.
// Mai telefoni, email o nomi di persone.
//
// Si lancia con:   node scripts/scopri-luoghi-europa.mjs
//   PAESI=FR,DE           solo alcuni paesi          FORZA=1   rifà l'elenco anche se ha meno di 45 giorni
//   BUDGET_MINUTI=40      tempo massimo di un lancio (poi si riprende al lancio successivo, da dove si era arrivati)
//   WIKIDATA_FIXTURE=f    prova senza rete: legge la risposta da un file (usata per la prima classe del primo paese)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'ricerca/luoghi-europa.json';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
// [ISO, codice Wikidata, nome inglese (controllo), nome italiano]
const PAESI = [
  ['FR', 'Q142', 'France', 'Francia'], ['DE', 'Q183', 'Germany', 'Germania'], ['ES', 'Q29', 'Spain', 'Spagna'], ['PT', 'Q45', 'Portugal', 'Portogallo'],
  ['GB', 'Q145', 'United Kingdom', 'Regno Unito'], ['IE', 'Q27', 'Ireland', 'Irlanda'], ['NL', 'Q55', 'Netherlands', 'Paesi Bassi'], ['BE', 'Q31', 'Belgium', 'Belgio'],
  ['LU', 'Q32', 'Luxembourg', 'Lussemburgo'], ['CH', 'Q39', 'Switzerland', 'Svizzera'], ['AT', 'Q40', 'Austria', 'Austria'], ['SI', 'Q215', 'Slovenia', 'Slovenia'],
  ['HR', 'Q224', 'Croatia', 'Croazia'], ['GR', 'Q41', 'Greece', 'Grecia'], ['MT', 'Q233', 'Malta', 'Malta'], ['CY', 'Q229', 'Cyprus', 'Cipro'],
  ['PL', 'Q36', 'Poland', 'Polonia'], ['CZ', 'Q213', 'Czech Republic', 'Cechia'], ['SK', 'Q214', 'Slovakia', 'Slovacchia'], ['HU', 'Q28', 'Hungary', 'Ungheria'],
  ['RO', 'Q218', 'Romania', 'Romania'], ['BG', 'Q219', 'Bulgaria', 'Bulgaria'], ['DK', 'Q35', 'Denmark', 'Danimarca'], ['SE', 'Q34', 'Sweden', 'Svezia'],
  ['NO', 'Q20', 'Norway', 'Norvegia'], ['FI', 'Q33', 'Finland', 'Finlandia'], ['IS', 'Q189', 'Iceland', 'Islanda'], ['EE', 'Q191', 'Estonia', 'Estonia'],
  ['LV', 'Q211', 'Latvia', 'Lettonia'], ['LT', 'Q37', 'Lithuania', 'Lituania'], ['RS', 'Q403', 'Serbia', 'Serbia'], ['BA', 'Q225', 'Bosnia and Herzegovina', 'Bosnia ed Erzegovina'],
  ['ME', 'Q236', 'Montenegro', 'Montenegro'], ['MK', 'Q221', 'North Macedonia', 'Macedonia del Nord'], ['AL', 'Q222', 'Albania', 'Albania'], ['MD', 'Q217', 'Moldova', 'Moldavia'],
  ['UA', 'Q212', 'Ukraine', 'Ucraina'], ['SM', 'Q238', 'San Marino', 'San Marino'], ['VA', 'Q237', 'Vatican City', 'Città del Vaticano'], ['LI', 'Q347', 'Liechtenstein', 'Liechtenstein'],
  ['MC', 'Q235', 'Monaco', 'Monaco'], ['AD', 'Q228', 'Andorra', 'Andorra'],
];
const CLASSI = { Q33506: 'Museo', Q207694: 'Museo', Q839954: 'Area archeologica', Q23413: 'Castello', Q16560: 'Palazzo e villa' };
const SOLO = process.env.PAESI ? new Set(process.env.PAESI.split(',').map((s) => s.trim().toUpperCase())) : null;
const BUDGET_MS = Number(process.env.BUDGET_MINUTI ?? 40) * 60000;
const INIZIO = Date.now();
const PAGINA_MAX = 300, PAGINA_MIN = 40;
const oggi = new Date().toISOString().slice(0, 10);
const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));

const prec = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : null;
if (prec && prec.completo !== false && !process.env.FORZA && !process.env.WIKIDATA_FIXTURE && giorniDa(prec.aggiornato) < 45) {
  console.log(`Elenco dei luoghi europei aggiornato ${Math.floor(giorniDa(prec.aggiornato))} giorni fa: salto.`); process.exit(0);
}
const trovati = new Map();
if (prec) for (const l of prec.luoghi ?? []) trovati.set(l.id, l);
const stato = prec && prec.completo === false ? { ...(prec.stato ?? {}) } : {};
const salva = (completo) => {
  const luoghi = [...trovati.values()].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
  writeFileSync(FILE, `{"_nota":"Luoghi storici d'Europa da Wikidata (CC0): generato da scripts/scopri-luoghi-europa.mjs, non modificare a mano.","aggiornato":"${oggi}","completo":${completo},"paesi":${JSON.stringify(Object.fromEntries(PAESI.map((p) => [p[0], p[3]])))},"stato":${JSON.stringify(stato)},"luoghi":[\n${luoghi.map((l) => JSON.stringify(l)).join(',\n')}\n]}\n`);
};

async function sparql(q) {
  const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(q), { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }, signal: AbortSignal.timeout(70000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
let fixtureUsata = false;
async function pagina(qid, classe, offset, quante) {
  if (process.env.WIKIDATA_FIXTURE) { if (fixtureUsata) return { results: { bindings: [] } }; fixtureUsata = true; return JSON.parse(readFileSync(process.env.WIKIDATA_FIXTURE, 'utf8')); }
  const q = `SELECT ?item ?nit ?nen ?lit ?len ?sito ?lat ?lon WHERE {
    ?item wdt:P31 wd:${classe} ; wdt:P17 wd:${qid} ; wikibase:sitelinks ?sl .
    FILTER(?sl >= 2)
    ?item p:P625/psv:P625 [ wikibase:geoLatitude ?lat ; wikibase:geoLongitude ?lon ] .
    OPTIONAL { ?item rdfs:label ?nit FILTER(lang(?nit) = "it") }
    OPTIONAL { ?item rdfs:label ?nen FILTER(lang(?nen) = "en") }
    FILTER(BOUND(?nit) || BOUND(?nen))
    FILTER NOT EXISTS { ?item wdt:P576 ?fine }
    OPTIONAL { ?item wdt:P856 ?sito }
    OPTIONAL { ?item wdt:P131 ?loc . OPTIONAL { ?loc rdfs:label ?lit FILTER(lang(?lit) = "it") } OPTIONAL { ?loc rdfs:label ?len FILTER(lang(?len) = "en") } }
  } ORDER BY ?item LIMIT ${quante} OFFSET ${offset}`;
  return sparql(q);
}
async function nomeInglese(qid) {
  if (process.env.WIKIDATA_FIXTURE) return null;
  try { return (await sparql(`SELECT ?l WHERE { wd:${qid} rdfs:label ?l FILTER(lang(?l) = "en") }`)).results.bindings[0]?.l?.value ?? null; } catch { return null; }
}

let tempoFinito = false, incompleto = false, aggiunti = 0;
const sitoOk = (v) => { let s = String(v ?? '').trim(); if (!/^https?:\/\//i.test(s)) return null; try { const u = new URL(s); return /(facebook|instagram|twitter|x\.com|youtube|wikipedia|tripadvisor|linkedin)\./i.test(u.host) ? null : u.toString(); } catch { return null; } };
for (const [iso, qid, ingl, ita] of PAESI) {
  if (SOLO && !SOLO.has(iso)) continue;
  if (Object.keys(CLASSI).every((c) => stato[`${iso}:${c}`] === -1)) continue;
  // controllo di sicurezza: il codice Wikidata deve essere davvero quel paese
  if (!process.env.WIKIDATA_FIXTURE) { const n = await nomeInglese(qid); if (n && n.toLowerCase() !== ingl.toLowerCase() && !n.toLowerCase().includes(ingl.toLowerCase())) { console.log(`${iso}: il codice ${qid} è «${n}», non «${ingl}»: salto.`); continue; } }
  for (const classe of Object.keys(CLASSI)) {
    const chiave = `${iso}:${classe}`;
    if (stato[chiave] === -1) continue;
    let offset = stato[chiave] ?? 0, quante = PAGINA_MAX;
    while (true) {
      if (Date.now() - INIZIO > BUDGET_MS) { tempoFinito = true; break; }
      let r = null;
      try { r = await pagina(qid, classe, offset, quante); } catch (e) { console.log(`  ${iso} ${classe}: ${String(e.message ?? e).slice(0, 50)} (${quante} per volta)`); }
      if (!r) { if (quante > PAGINA_MIN) { quante = Math.max(PAGINA_MIN, Math.floor(quante / 2)); await pausa(6000); continue; } incompleto = true; break; }
      const righe = r.results.bindings;
      const visti = new Set();
      for (const b of righe) {
        const id = b.item.value.split('/').pop();
        if (visti.has(id)) continue; visti.add(id);
        const nome = String(b.nit?.value ?? b.nen?.value ?? '').trim();
        const lat = Number(b.lat?.value), lon = Number(b.lon?.value);
        if (!nome || nome.length < 3 || !Number.isFinite(lat) || !Number.isFinite(lon) || /^Q\d+$/.test(nome)) continue;
        const loc = String(b.lit?.value ?? b.len?.value ?? '').trim();
        const web = sitoOk(b.sito?.value);
        if (!trovati.has(id)) aggiunti++;
        trovati.set(id, { id, nome: nome.slice(0, 110), classe: CLASSI[classe], paese: iso, ...(loc && !/^Q\d+$/.test(loc) ? { localita: loc.slice(0, 60) } : {}), lat: Number(lat.toFixed(5)), lon: Number(lon.toFixed(5)), ...(web ? { sito: web } : {}) });
      }
      // la pagina ha tolto i doppioni di riga (più P131 per lo stesso luogo): si avanza del numero di righe lette
      offset += righe.length;
      const finita = righe.length < quante;
      stato[chiave] = finita ? -1 : offset;
      salva(false);
      if (finita) break;
      await pausa(2500);
    }
    if (tempoFinito || incompleto) break;
  }
  console.log(`${iso} (${ita}): ${[...trovati.values()].filter((l) => l.paese === iso).length} luoghi finora`);
  if (tempoFinito) break;
  incompleto = false;
}
const finito = !tempoFinito && PAESI.filter((p) => !SOLO || SOLO.has(p[0])).every((p) => Object.keys(CLASSI).every((c) => stato[`${p[0]}:${c}`] === -1));
salva(finito || Boolean(SOLO && !tempoFinito && !incompleto));
console.log(`Luoghi europei: ${trovati.size} (${aggiunti} nuovi).${tempoFinito ? ' Tempo finito: si riprende al prossimo lancio.' : ''}${!finito && !tempoFinito ? ' Elenco incompleto: si continua al prossimo lancio.' : ''}`);
