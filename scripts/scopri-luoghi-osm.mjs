// Elenca da OpenStreetMap i luoghi storici, artistici e archeologici d'Italia (musei, siti archeologici, castelli, fortezze, rovine,
// monasteri, ville e palazzi storici, porte e mura) e scrive l'elenco in ricerca/luoghi-osm.json.
// Serve a riempire la mappa dei luoghi (/luoghi/mappa/) con i luoghi «minori», che Wikidata non ha o non ha con un sito ufficiale.
//
// Fonte: OpenStreetMap (© contributori di OpenStreetMap, licenza ODbL), via Overpass API. Si tengono solo elementi con un nome,
// non privati, non abbandonati. Per ogni luogo: id OSM, nome, classe, comune (codice ISTAT, il più vicino), coordinate, sito (se c'è),
// codice Wikidata (se c'è, serve a non duplicare). Mai telefoni, email o nomi di persone.
//
// Si lancia con:   node scripts/scopri-luoghi-osm.mjs
//   OVERPASS_FIXTURE=file.json   prova senza rete (risposta di Overpass salvata in un file, usata per ogni regione)
//   REGIONI=IT-62,IT-72          solo alcune regioni
//   FORZA=1                      rifà l'elenco anche se ha meno di 45 giorni
// Salva dopo ogni regione: se il lancio si interrompe si riparte dalle regioni mancanti.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'ricerca/luoghi-osm.json';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
const ENDPOINT = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const REGIONI_TUTTE = ['IT-65', 'IT-77', 'IT-78', 'IT-72', 'IT-45', 'IT-36', 'IT-62', 'IT-42', 'IT-25', 'IT-57', 'IT-67', 'IT-21', 'IT-88', 'IT-82', 'IT-52', 'IT-32', 'IT-55', 'IT-23', 'IT-34', 'IT-75'];
const REGIONI = (process.env.REGIONI ? process.env.REGIONI.split(',') : REGIONI_TUTTE).map((s) => s.trim());
const STORICI = 'archaeological_site|castle|fort|ruins|monastery|manor|city_gate|citywalls|aqueduct|tomb';
const CLASSE = {
  museum: 'Museo', archaeological_site: 'Area archeologica', ruins: 'Area archeologica', aqueduct: 'Area archeologica', tomb: 'Area archeologica',
  castle: 'Castello', fort: 'Castello', city_gate: 'Castello', citywalls: 'Castello', monastery: 'Chiesa e abbazia', manor: 'Palazzo e villa',
};
const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const oggi = new Date().toISOString().slice(0, 10);
const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const precedente = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : null;
if (precedente && precedente.completo !== false && !process.env.FORZA && !process.env.OVERPASS_FIXTURE && giorniDa(precedente.aggiornato) < 45) {
  console.log(`Elenco OSM dei luoghi aggiornato ${Math.floor(giorniDa(precedente.aggiornato))} giorni fa: salto.`); process.exit(0);
}
const regioniGia = new Set(precedente && precedente.completo === false ? precedente.regioniFatte ?? [] : []);

const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const griglia = new Map();
const cella = (lat, lon) => `${Math.floor(lat * 4)}:${Math.floor(lon * 4)}`;
for (const c of territorio.comuni) { const k = cella(c.lat, c.lon); griglia.set(k, [...(griglia.get(k) ?? []), c]); }
const distKm = (la1, lo1, la2, lo2) => { const r = Math.PI / 180, dx = (lo2 - lo1) * r * Math.cos(((la1 + la2) / 2) * r), dy = (la2 - la1) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };
function comuneVicino(lat, lon) {
  const gx = Math.floor(lat * 4), gy = Math.floor(lon * 4);
  let m = null, d = 15;
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) for (const c of griglia.get(`${gx + dx}:${gy + dy}`) ?? []) { const k = distKm(lat, lon, c.lat, c.lon); if (k < d) { d = k; m = c; } }
  return m;
}
function sito(tag) {
  let v = String(tag.website ?? tag['contact:website'] ?? '').trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = 'http://' + v;
  try { const u = new URL(v); if (/(facebook|instagram|tripadvisor|google|linktr|wa\.me|whatsapp|booking|youtube|wikipedia)\./i.test(u.host)) return null; return u.toString(); } catch { return null; }
}

async function interroga(regione) {
  const q = `[out:json][timeout:240];
area["ISO3166-2"="${regione}"]->.a;
(
  nwr(area.a)["tourism"="museum"]["name"];
  nwr(area.a)["historic"~"^(${STORICI})$"]["name"];
);
out center tags;`;
  if (process.env.OVERPASS_FIXTURE) return JSON.parse(readFileSync(process.env.OVERPASS_FIXTURE, 'utf8'));
  for (let t = 0; t < 4; t++) {
    const url = ENDPOINT[t % ENDPOINT.length];
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(q), signal: AbortSignal.timeout(300000) });
      if (r.ok) return await r.json();
      console.log(`  ${regione}: Overpass ${r.status}, riprovo`);
    } catch (e) { console.log(`  ${regione}: ${String(e.message ?? e).slice(0, 50)}, riprovo`); }
    await pausa(20000 * (t + 1));
  }
  return null;
}

const trovati = new Map();
if (precedente && precedente.completo === false) for (const l of precedente.luoghi ?? []) trovati.set(l.id, l);
const salva = (completo, fatte) => {
  const luoghi = [...trovati.values()].sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(FILE, `{"_nota":"Luoghi storici da OpenStreetMap (© contributori di OpenStreetMap, ODbL): generato da scripts/scopri-luoghi-osm.mjs, non modificare a mano.","aggiornato":"${oggi}","completo":${completo},"regioniFatte":${JSON.stringify(fatte)},"luoghi":[\n${luoghi.map((l) => JSON.stringify(l)).join(',\n')}\n]}\n`);
  return luoghi.length;
};
const fatte = [...regioniGia];
let incompleto = false;
for (const regione of REGIONI) {
  if (regioniGia.has(regione)) { console.log(`${regione}: già fatta`); continue; }
  const r = await interroga(regione);
  if (!r) { console.log(`${regione}: Overpass non risponde, si riprende al prossimo lancio.`); incompleto = true; continue; }
  let nuovi = 0;
  for (const el of r.elements ?? []) {
    const tag = el.tags ?? {};
    if (!tag.name || tag.access === 'private' || tag.access === 'no' || tag.disused || tag.abandoned || tag['disused:historic'] || tag.demolished) continue;
    const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const classe = tag.tourism === 'museum' ? 'Museo' : CLASSE[tag.historic];
    if (!classe) continue;
    const c = comuneVicino(lat, lon);
    if (!c) continue;
    const id = `osm:${el.type[0]}${el.id}`;
    if (trovati.has(id)) continue;
    const web = sito(tag);
    trovati.set(id, {
      id, nome: tag.name.trim().slice(0, 100), classe, comune: c.codiceIstat, lat: Number(lat.toFixed(5)), lon: Number(lon.toFixed(5)),
      ...(web ? { sito: web } : {}), ...(/^Q\d+$/.test(tag.wikidata ?? '') ? { wikidata: tag.wikidata } : {}),
    });
    nuovi++;
  }
  console.log(`${regione}: ${nuovi} luoghi`);
  fatte.push(regione);
  salva(false, fatte);
  if (!process.env.OVERPASS_FIXTURE) await pausa(8000);
}
const n = salva(!incompleto, fatte);
console.log(`Totale: ${n} luoghi da OpenStreetMap${incompleto ? ' (elenco incompleto: si continua al prossimo lancio)' : ''}.`);
