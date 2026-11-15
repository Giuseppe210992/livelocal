// Legge i siti ufficiali dei luoghi da visitare (musei, aree archeologiche, castelli, palazzi) con un modello gratuito (FreeLLMAPI),
// estrae orari e costi e li scrive in src/data/luoghi-da-visitare.json. Nessun costo per Claude.
//
// Candidati:  ricerca/luoghi-elenco.json  (da Wikidata, scripts/scopri-luoghi.mjs)  +  ricerca/luoghi-semi.json (pagine ufficiali scelte a mano,
//             per esempio le schede cultura.gov.it/luogo/…). Stato: ricerca/luoghi-stato.json.
// Per ogni luogo: apre il sito (rispettando robots.txt), trova le pagine «orari», «biglietti», «visita», le manda al modello e
// accetta la scheda SOLO se orari e costo sono citati con le parole esatte della pagina (anti-invenzione, come per gli eventi).
// Un luogo senza orari ufficiali leggibili NON viene pubblicato.
//
//   node scripts/estrai-luoghi-ia.mjs                 giro normale (LUOGHI_PER_GIRO, BUDGET_MINUTI)
//   node scripts/estrai-luoghi-ia.mjs --prova         non scrive niente
//   node scripts/estrai-luoghi-ia.mjs --html f --url u --simula r.json   prova senza rete con un file HTML e la risposta del modello salvata
// Variabili: FREELLMAPI_KEY (segreto), FREELLMAPI_URL, FREELLMAPI_MODEL, LUOGHI_PER_GIRO (60), BUDGET_MINUTI, CONCORRENZA (3).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const opz = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const prova = args.includes('--prova');
const simula = opz('--simula'), htmlLocale = opz('--html'), urlLocale = opz('--url');
const BASE = (process.env.FREELLMAPI_URL || 'https://ai.roomandrelax.it/v1').replace(/\/$/, '');
const CHIAVE = process.env.FREELLMAPI_KEY || '';
const MODELLO = process.env.FREELLMAPI_MODEL || 'auto';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it)';
const PER_GIRO = Number(opz('--max') ?? process.env.LUOGHI_PER_GIRO ?? 60);
const BUDGET_MS = Number(process.env.BUDGET_MINUTI ?? 75) * 60000;
const CONCORRENZA = Math.max(1, Number(process.env.CONCORRENZA ?? 3));
const INIZIO = Date.now();
const OGGI = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
const RICONTROLLO_GIORNI = 30;

const FILE_LUOGHI = 'src/data/luoghi-da-visitare.json';
const FILE_ELENCO = 'ricerca/luoghi-elenco.json';
const FILE_SEMI = 'ricerca/luoghi-semi.json';
const FILE_STATO = 'ricerca/luoghi-stato.json';
const TIPI = ['Museo', 'Area archeologica', 'Castello', 'Palazzo e villa', 'Chiesa e abbazia', 'Parco e giardino', 'Monumento', 'Reggia e parco', 'Museo e area archeologica'];

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKC').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9€]+/g, ' ').trim();
const normUrl = (u) => { try { const x = new URL(u); x.hash = ''; let s = x.toString(); if (s.endsWith('/') && x.pathname !== '/') s = s.slice(0, -1); return s; } catch { return u; } };
const slugify = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// ---------- dati ----------
const leggiJson = (f, vuoto) => (existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : vuoto);
const archivio = leggiJson(FILE_LUOGHI, { _nota: '', luoghi: [] });
const stato = leggiJson(FILE_STATO, {});
const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const comuneDi = new Map(territorio.comuni.map((c) => [c.codiceIstat, c]));
const siglaDi = new Map(territorio.province.map((p) => [p.codiceIstat, p.sigla]));
const perSlug = new Map(archivio.luoghi.map((l) => [l.slug, l]));
const chiaveNome = (nome, comune) => `${comune}|${norm(nome)}`;
const perNome = new Map(archivio.luoghi.map((l) => [chiaveNome(l.nome, l.comune), l]));

