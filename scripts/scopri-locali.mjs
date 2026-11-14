// Scopre pub, bar, club e locali con musica dal vivo in tutta Italia e scrive l'elenco in ricerca/locali.json.
//
// Fonte: OpenStreetMap (© contributori di OpenStreetMap, licenza ODbL), via Overpass API. Si tengono solo i locali
// che hanno un profilo Instagram o un sito indicato in OpenStreetMap: sono dati che i gestori stessi hanno reso pubblici.
// Per ogni locale si salvano: nome, tipo, comune (codice ISTAT), indirizzo, coordinate, profilo Instagram, sito.
// Mai telefoni, email o nomi di persone.
//
// Si lancia con:   node scripts/scopri-locali.mjs
//   OVERPASS_FIXTURE=file.json node scripts/scopri-locali.mjs   (prova senza rete: legge la risposta da un file)
//   REGIONI=IT-62,IT-72 node scripts/scopri-locali.mjs           (solo alcune regioni)
// Il file si aggiorna al massimo una volta ogni 30 giorni (salvo FORZA=1), perché OpenStreetMap cambia piano piano.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const FILE = 'ricerca/locali.json';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it; calendario eventi gratuito)';
const ENDPOINT = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
// Codici ISO 3166-2 delle 20 regioni
const REGIONI_TUTTE = ['IT-65', 'IT-77', 'IT-78', 'IT-72', 'IT-45', 'IT-36', 'IT-62', 'IT-42', 'IT-25', 'IT-57', 'IT-67', 'IT-21', 'IT-88', 'IT-82', 'IT-52', 'IT-32', 'IT-55', 'IT-23', 'IT-34', 'IT-75'];
const REGIONI = (process.env.REGIONI ? process.env.REGIONI.split(',') : REGIONI_TUTTE).map((s) => s.trim());
const TIPI = 'pub|nightclub|music_venue|biergarten';

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// Il file può essere incompleto se un lancio precedente si è interrotto: allora si riparte dalle regioni mancanti.
const precedente = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : null;
if (precedente && precedente.completo !== false && !process.env.FORZA && !process.env.OVERPASS_FIXTURE) {
  const eta = (Date.now() - new Date(precedente.aggiornato ?? '2000-01-01').getTime()) / 86400000;
  if (eta < 30) { console.log(`Elenco dei locali aggiornato ${Math.floor(eta)} giorni fa: salto.`); process.exit(0); }
}
const regioniGia = new Set(precedente && precedente.completo === false ? precedente.regioniFatte ?? [] : []);

const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const comuni = territorio.comuni;
// Indice per nome e per griglia di 0,25 gradi, per trovare in fretta il comune più vicino a un punto
const perNome = new Map();
for (const c of comuni) { const k = norm(c.nome); perNome.set(k, [...(perNome.get(k) ?? []), c]); }
const griglia = new Map();
const cella = (lat, lon) => `${Math.floor(lat * 4)}:${Math.floor(lon * 4)}`;
for (const c of comuni) { const k = cella(c.lat, c.lon); griglia.set(k, [...(griglia.get(k) ?? []), c]); }
const distKm = (la1, lo1, la2, lo2) => { const r = Math.PI / 180, dx = (lo2 - lo1) * r * Math.cos(((la1 + la2) / 2) * r), dy = (la2 - la1) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };

function trovaComune(tag, lat, lon) {
  const citta = tag['addr:city'] ?? tag['addr:municipality'];
  // il comune vicino al punto con lo stesso nome dell'indirizzo (evita i casi di nomi uguali in zone diverse d'Italia)
  const vicini = [];
  const gx = Math.floor(lat * 4), gy = Math.floor(lon * 4);
  for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) for (const c of griglia.get(`${gx + dx}:${gy + dy}`) ?? []) vicini.push({ c, d: distKm(lat, lon, c.lat, c.lon) });
  vicini.sort((a, b) => a.d - b.d);
  if (citta) { const k = norm(citta); const m = vicini.find((v) => norm(v.c.nome) === k && v.d < 25); if (m) return m.c; }
  return vicini.length && vicini[0].d < 12 ? vicini[0].c : null; // altrimenti il punto è troppo lontano da qualsiasi centro: scartato
}