// ---------- scaricamento ----------
const robotsCache = new Map();
async function consentito(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    const regole = [];
    try {
      const r = await fetch(u.origin + '/robots.txt', { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(10000) });
      if (r.ok) {
        let attivo = false;
        for (const riga of (await r.text()).split(/\r?\n/)) {
          const m = riga.match(/^\s*(user-agent|disallow)\s*:\s*(.*?)\s*(#.*)?$/i);
          if (!m) continue;
          if (m[1].toLowerCase() === 'user-agent') attivo = m[2] === '*' || /livelocal/i.test(m[2]);
          else if (attivo && m[2]) regole.push(m[2]);
        }
      }
    } catch { /* robots non raggiungibile: si prosegue con cautela */ }
    robotsCache.set(u.origin, regole);
  }
  return !robotsCache.get(u.origin).some((p) => (u.pathname + u.search).startsWith(p.replace(/\*.*$/, '')));
}
async function scarica(url) {
  if (htmlLocale) return { html: readFileSync(htmlLocale, 'utf8'), urlFinale: url };
  if (!(await consentito(url))) return { errore: 'vietato da robots.txt' };
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'it' }, signal: AbortSignal.timeout(25000), redirect: 'follow' });
    if (!r.ok) return { errore: `HTTP ${r.status}` };
    if (!/html|text/i.test(r.headers.get('content-type') ?? '')) return { errore: 'non è una pagina web' };
    return { html: (await r.text()).slice(0, 1_500_000), urlFinale: r.url };
  } catch (e) { return { errore: String(e.message ?? e).slice(0, 80) }; }
}
const decodifica = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const htmlInTesto = (html) => decodifica(
  html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript|svg|template|iframe|nav|footer)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article|\/header|\/time|\/dt|\/dd)\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' '),
).normalize('NFKC').replace(/[ \t ]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n').trim();

/** Pagine del sito che parlano di orari, biglietti, visita: le più promettenti (massimo 3). */
function paginePratiche(html, base) {
  const trovate = new Map();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u; try { u = new URL(decodifica(m[1]), base); } catch { continue; }
    if (!/^https?:$/.test(u.protocol) || u.host.replace(/^www\./, '') !== new URL(base).host.replace(/^www\./, '') || /\.(pdf|jpe?g|png|gif|zip|docx?)$/i.test(u.pathname)) continue;
    const testo = htmlInTesto(m[2]).toLowerCase().slice(0, 60), perc = u.pathname.toLowerCase();
    let p = 0;
    if (/(orari|orario|biglietti|biglietto|tariffe|prezzi|apertura|come visitare|visita il|info pratiche|informazioni)/.test(testo)) p += 3;
    if (/(orari|orario|biglietti|biglietto|tariffe|prezzi|apertura|visita|visite|informazioni|info)/.test(perc)) p += 2;
    if (/(news|notizie|eventi|mostre|blog|privacy|cookie|shop|store|lavora|bandi|trasparen|archivio|login|search)/.test(perc)) p -= 3;
    if (p >= 3) trovate.set(normUrl(u.toString()), Math.max(p, trovate.get(normUrl(u.toString())) ?? 0));
  }
  return [...trovate.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([u]) => u).filter((u) => u !== normUrl(base));
}