function handleInstagram(tag) {
  const v = String(tag['contact:instagram'] ?? tag.instagram ?? '').trim();
  if (!v) return null;
  const m = v.match(/instagram\.com\/([A-Za-z0-9._]{1,30})/i) ?? v.match(/^@?([A-Za-z0-9._]{1,30})$/);
  const h = m?.[1]?.toLowerCase().replace(/\.+$/, '');
  return h && !['p', 'reel', 'reels', 'explore', 'accounts', 'tv', 'stories', 'share', 'about', 'legal'].includes(h) ? h : null;
}
function sito(tag) {
  let v = String(tag.website ?? tag['contact:website'] ?? '').trim();
  if (!v) return null;
  if (!/^https?:\/\//i.test(v)) v = 'http://' + v;
  try { const u = new URL(v); if (/(facebook|instagram|tripadvisor|google|linktr|wa\.me|whatsapp|booking|thefork|yelp)\./i.test(u.host)) return null; return u.toString(); } catch { return null; }
}

async function interroga(regione) {
  const q = `[out:json][timeout:240];
area["ISO3166-2"="${regione}"]->.a;
(
  nwr(area.a)["amenity"~"^(${TIPI})$"]["website"];
  nwr(area.a)["amenity"~"^(${TIPI})$"]["contact:website"];
  nwr(area.a)["amenity"~"^(${TIPI}|bar)$"]["contact:instagram"];
  nwr(area.a)["amenity"~"^(${TIPI}|bar)$"]["instagram"];
  nwr(area.a)["amenity"~"^(pub|bar|cafe)$"]["live_music"="yes"];
);
out center tags;`;
  if (process.env.OVERPASS_FIXTURE) return JSON.parse(readFileSync(process.env.OVERPASS_FIXTURE, 'utf8'));
  for (let tentativo = 0; tentativo < 4; tentativo++) {
    const url = ENDPOINT[tentativo % ENDPOINT.length];
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'data=' + encodeURIComponent(q), signal: AbortSignal.timeout(300000) });
      if (r.ok) return await r.json();
      console.log(`  ${regione}: Overpass ${r.status}, riprovo`);
    } catch (e) { console.log(`  ${regione}: ${String(e.message ?? e).slice(0, 50)}, riprovo`); }
    await pausa(20000 * (tentativo + 1));
  }
  return { elements: [] };
}

const trovati = new Map();
if (precedente && precedente.completo === false) for (const l of precedente.locali ?? []) trovati.set(l.id, l);
const salva = (completo, fatte) => {
  const locali = [...trovati.values()].sort((a, b) => a.id.localeCompare(b.id));
  writeFileSync(FILE, `{"_nota":"Locali da OpenStreetMap (© contributori di OpenStreetMap, ODbL): generato da scripts/scopri-locali.mjs, non modificare a mano.","aggiornato":"${new Date().toISOString().slice(0, 10)}","completo":${completo},"regioniFatte":${JSON.stringify(fatte)},"locali":[\n${locali.map((l) => JSON.stringify(l)).join(',\n')}\n]}\n`);
  return locali;
};
const fatte = [...regioniGia];
for (const regione of REGIONI) {
  if (regioniGia.has(regione)) { console.log(`${regione}: già fatta`); continue; }
  const r = await interroga(regione);
  let nuovi = 0;
  for (const el of r.elements ?? []) {
    const tag = el.tags ?? {};
    if (!tag.name || tag.access === 'private' || tag.access === 'no') continue;
    const lat = el.lat ?? el.center?.lat, lon = el.lon ?? el.center?.lon;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    const ig = handleInstagram(tag), web = sito(tag);
    if (!ig && !web) continue;
    const c = trovaComune(tag, lat, lon);
    if (!c) continue;
    const id = `${el.type[0]}${el.id}`;
    if (trovati.has(id)) continue;
    const via = [tag['addr:street'], tag['addr:housenumber']].filter(Boolean).join(' ');
    trovati.set(id, {
      id, nome: tag.name.trim().slice(0, 80), tipo: tag.amenity, comune: c.codiceIstat,
      ...(via ? { indirizzo: via.slice(0, 80) } : {}), lat: Number(lat.toFixed(6)), lon: Number(lon.toFixed(6)),
      ...(ig ? { instagram: ig } : {}), ...(web ? { sito: web } : {}),
      live: tag.live_music === 'yes' || tag.amenity === 'nightclub' || tag.amenity === 'music_venue',
    });
    nuovi++;
  }
  console.log(`${regione}: ${nuovi} locali`);
  fatte.push(regione);
  salva(false, fatte); // si salva dopo ogni regione: se il lancio si interrompe, non si perde il lavoro fatto
  if (!process.env.OVERPASS_FIXTURE) await pausa(8000); // gentili con il servizio pubblico
}

const locali = salva(true, fatte);
const conIg = locali.filter((l) => l.instagram).length;
console.log(`Totale: ${locali.length} locali (${conIg} con profilo Instagram, ${locali.filter((l) => l.live).length} con musica dal vivo).`);