// ---------- modello ----------
async function chiediAlModello(prompt) {
  if (simula) return JSON.parse(readFileSync(simula, 'utf8'));
  for (let t = 1; t <= 3; t++) {
    const corpo = { model: MODELLO, temperature: 0, max_tokens: 2500, messages: [{ role: 'system', content: 'Sei un assistente che estrae dati strutturati. Rispondi solo con JSON.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' } };
    if (t === 3) delete corpo.response_format;
    const r = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CHIAVE}` }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(90000) });
    if (r.status === 429 || r.status >= 500) { await pausa(25000 * t); continue; }
    if (!r.ok) { if (r.status === 400 && t < 3) continue; throw new Error(`modello: HTTP ${r.status}`); }
    let tx = ((await r.json()).choices?.[0]?.message?.content ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const a = tx.indexOf('{'), b = tx.lastIndexOf('}');
    if (a < 0 || b < 0) throw new Error('risposta senza JSON');
    return JSON.parse(tx.slice(a, b + 1));
  }
  throw new Error('modello non raggiungibile o troppo occupato');
}
function costruisciPrompt(c, pagine) {
  const testo = pagine.map((p, i) => `=== PAGINA ${i + 1}: ${p.url}\n${p.testo}`).join('\n\n');
  return `Oggi è ${OGGI}. Dalle pagine qui sotto del sito ufficiale di un luogo da visitare estrai la scheda per i visitatori. Usa SOLO ciò che è scritto nelle pagine.
${c.nome ? `Luogo: «${c.nome}»${c.comuneNome ? ` a ${c.comuneNome}` : ''}.` : 'Ricava nome, comune e provincia dalla pagina.'}

Regole:
- "orari": gli orari di apertura per il pubblico, riportati come li scrive la pagina (giorni di chiusura inclusi). Se la pagina non scrive gli orari, lascia vuoto e metti aperto_al_pubblico false.
- "citazione_orari": una frase o riga COPIATA ESATTAMENTE dalla pagina (stessi caratteri) che contiene gli orari.
- "biglietto": il costo come lo scrive la pagina (intero, ridotto, gratuito, biglietto integrato). Se è gratuito scrivi «Ingresso gratuito». Se la pagina non dice nulla sul costo, lascia vuoto. "citazione_biglietto": frase copiata esattamente dalla pagina con il costo (vuota se biglietto è vuoto).
- "aperto_al_pubblico": true solo se si può visitare con orari ordinari; false se è solo su richiesta, solo per gruppi, chiuso o in restauro.
- "avviso": chiusure straordinarie, lavori o limitazioni scritte nella pagina (vuoto se non ci sono). "prenotazione": se serve prenotare, come (senza numeri di telefono né email).
- "descrizione": 100-300 caratteri, tua, con fatti letti nella pagina (cosa si visita), senza ipotesi e senza copiare frasi intere.
- "indirizzo": via e numero se scritti, altrimenti vuoto. "tipo": una sola tra ${TIPI.join(', ')}.
- Mai telefoni, email, indirizzi web o nomi di privati in nessun campo. "fonte_url": l'indirizzo della PAGINA da cui hai letto gli orari (uno di quelli indicati).

Rispondi SOLO con JSON: {"luogo":{"nome":"","comune":"","provincia":"sigla","tipo":"","indirizzo":"","descrizione":"","orari":"","citazione_orari":"","biglietto":"","citazione_biglietto":"","prenotazione":"","avviso":"","aperto_al_pubblico":true,"fonte_url":""}}. Se non puoi compilare gli orari: {"luogo":null}.

${testo}`;
}

// ---------- controllo anti-invenzione ----------
const CONTATTO = /(\+?\d[\d\s./-]{7,}\d|@|https?:\/\/|www\.)/i;
function controlla(L, pagine, c) {
  const motivi = [];
  if (!L) return ['nessuna scheda'];
  if (L.aperto_al_pubblico !== true) return ['non risulta aperto al pubblico con orari ordinari'];
  for (const k of ['orari', 'citazione_orari', 'descrizione', 'fonte_url']) if (!L[k] || !String(L[k]).trim()) motivi.push('manca ' + k);
  if (motivi.length) return motivi;
  const mappa = new Map(pagine.map((p) => [normUrl(p.url), p.testo]));
  const testo = mappa.get(normUrl(L.fonte_url));
  if (!testo) return ['fonte_url non è una delle pagine lette'];
  const nz = (s) => ' ' + norm(s) + ' ';
  const tt = nz(testo), tutto = nz([...mappa.values()].join('\n'));
  if (!tt.includes(nz(L.citazione_orari))) motivi.push('citazione degli orari non presente nella pagina');
  // ogni numero degli orari deve comparire nella pagina (niente orari inventati)
  for (const n of String(L.orari).match(/\d+/g) ?? []) if (!new RegExp(`(?:^|[^0-9])${n}(?:[^0-9]|$)`).test(tt.replace(/[.:,/-]/g, ' '))) { motivi.push(`il numero ${n} degli orari non c'è nella pagina`); break; }
  if (L.biglietto && String(L.biglietto).trim()) {
    if (!L.citazione_biglietto || !tutto.includes(nz(L.citazione_biglietto))) motivi.push('citazione del costo non presente nelle pagine');
    for (const n of String(L.biglietto).match(/\d+(?:[.,]\d+)?/g) ?? []) if (!tutto.includes(norm(n))) { motivi.push(`il costo ${n} non c'è nelle pagine`); break; }
  }
  for (const k of ['descrizione', 'orari', 'biglietto', 'avviso', 'prenotazione', 'indirizzo']) if (L[k] && CONTATTO.test(String(L[k]))) motivi.push(`contatto o indirizzo web in ${k}`);
  if (String(L.descrizione).length < 60) motivi.push('descrizione troppo corta');
  const nome = c.nome ?? L.nome;
  if (!nome || String(nome).length < 3) motivi.push('manca il nome');
  return motivi;
}

// ---------- giro ----------
const distKm = (la1, lo1, la2, lo2) => { const r = Math.PI / 180, dx = (lo2 - lo1) * r * Math.cos(((la1 + la2) / 2) * r), dy = (la2 - la1) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };
function risolviComune(c, L) {
  if (c.comune) {
    const noto = comuneDi.get(c.comune);
    if (noto) return noto;
    // Codice ISTAT vecchio (comune fuso o rinominato): si usa il comune più vicino alle coordinate, se entro 12 km.
    if (Number.isFinite(c.lat)) { let m = null, d = 12; for (const x of territorio.comuni) { const k = distKm(c.lat, c.lon, x.lat, x.lon); if (k < d) { d = k; m = x; } } return m; }
    return null;
  }
  const nome = norm(L.comune), sigla = String(L.provincia ?? '').toUpperCase();
  return territorio.comuni.find((x) => norm(x.nome) === nome && (!sigla || siglaDi.get(x.provincia) === sigla)) ?? null;
}
const nuovi = [], resoconto = [];
const candidati = [];
{
  const elenco = leggiJson(FILE_ELENCO, { luoghi: [] }).luoghi ?? [];
  const semi = leggiJson(FILE_SEMI, { semi: [] }).semi ?? [];
  for (const s of semi) candidati.push({ id: 'seme:' + normUrl(s.url), nome: s.nome, sito: s.url, comune: s.comune, seme: true });
  for (const l of elenco) candidati.push({ id: l.id, nome: l.nome, sito: l.sito, comune: l.comune, classe: l.classe, lat: l.lat, lon: l.lon });
}
const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
const dovuto = (c) => { const s = stato[c.id]; if (!s) return true; return giorniDa(s.ultima) >= (s.esito === 'ok' ? RICONTROLLO_GIORNI : 14); };
// prima i semi e i mai controllati, poi i controllati da più tempo
const coda = candidati.filter(dovuto).sort((a, b) => Number(!!stato[a.id]) - Number(!!stato[b.id]) || Number(!!b.seme) - Number(!!a.seme) || String(stato[a.id]?.ultima ?? '').localeCompare(String(stato[b.id]?.ultima ?? '')) || a.id.localeCompare(b.id)).slice(0, PER_GIRO);
console.log(`Giro luoghi del ${OGGI}: ${coda.length} luoghi da leggere (su ${candidati.length}), modello ${simula ? 'simulato' : MODELLO}.`);
let fermato = false, prossimo = 0, saltati = 0;

async function lavora(c) {
  const cm = c.comune ? risolviComune(c, {}) : null;
  const registra = (esito, extra = {}) => { stato[c.id] = { ultima: OGGI, esito, ...extra }; };
  const s = await scarica(c.sito);
  if (s.errore) { registra('sito-non-letto', { motivo: s.errore }); resoconto.push(`  --  ${c.nome ?? c.sito}: ${s.errore}`); return; }
  const pagine = [{ url: normUrl(s.urlFinale), testo: htmlInTesto(s.html).slice(0, 9000) }];
  if (!htmlLocale) for (const u of paginePratiche(s.html, s.urlFinale)) { await pausa(800); const d = await scarica(u); if (!d.errore) pagine.push({ url: u, testo: htmlInTesto(d.html).slice(0, 7000) }); }
  const hash = createHash('sha1').update(pagine.map((p) => p.testo).join('\n')).digest('hex').slice(0, 16);
  if (stato[c.id]?.hash === hash && stato[c.id]?.esito === 'ok') { registra('ok', { hash }); resoconto.push(`  =    ${c.nome}: invariato`); return; }
  if (pagine[0].testo.length < 150 && pagine.length === 1) { registra('pagina-vuota', { hash }); resoconto.push(`  --  ${c.nome ?? c.sito}: pagina vuota (probabile JavaScript)`); return; }
  const risposta = await chiediAlModello(costruisciPrompt({ ...c, comuneNome: cm?.nome }, pagine));
  const L = risposta.luogo ?? null;
  const motivi = controlla(L, pagine, c);
  if (motivi.length) { registra(motivi[0].startsWith('non risulta') || motivi[0] === 'nessuna scheda' ? 'senza-orari' : 'scartato', { hash, motivo: motivi[0].slice(0, 80) }); resoconto.push(`  KO   ${c.nome ?? c.sito} → ${motivi.join('; ')}`); return; }
  const comune = c.comune ? cm : risolviComune(c, L);
  if (!comune) { registra('scartato', { hash, motivo: 'comune non riconosciuto' }); resoconto.push(`  KO   ${L.nome} → comune non riconosciuto`); return; }
  const nome = String(c.nome ?? L.nome).replace(/\s+/g, ' ').trim().slice(0, 120);
  const esistente = perNome.get(chiaveNome(nome, comune.codiceIstat));
  if (esistente && esistente.inseritoDa !== 'automatico') { registra('ok', { hash }); resoconto.push(`  =    ${nome}: già presente (scheda manuale)`); return; }
  let slug = esistente?.slug ?? slugify(`${nome}-${comune.slug}`).slice(0, 90).replace(/-+$/, '');
  if (!esistente && perSlug.has(slug)) slug = `${slug}-${slugify(c.id).slice(-6)}`;
  const tipo = TIPI.includes(L.tipo) ? L.tipo : (c.classe === 'Castello' ? 'Castello' : c.classe === 'Area archeologica' ? 'Area archeologica' : c.classe === 'Palazzo' ? 'Palazzo e villa' : c.classe === 'Chiesa e cattedrale' ? 'Chiesa e abbazia' : 'Museo');
  const campo = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
  const scheda = {
    slug, nome, tipo, comune: comune.codiceIstat, indirizzo: campo(L.indirizzo) || `${comune.nome} (${siglaDi.get(comune.provincia)})`,
    descrizione: campo(L.descrizione), orari: campo(L.orari), biglietto: campo(L.biglietto) || 'Costo non indicato nelle pagine consultate: vedi il sito ufficiale.',
    ...(campo(L.prenotazione) ? { prenotazione: campo(L.prenotazione) } : {}), ...(campo(L.avviso) ? { avviso: campo(L.avviso) } : {}),
    sito: s.urlFinale, fonte: { nome: `Sito ufficiale (${new URL(s.urlFinale).hostname.replace(/^www\./, '')})`, url: normUrl(L.fonte_url) }, verificato: OGGI,
    ...(Number.isFinite(c.lat) ? { lat: c.lat, lon: c.lon } : {}), inseritoDa: 'automatico', origine: c.id,
  };
  nuovi.push(scheda); perSlug.set(slug, scheda); perNome.set(chiaveNome(nome, comune.codiceIstat), scheda);
  registra('ok', { hash });
  resoconto.push(`  ok   ${nome} (${comune.nome}): ${scheda.orari.slice(0, 60)}`);
}
async function operaio() {
  while (!fermato && prossimo < coda.length) {
    if (Date.now() - INIZIO > BUDGET_MS) { saltati = coda.length - prossimo; return; }
    const c = coda[prossimo++];
    try { await lavora(c); } catch (e) {
      const m = String(e.message ?? e);
      resoconto.push(`  !!   ${c.nome ?? c.sito}: ${m.slice(0, 90)}`);
      if (/FREELLMAPI_KEY|HTTP 40[13]|non raggiungibile/.test(m)) fermato = true;
    }
  }
}
if (!simula && !htmlLocale && !CHIAVE) { console.error('ERRORE: manca il segreto FREELLMAPI_KEY.'); process.exit(1); }
if (htmlLocale) { coda.length = 0; coda.push({ id: 'prova', nome: opz('--nome') ?? undefined, sito: urlLocale ?? 'https://esempio.it/', comune: opz('--comune') ?? undefined }); }
await Promise.all(Array.from({ length: CONCORRENZA }, operaio));

const conta = (k) => resoconto.filter((r) => r.startsWith(k)).length;
console.log(resoconto.join('\n'));
console.log(`Schede nuove o aggiornate: ${nuovi.length}. Scartate: ${conta('  KO')}. Non lette: ${conta('  --')}. Errori: ${conta('  !!')}.${saltati ? ` Rimandate per tempo: ${saltati}.` : ''}${fermato ? ' Fermato: controlla FREELLMAPI_KEY e FREELLMAPI_URL.' : ''}`);

if (!prova) {
  if (nuovi.length) {
    const tutte = new Map(archivio.luoghi.map((l) => [l.slug, l]));
    for (const n of nuovi) tutte.set(n.slug, n);
    const lista = [...tutte.values()].sort((a, b) => a.slug.localeCompare(b.slug));
    writeFileSync(FILE_LUOGHI, `{"_nota":${JSON.stringify(archivio._nota ?? '')},"luoghi":[\n${lista.map((l) => JSON.stringify(l)).join(',\n')}\n]}\n`);
  }
  writeFileSync(FILE_STATO, JSON.stringify(stato) + '\n');
}
