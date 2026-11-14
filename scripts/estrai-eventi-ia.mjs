// Estrazione automatica di eventi con un modello gratuito (FreeLLMAPI), senza passare da Claude.
//
// Per ogni pagina elencata in ricerca/fonti-automatiche.json:
//   1. scarica la pagina (e alcune pagine di dettaglio dei singoli eventi) e ne ricava il testo intero;
//   2. chiede al modello di scrivere gli eventi in formato JSON, citando le frasi esatte della pagina
//      in cui ha letto la data e il luogo;
//   3. SCARTA da solo ogni evento le cui citazioni non compaiono davvero nel testo della pagina
//      (è il controllo contro le invenzioni) o la cui data non coincide con la citazione;
//   4. scrive i superstiti in ricerca/consegne/auto-<data>.txt e li passa a scripts/importa-consegna.mjs,
//      che applica gli altri controlli (comune, categoria, date, doppioni, contatti privati).
//
// Si lancia con:
//   node scripts/estrai-eventi-ia.mjs                 giro normale (scrive e importa)
//   node scripts/estrai-eventi-ia.mjs --prova         non scrive niente: mostra solo cosa troverebbe
//   node scripts/estrai-eventi-ia.mjs --max 5         al massimo 5 pagine in questo giro
//   node scripts/estrai-eventi-ia.mjs --simula f.json usa la risposta del modello salvata in f.json (per i collaudi)
//   node scripts/estrai-eventi-ia.mjs --html f.html --url https://… --prova   usa un file HTML locale invece della rete
//
// Variabili d'ambiente (mai nel repository: sono segreti/variabili di GitHub Actions):
//   FREELLMAPI_KEY    chiave API del tuo FreeLLMAPI (segreto)
//   FREELLMAPI_URL    indirizzo base, es. https://ai.roomandrelax.it/v1 (variabile; è il valore predefinito)
//   FREELLMAPI_MODEL  modello da usare (predefinito: auto)

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const opz = (nome) => { const i = args.indexOf(nome); return i >= 0 ? args[i + 1] : null; };
const prova = args.includes('--prova');
const simula = opz('--simula');
const htmlLocale = opz('--html');
const urlLocale = opz('--url');
const MAX_FONTI = Number(opz('--max') ?? process.env.MAX_FONTI ?? 60);

const BASE = (process.env.FREELLMAPI_URL || 'https://ai.roomandrelax.it/v1').replace(/\/$/, '');
const CHIAVE = process.env.FREELLMAPI_KEY || '';
const MODELLO = process.env.FREELLMAPI_MODEL || 'auto';
const UA = 'LiveLocalBot/1.0 (+https://livelocal.roomandrelax.it)';
const MAX_TESTO = 22000;      // caratteri della pagina principale mandati al modello
const MAX_DETTAGLI = 10;
const BUDGET_MS = Number(process.env.BUDGET_MINUTI ?? 75) * 60000; // il giro si ferma da solo dopo questo tempo
const INIZIO = Date.now();
const CONCORRENZA = Math.max(1, Number(process.env.CONCORRENZA ?? 3)); // pagine lavorate insieme       // pagine di dettaglio per fonte
const MAX_TESTO_DETTAGLIO = 3000;

const OGGI = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
const categorie = JSON.parse(readFileSync('src/data/categorie.json', 'utf8')).map((c) => c.slug);
const eventiEsistenti = JSON.parse(readFileSync('src/data/eventi.json', 'utf8'));
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[“”«»"']/g, '"').replace(/\s+/g, ' ').trim();
const normUrl = (u) => { try { const x = new URL(u); x.hash = ''; let s = x.toString(); if (s.endsWith('/') && x.pathname !== '/') s = s.slice(0, -1); return s; } catch { return u; } };
const urlNote = new Set(eventiEsistenti.flatMap((e) => e.fonti.map((f) => normUrl(f.url))));

// ---------- 1) Scaricamento e testo ----------
const robotsCache = new Map();
async function consentito(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    let regole = [];
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
  if (!(await consentito(url))) return { errore: 'vietato da robots.txt' };
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'it' }, signal: AbortSignal.timeout(25000), redirect: 'follow' });
    if (!r.ok) return { errore: `HTTP ${r.status}` };
    if (!/html|text/i.test(r.headers.get('content-type') ?? '')) return { errore: 'non è una pagina web' };
    const html = (await r.text()).slice(0, 1_500_000);
    return { html, urlFinale: r.url };
  } catch (e) {
    return { errore: String(e.message ?? e).slice(0, 80) };
  }
}

function decodifica(s) {
  return s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function htmlInTesto(html) {
  return decodifica(
    html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript|svg|template|iframe)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article|\/header|\/time)\b[^>]*>/gi, '\n').replace(/<[^>]+>/g, ' '),
  ).replace(/[ \t ]+/g, ' ').replace(/ ?\n ?/g, '\n').replace(/\n{2,}/g, '\n').trim();
}
function linkDettaglio(html, base) {
  const trovati = new Map();
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["']/gi)) {
    let u;
    try { u = new URL(decodifica(m[1]), base); } catch { continue; }
    if (u.host !== new URL(base).host || !/^https?:$/.test(u.protocol)) continue;
    if (!/(event|evento|eventi|spettacol|mostr|appuntament|agenda\/|manifestazion)/i.test(u.pathname)) continue;
    if (/\.(pdf|jpe?g|png|gif|zip|docx?)$/i.test(u.pathname) || normUrl(u.toString()) === normUrl(base)) continue;
    if (/\/(categoria|category|tag|page)\//i.test(u.pathname) || /[?&](page|pag|p)=/i.test(u.search)) continue;
    trovati.set(normUrl(u.toString()), true);
  }
  return [...trovati.keys()].filter((u) => !urlNote.has(u));
}

// ---------- 2) Modello ----------
function costruisciPrompt(pagine, hint = '') {
  const testo = pagine.map((p, i) => `=== PAGINA ${i + 1}: ${p.url}\n${p.testo}`).join('\n\n');
  return `${hint ? hint + '\n' : ''}Oggi è ${OGGI}. Estrai gli eventi pubblici in luogo fisico, aperti al pubblico, che iniziano da oggi in poi, dalle pagine qui sotto. Usa SOLO ciò che è scritto nelle pagine.

Regole:
- Un evento si scrive solo se la pagina riporta già la data di inizio (con giorno e mese) e un luogo preciso (un posto con un nome; «Centro storico» va bene). Altrimenti saltalo. Mai dedurre date da «ogni sabato» o simili, mai indovinare.
- Compila "citazione_data" e "citazione_luogo" COPIANDO ESATTAMENTE dal testo della pagina (stessi caratteri) la frase in cui sono scritti. Se non puoi citarli, non scrivere l'evento.
- "fonte_url" è l'indirizzo della PAGINA da cui hai letto l'evento (uno di quelli indicati).
- Se la pagina riporta l'ora, scrivila in inizio (e in fine se c'è). Prezzo: «gratuito» se è scritto gratuito o ingresso libero; «12 euro» se c'è l'importo; altrimenti «non indicato». L'organizzatore è chi organizza (ente, associazione, compagnia), non chi ospita né chi patrocina; se non c'è, stringa vuota.
- "descrizione": 100-300 caratteri, tua, solo fatti letti (tema, ospiti, tipo di evento), senza ipotesi, senza ripetere il titolo.
- "titolo" e "luogo" in maiuscole e minuscole normali (non tutto in maiuscolo), senza virgolette attorno al titolo e senza articoli iniziali nel luogo (scrivi «Auditorium Norma Cossetto», non «ALL'AUDITORIUM NORMA COSSETTO»). Le citazioni invece vanno copiate identiche alla pagina.
- Mai telefoni, email, nomi di privati o contatti in nessun campo.
- categoria: una sola tra ${categorie.join(', ')} (danza e balletto = teatro; opera e musica = concerto). Nessun'altra parola.
- Controlla che nei testi non ci siano parole attaccate o frasi spezzate: riscrivi con cura.
- Al massimo 15 eventi.

Rispondi SOLO con JSON valido: {"eventi":[{"titolo":"","categoria":"","comune":"","provincia":"sigla","luogo":"","indirizzo":"","inizio":"AAAA-MM-GG oppure AAAA-MM-GG HH:MM","fine":"","descrizione":"","prezzo":"","organizzatore":"","fonte_url":"","citazione_data":"","citazione_luogo":""}]}. Se non ci sono eventi validi: {"eventi":[]}.

${testo}`;
}

async function chiediAlModello(prompt) {
  if (simula) return JSON.parse(readFileSync(simula, 'utf8'));
  if (!CHIAVE) throw new Error('manca FREELLMAPI_KEY');
  for (let tentativo = 1; tentativo <= 3; tentativo++) {
    const corpo = { model: MODELLO, temperature: 0, max_tokens: 6000, messages: [{ role: 'system', content: 'Sei un assistente che estrae dati strutturati. Rispondi solo con JSON.' }, { role: 'user', content: prompt }], response_format: { type: 'json_object' } };
    if (tentativo === 3) delete corpo.response_format;
    const r = await fetch(`${BASE}/chat/completions`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${CHIAVE}` }, body: JSON.stringify(corpo), signal: AbortSignal.timeout(90000) });
    if (r.status === 429 || r.status >= 500) { await pausa(25000 * tentativo); continue; }
    if (!r.ok) { if (r.status === 400 && tentativo < 3) continue; throw new Error(`modello: HTTP ${r.status}`); }
    const j = await r.json();
    let t = (j.choices?.[0]?.message?.content ?? '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b < 0) throw new Error('risposta senza JSON');
    return JSON.parse(t.slice(a, b + 1));
  }
  throw new Error('modello non raggiungibile o troppo occupato');
}

// ---------- 3) Controllo anti-invenzione ----------
function dataCoerente(iso, citazione) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return false;
  const g = Number(m[3]), mese = Number(m[2]);
  const c = norm(citazione);
  const nome = MESI[mese - 1];
  const reGiorno = `(?:^|[^0-9])0?${g}(?:[^0-9]|$)`;
  const conNome = new RegExp(reGiorno).test(c) && (c.includes(nome) || new RegExp(`\\b${nome.slice(0, 3)}\\b`).test(c));
  const numerica = new RegExp(`(?:^|[^0-9])0?${g}[/.-]0?${mese}(?:[^0-9]|$)`).test(c) || c.includes(iso.slice(0, 10));
  return conNome || numerica;
}
function controlla(e, mappaTesti, locale = false) {
  const motivi = [];
  for (const k of locale ? ['titolo', 'categoria', 'comune', 'luogo', 'inizio', 'descrizione', 'fonte_url', 'citazione_data'] : ['titolo', 'categoria', 'comune', 'luogo', 'inizio', 'descrizione', 'fonte_url', 'citazione_data', 'citazione_luogo']) if (!e[k] || !String(e[k]).trim()) motivi.push('manca ' + k);
  if (motivi.length) return motivi;
  const testo = mappaTesti.get(normUrl(e.fonte_url));
  if (!testo) return ['fonte_url non è una delle pagine lette'];
  // Confronto senza punteggiatura, accenti e maiuscole: conta che le PAROLE siano quelle della pagina, nello stesso ordine.
  const nz = (s) => ' ' + norm(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const tt = nz(testo);
  if (!tt.includes(nz(e.citazione_data))) motivi.push('citazione della data non presente nella pagina');
  if (!locale && !tt.includes(nz(e.citazione_luogo))) motivi.push('citazione del luogo non presente nella pagina');
  const t = norm(testo);
  if (!dataCoerente(String(e.inizio), e.citazione_data)) motivi.push('la data non coincide con la citazione');
  // Se la citazione dice il giorno della settimana («sabato 15 novembre»), deve coincidere con la data scelta (smaschera gli anni sbagliati).
  const GIORNI = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];
  const cit = norm(e.citazione_data);
  const g = GIORNI.findIndex((x) => new RegExp(`\\b${x}\\b`).test(cit));
  if (g >= 0 && /^\d{4}-\d{2}-\d{2}/.test(String(e.inizio)) && new Date(String(e.inizio).slice(0, 10) + 'T12:00:00Z').getUTCDay() !== g) motivi.push('il giorno della settimana non coincide con la data');
  const paroleLuogo = locale ? [] : norm(e.luogo).split(/[^a-z0-9]+/).filter((p) => p.length >= 5);
  if (paroleLuogo.length && !paroleLuogo.some((p) => t.includes(p))) motivi.push('il luogo non compare nella pagina');
  const paroleTitolo = norm(e.titolo).split(/[^a-z0-9]+/).filter((p) => p.length >= 4);
  if (paroleTitolo.length && paroleTitolo.filter((p) => t.includes(p)).length < Math.ceil(paroleTitolo.length * 0.6)) motivi.push('il titolo non compare nella pagina');
  return motivi;
}

// ---------- 4) Giro ----------
const fileFonti = 'ricerca/fonti-automatiche.json';
const fileStato = 'ricerca/automazione-stato.json';
const stato = existsSync(fileStato) ? JSON.parse(readFileSync(fileStato, 'utf8')) : { _nota: 'Generato da scripts/estrai-eventi-ia.mjs: ultimo giro per ogni fonte.', fonti: {} };

// ---- Modalità --comuni: per ogni comune da 10.000 abitanti non ancora fatto, trova il sito del Comune e la sua pagina «Eventi».
const fileProgresso = 'ricerca/comuni-progresso.json';
const progresso = existsSync(fileProgresso) ? JSON.parse(readFileSync(fileProgresso, 'utf8')) : { _nota: 'Comuni già censiti. esito: eventi | nessun-evento | fonti-illeggibili.', fatti: {} };
const filePagine = 'ricerca/comuni-pagine.json'; // per ogni comune: pagina «Eventi» trovata e impronta del suo contenuto all'ultimo controllo
const paginComuni = existsSync(filePagine) ? JSON.parse(readFileSync(filePagine, 'utf8')) : {};
const modalitaComuni = args.includes('--comuni');
const modalitaLocali = args.includes('--locali');
const fileLocali = 'ricerca/locali.json';            // pub, bar, club, locali con musica: da OpenStreetMap (scripts/scopri-locali.mjs)
const fileStatoLocali = 'ricerca/locali-stato.json';  // per ogni locale: ultimo controllo, esito, impronta dei post
const statoLocali = existsSync(fileStatoLocali) ? JSON.parse(readFileSync(fileStatoLocali, 'utf8')) : {};
const GRAPH = process.env.GRAPH_BASE || 'https://graph.facebook.com/v26.0';
const META_TOKEN = process.env.META_TOKEN || '';
const MAX_IG = Number(process.env.MAX_IG_LOCALI || 60); // chiamate a Instagram per giro (Meta ne tollera circa 200 all'ora, in comune con l'altro controllo)
const PER_GIRO_COMUNI = Number(opz('--comuni') && /^\d+$/.test(opz('--comuni')) ? opz('--comuni') : process.env.COMUNI_PER_GIRO ?? 240);

const slugComune = (c) => c.slug;
function indirizziComune(c, sigla) {
  const s = slugComune(c), g = sigla.toLowerCase();
  return [`https://www.comune.${s}.${g}.it/`, `https://comune.${s}.${g}.it/`, `https://www.comune.${s}.it/`, `https://comune.${s}.it/`];
}
function trovaPaginaEventi(html, base) {
  const trovati = [];
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u;
    try { u = new URL(decodifica(m[1]), base); } catch { continue; }
    if (u.host !== new URL(base).host || !/^https?:$/.test(u.protocol)) continue;
    if (/\.(pdf|jpe?g|png|gif|zip|docx?)$/i.test(u.pathname)) continue;
    const testo = htmlInTesto(m[2]).toLowerCase().slice(0, 60);
    const percorso = (u.pathname + u.search).toLowerCase();
    let punti = 0;
    if (/^(eventi|agenda|agenda eventi|calendario eventi|tutti gli eventi|eventi e manifestazioni|manifestazioni|eventi in programma)$/.test(testo.trim())) punti += 5;
    else if (/\b(eventi|agenda|manifestazioni|appuntamenti)\b/.test(testo)) punti += 3;
    if (/\/(eventi|events|agenda|manifestazioni|appuntamenti)\/?$/.test(u.pathname.toLowerCase())) punti += 4;
    else if (/(eventi|events|agenda|manifestazioni)/.test(percorso)) punti += 1;
    if (/news|notizie|avvisi|bandi|albo|trasparen|gara|concors/.test(percorso)) punti -= 3;
    if (punti >= 3) trovati.push({ url: normUrl(u.toString()), punti });
  }
  trovati.sort((a, b) => b.punti - a.punti || a.url.length - b.url.length);
  return trovati[0]?.url ?? null;
}
// Siti ufficiali dei Comuni da Wikidata (proprietà P856, indicizzati per codice ISTAT P635): una sola richiesta, poi salvati in ricerca/comuni-siti.json.
const fileSiti = 'ricerca/comuni-siti.json';
async function sitiDaWikidata() {
  if (existsSync(fileSiti)) return JSON.parse(readFileSync(fileSiti, 'utf8'));
  const sparql = 'SELECT ?istat ?sito WHERE { ?c wdt:P31 wd:Q747074 . ?c wdt:P635 ?istat . ?c wdt:P856 ?sito . }';
  try {
    const r = await fetch('https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql), { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' }, signal: AbortSignal.timeout(90000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const out = {};
    for (const b of (await r.json()).results.bindings) {
      const k = b.istat.value.padStart(6, '0');
      (out[k] ??= []).includes(b.sito.value) || out[k].push(b.sito.value);
    }
    writeFileSync(fileSiti, JSON.stringify(out) + '\n');
    console.log(`Siti dei Comuni da Wikidata: ${Object.keys(out).length} comuni.`);
    return out;
  } catch (e) {
    console.log('Wikidata non raggiungibile (' + String(e.message ?? e).slice(0, 60) + '): si provano solo gli indirizzi tipici.');
    return {};
  }
}

// Abitanti di ogni comune (dataset pubblico matteocontrini/comuni-json, dati ISTAT): scaricato una volta e salvato in ricerca/comuni-abitanti.json.
const fileAbitanti = 'ricerca/comuni-abitanti.json';
async function abitantiComuni() {
  if (existsSync(fileAbitanti)) return JSON.parse(readFileSync(fileAbitanti, 'utf8'));
  for (const ramo of ['master', 'main']) {
    try {
      const r = await fetch(`https://raw.githubusercontent.com/matteocontrini/comuni-json/${ramo}/comuni.json`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) });
      if (!r.ok) continue;
      const out = {};
      for (const c of await r.json()) if (c.codice && Number.isFinite(c.popolazione)) out[String(c.codice).padStart(6, '0')] = c.popolazione;
      if (Object.keys(out).length < 5000) continue;
      writeFileSync(fileAbitanti, JSON.stringify(out) + '\n');
      console.log(`Abitanti dei comuni scaricati: ${Object.keys(out).length} comuni.`);
      return out;
    } catch { /* si prova l'altro ramo */ }
  }
  console.log('Abitanti dei comuni non disponibili: si lavora solo sui comuni da 10.000 abitanti.');
  return {};
}

async function preparaComuni(quanti) {
  const sitiWikidata = await sitiDaWikidata();
  const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
  const province = new Map(territorio.province.map((p) => [p.codiceIstat, p]));
  const grandi = new Set(JSON.parse(readFileSync('ricerca/comuni-grandi.json', 'utf8')).comuni.map((c) => c.codice));
  // Due fasce: comuni da 10.000 abitanti in su (ricontrollo ogni giorno) e da 5.000 a 9.999 (ogni 3 giorni).
  // Quelli con sito illeggibile si riprovano ogni 7 giorni. Metà del giro va alla prima fascia e metà alla seconda;
  // dentro ogni fascia prima i comuni mai controllati, poi quelli controllati da più tempo.
  const abitanti = await abitantiComuni();
  const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
  const dovuto = (c, giorni) => { const p = progresso.fatti[c.codiceIstat]; if (!p) return true; if (String(p.data) >= OGGI) return false; return giorniDa(p.data) >= (p.esito === 'fonti-illeggibili' ? 7 : giorni); };
  const ordine = (a, b) => {
    const pa = progresso.fatti[a.codiceIstat], pb = progresso.fatti[b.codiceIstat];
    return Number(!!pa) - Number(!!pb) || String(pa?.data ?? '').localeCompare(String(pb?.data ?? '')) || a.nome.localeCompare(b.nome, 'it') || a.codiceIstat.localeCompare(b.codiceIstat);
  };
  const duGrandi = territorio.comuni.filter((c) => grandi.has(c.codiceIstat) && dovuto(c, 1)).sort(ordine);
  const duMedi = territorio.comuni.filter((c) => !grandi.has(c.codiceIstat) && (abitanti[c.codiceIstat] ?? 0) >= 5000 && dovuto(c, 3)).sort(ordine);
  const meta = Math.ceil(quanti / 2);
  let dallaPrima = duGrandi.slice(0, Math.max(meta, quanti - duMedi.length));
  const dallaSeconda = duMedi.slice(0, quanti - dallaPrima.length);
  dallaPrima = duGrandi.slice(0, quanti - dallaSeconda.length);
  const coda = [...dallaPrima, ...dallaSeconda];
  console.log(`Coda del giro: ${dallaPrima.length} comuni da 10.000+ abitanti (${duGrandi.length} da controllare), ${dallaSeconda.length} da 5.000 a 9.999 (${duMedi.length} da controllare).`);
  const out = [];
  let i = 0;
  async function cerca() {
    while (i < coda.length) {
      const c = coda[i++];
      const sigla = province.get(c.provincia).sigla;
      const noto = paginComuni[c.codiceIstat];
      if (noto?.url) { // la pagina «Eventi» è già nota: si riapre direttamente
        out.push({ url: noto.url, nome: `Comune di ${c.nome}`, tipo: 'ufficiale', dettagli: true, codiceComune: c.codiceIstat, hash: noto.hash, hint: `Comune di riferimento: ${c.nome} (${sigla}). Gli eventi che si svolgono in questo Comune vanno scritti con comune: ${c.nome} e provincia: ${sigla}.` });
        continue;
      }
      let sito = null, html = null;
      for (const ind of [...(sitiWikidata[c.codiceIstat] ?? []).filter((u) => /^https?:\/\//.test(u)), ...indirizziComune(c, sigla)]) {
        const s = await scarica(ind);
        if (!s.errore && s.html.length > 500) { sito = s.urlFinale; html = s.html; break; }
      }
      if (!sito) { progresso.fatti[c.codiceIstat] = { data: OGGI, esito: 'fonti-illeggibili', eventi: 0, motivo: 'sito non trovato' }; console.log(`  --  ${c.nome} (${sigla}): sito del Comune non trovato`); continue; }
      const pagina = trovaPaginaEventi(html, sito) ?? normUrl(sito);
      out.push({ url: pagina, nome: `Comune di ${c.nome}`, tipo: 'ufficiale', dettagli: true, codiceComune: c.codiceIstat, hint: `Comune di riferimento: ${c.nome} (${sigla}). Gli eventi che si svolgono in questo Comune vanno scritti con comune: ${c.nome} e provincia: ${sigla}.` });
      await pausa(500);
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => cerca()));
  console.log(`Comuni preparati: ${out.length} su ${coda.length} (gli altri non hanno un sito trovato).`);
  return out;
}

// ---- Modalità --locali: pub, bar, club e locali con musica dal vivo (elenco in ricerca/locali.json) ----
// Per ogni locale si leggono i post recenti del suo profilo Instagram professionale (API ufficiale di Meta, solo se pubblico)
// e/o la pagina eventi del suo sito. Le didascalie restano in memoria: si salva solo l'evento estratto.
const TIPI_LOCALE = { pub: 'pub', bar: 'bar', nightclub: 'locale notturno', biergarten: 'birreria', music_venue: 'locale di musica dal vivo', cafe: 'caffè' };
async function leggiInstagramLocale(handle, mioId) {
  const campi = `business_discovery.username(${handle}){username,media.limit(12){caption,timestamp,permalink}}`;
  try {
    const r = await (await fetch(`${GRAPH}/${mioId}?fields=${encodeURIComponent(campi)}&access_token=${encodeURIComponent(META_TOKEN)}`, { signal: AbortSignal.timeout(30000) })).json();
    if (r.error) return { errore: r.error.code };
    return { post: r.business_discovery?.media?.data ?? [] };
  } catch { return { errore: 'rete' }; }
}
function trovaPaginaEventiLocale(html, base) {
  let migliore = null, punti = 0;
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    let u; try { u = new URL(decodifica(m[1]), base); } catch { continue; }
    if (u.host !== new URL(base).host || !/^https?:$/.test(u.protocol) || /\.(pdf|jpe?g|png|gif|zip)$/i.test(u.pathname)) continue;
    const testo = htmlInTesto(m[2]).toLowerCase().slice(0, 50), perc = u.pathname.toLowerCase();
    let p = 0;
    if (/^(eventi|serate|live|agenda|programma|calendario|musica dal vivo|prossimi eventi|prossime serate|events)$/.test(testo.trim())) p += 5;
    else if (/\b(eventi|serate|live|agenda|programma|calendario)\b/.test(testo)) p += 3;
    if (/(eventi|serate|live|agenda|programma|calendario|events)/.test(perc)) p += 2;
    if (/(menu|prenota|contatt|privacy|cookie|gift|lavora)/.test(perc)) p -= 3;
    if (p > punti) { punti = p; migliore = normUrl(u.toString()); }
  }
  return punti >= 3 ? migliore : null;
}
async function preparaLocali(quanti) {
  if (!existsSync(fileLocali)) { console.log('Manca ricerca/locali.json: lancia prima scripts/scopri-locali.mjs.'); return []; }
  const locali = JSON.parse(readFileSync(fileLocali, 'utf8')).locali ?? [];
  const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
  const comuneDi = new Map(territorio.comuni.map((c) => [c.codiceIstat, c]));
  const siglaDi = new Map(territorio.province.map((p) => [p.codiceIstat, p.sigla]));
  const giorniDa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
  // Si ricontrolla ogni 2 giorni (i locali illeggibili ogni 7); prima i mai controllati, poi quelli con musica dal vivo, poi i più vecchi.
  const dovuto = (l) => { const s = statoLocali[l.id]; return !s || giorniDa(s.ultima) >= (s.esito === 'senza-fonti' || s.esito === 'illeggibile' ? 7 : 2); };
  const ordine = (a, b) => Number(!!statoLocali[a.id]) - Number(!!statoLocali[b.id]) || Number(!!b.live) - Number(!!a.live)
    || String(statoLocali[a.id]?.ultima ?? '').localeCompare(String(statoLocali[b.id]?.ultima ?? '')) || a.id.localeCompare(b.id);
  const coda = locali.filter(dovuto).sort(ordine).slice(0, quanti);
  const mioId = existsSync('ricerca/instagram-account.json') ? JSON.parse(readFileSync('ricerca/instagram-account.json', 'utf8')).mioId : null;
  const out = [];
  let igChiamate = 0, igFermo = !META_TOKEN || !mioId;
  const limiteData = new Date(Date.now() - 60 * 86400000).toISOString();
  let i = 0;
  async function cerca() {
    while (i < coda.length) {
      const l = coda[i++];
      const c = comuneDi.get(l.comune);
      if (!c) { statoLocali[l.id] = { ultima: OGGI, esito: 'senza-fonti', eventi: 0 }; continue; }
      const sigla = siglaDi.get(c.provincia) ?? '';
      const tipo = TIPI_LOCALE[l.tipo] ?? 'locale';
      const hint = `LOCALE: «${l.nome}» (${tipo}) a ${c.nome} (${sigla})${l.indirizzo ? ', ' + l.indirizzo : ''}. Le pagine qui sotto sono post Instagram o pagine del sito di questo locale. Regole speciali: il luogo è SEMPRE questo locale (scrivi il suo nome in "luogo" e lascia "citazione_luogo" vuota); comune: ${c.nome}, provincia: ${sigla}. La data può essere scritta senza anno («sabato 15 novembre»): l'anno è quello più vicino a oggi nel futuro. Scrivi un evento per ogni serata distinta; ignora menù, offerte, promozioni senza una serata, feste private, eventi su invito e post vecchi. fonte_url è l'indirizzo del post (o della pagina) da cui hai letto la data.`;
      const base = { nome: l.nome, tipo: 'organizzatore', dettagli: false, codiceLocale: l.id, hint, hash: statoLocali[l.id]?.hash, locale: { nome: l.nome, comune: c.nome, sigla, indirizzo: l.indirizzo ?? '', lat: l.lat, lon: l.lon } };
      let fatto = false;
      if (l.instagram && !igFermo && igChiamate < MAX_IG) {
        igChiamate++;
        const r = await leggiInstagramLocale(l.instagram, mioId);
        if (r.errore === 4 || r.errore === 17 || r.errore === 32 || r.errore === 613) { igFermo = true; console.log('Instagram: troppe richieste, per questo giro si usano solo i siti.'); }
        else if (r.errore === 190) { igFermo = true; console.log('Instagram: token scaduto o non valido (META_TOKEN).'); }
        else if (r.post) {
          const pagine = r.post.filter((p) => (p.caption ?? '').length >= 40 && (p.timestamp ?? '') >= limiteData && p.permalink)
            .map((p) => ({ url: normUrl(p.permalink), testo: `${(p.caption ?? '').slice(0, 1800)}\n(post del ${String(p.timestamp).slice(0, 10)})` }));
          if (pagine.length) { out.push({ ...base, url: `https://www.instagram.com/${l.instagram}/`, pagineDirette: pagine }); fatto = true; }
        }
        await pausa(700);
      }
      if (!fatto && l.sito) {
        const s = await scarica(l.sito);
        if (!s.errore) {
          const pagina = trovaPaginaEventiLocale(s.html, s.urlFinale);
          if (pagina) { out.push({ ...base, url: pagina }); fatto = true; }
        }
      }
      if (!fatto) statoLocali[l.id] = { ultima: OGGI, esito: 'senza-fonti', eventi: 0 };
    }
  }
  await Promise.all(Array.from({ length: 3 }, () => cerca()));
  console.log(`Locali preparati: ${out.length} su ${coda.length} (Instagram: ${igChiamate} chiamate).`);
  return out;
}

let elenco;
if (modalitaLocali) elenco = await preparaLocali(Number(process.env.LOCALI_PER_GIRO || 80));
else if (modalitaComuni) elenco = await preparaComuni(PER_GIRO_COMUNI);
else if (htmlLocale) elenco = [{ url: urlLocale, nome: 'Pagina di prova', tipo: 'ufficiale', dettagli: false, codiceComune: process.env.TEST_CODICE, hash: process.env.TEST_HASH }];
else elenco = JSON.parse(readFileSync(fileFonti, 'utf8')).fonti;
const ROTTA_DA_GIORNI = 14;
const giorniFa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
if (!modalitaComuni && !modalitaLocali) elenco = elenco.filter((f) => { const s = stato.fonti[f.url]; return !(s && (s.falliti ?? 0) >= 3 && giorniFa(s.ultima) < ROTTA_DA_GIORNI); }); // pagine che falliscono da 3 giri: si riprova dopo 14 giorni
if (!modalitaComuni && !modalitaLocali) elenco = [...elenco].sort((a, b) => (stato.fonti[a.url]?.ultima ?? '').localeCompare(stato.fonti[b.url]?.ultima ?? '')).slice(0, MAX_FONTI);

// Prima di cominciare: il modello risponde? Se no, ci si ferma subito con un messaggio chiaro.
if (!simula && !args.includes('--prompt')) {
  if (!CHIAVE) { console.error('ERRORE: manca il segreto FREELLMAPI_KEY.'); process.exit(1); }
  try {
    const r = await fetch(`${BASE}/models`, { headers: { Authorization: `Bearer ${CHIAVE}` }, signal: AbortSignal.timeout(20000) });
    console.log(`Collegamento a ${BASE}: HTTP ${r.status}${r.ok ? ' (ok)' : ''}`);
    if (r.status === 401 || r.status === 403) { console.error('ERRORE: la chiave è stata rifiutata (401/403). Controlla FREELLMAPI_KEY.'); process.exit(1); }
  } catch (e) {
    console.error(`ERRORE: ${BASE} non risponde (${String(e.message ?? e).slice(0, 80)}). Controlla FREELLMAPI_URL.`);
    process.exit(1);
  }
}

const blocchi = [];
const resoconto = [`Giro del ${OGGI}: ${elenco.length} fonti, modello ${simula ? 'simulato' : MODELLO}, ${CONCORRENZA} in parallelo.`];
let fermato = false; // diventa true se la chiave o l'indirizzo non funzionano: inutile continuare

// Lavora UNA fonte e restituisce le righe del resoconto e i blocchi trovati (così le fonti in parallelo non si mescolano).
async function lavora(fonte) {
  const righe = [];
  const nuovi = [];
  const precedente = stato.fonti[fonte.url]?.falliti ?? 0;
  const riga = { ultima: OGGI, eventi: 0, esito: '', falliti: precedente + 1 }; // si azzera solo se la pagina dà un risultato
  let hashNuovo = null;
  const chiudi = () => {
    if (fonte.codiceLocale) {
      const prec = statoLocali[fonte.codiceLocale] ?? {};
      statoLocali[fonte.codiceLocale] = { ultima: OGGI, esito: riga.esito === 'invariata' ? (prec.esito ?? 'nessun-evento') : riga.esito.startsWith('ok') ? (nuovi.length ? 'eventi' : 'nessun-evento') : 'illeggibile', eventi: riga.esito === 'invariata' ? (prec.eventi ?? 0) : nuovi.length, hash: hashNuovo ?? prec.hash };
    }
    if (!fonte.codiceComune && !fonte.codiceLocale) stato.fonti[fonte.url] = riga;
    if (fonte.codiceComune) {
      const letto = riga.esito.startsWith('ok');
      if (riga.esito === 'invariata') progresso.fatti[fonte.codiceComune] = { ...(progresso.fatti[fonte.codiceComune] ?? { esito: 'nessun-evento', eventi: 0 }), data: OGGI };
      else progresso.fatti[fonte.codiceComune] = { data: OGGI, esito: !letto ? 'fonti-illeggibili' : nuovi.length ? 'eventi' : 'nessun-evento', eventi: nuovi.length, ...(letto ? {} : { motivo: riga.esito.slice(0, 50) }) };
    }
    return { righe, nuovi };
  };
  try {
    let html, urlFinale = fonte.url;
    if (fonte.pagineDirette) html = undefined; // post già letti (Instagram): niente da scaricare
    else if (htmlLocale) html = readFileSync(htmlLocale, 'utf8');
    else {
      const s = await scarica(fonte.url);
      if (s.errore) { riga.esito = 'non letta: ' + s.errore; righe.push(`  --  ${fonte.nome}: ${riga.esito}`); return chiudi(); }
      html = s.html; urlFinale = s.urlFinale;
    }
    const pagine = fonte.pagineDirette ?? [{ url: normUrl(fonte.url), testo: htmlInTesto(html).slice(0, MAX_TESTO) }];
    if (fonte.dettagli && !htmlLocale && html) {
      for (const link of linkDettaglio(html, urlFinale).slice(0, MAX_DETTAGLI)) {
        await pausa(1200);
        const d = await scarica(link);
        if (!d.errore) pagine.push({ url: link, testo: htmlInTesto(d.html).slice(0, MAX_TESTO_DETTAGLIO) });
      }
    }
    if (!fonte.pagineDirette && pagine[0].testo.length < 200) { riga.esito = 'pagina vuota (probabile contenuto caricato con JavaScript)'; righe.push(`  --  ${fonte.nome}: ${riga.esito}`); return chiudi(); }
    // Ricontrollo giornaliero: se la pagina (e l'elenco delle sue schede) non è cambiata dall'ultima volta, non serve chiedere niente al modello.
    if (fonte.codiceComune || fonte.codiceLocale) {
      const schede = fonte.dettagli && !htmlLocale && html ? linkDettaglio(html, urlFinale).slice(0, MAX_DETTAGLI) : [];
      hashNuovo = createHash('sha1').update(fonte.pagineDirette ? pagine.map((p) => p.testo).join('\n') : pagine[0].testo + '\n' + schede.join('\n')).digest('hex').slice(0, 16);
      if (process.env.DEBUG_HASH) console.log('hash', hashNuovo);
      if (fonte.hash && hashNuovo === fonte.hash) {
        riga.esito = 'invariata';
        righe.push(`  =    ${fonte.nome}: invariata (nessuna richiesta al modello)`);
        if (fonte.codiceComune) paginComuni[fonte.codiceComune] = { url: fonte.url, hash: hashNuovo };
        return chiudi();
      }
    }

    const mappa = new Map(pagine.map((p) => [normUrl(p.url), p.testo]));
    if (args.includes('--prompt')) { console.log(costruisciPrompt(pagine, fonte.hint ?? '')); process.exit(0); }
    const risposta = await chiediAlModello(costruisciPrompt(pagine, fonte.hint ?? ''));
    const trovati = Array.isArray(risposta.eventi) ? risposta.eventi : [];
    let buoni = 0;
    for (const e of trovati) {
      if (fonte.locale) { e.luogo = fonte.locale.nome; e.comune = fonte.locale.comune; e.provincia = fonte.locale.sigla; e.organizzatore = fonte.locale.nome; }
      const motivi = controlla(e, mappa, !!fonte.locale);
      if (motivi.length) { righe.push(`  KO   ${String(e.titolo ?? '?').slice(0, 55)} → ${motivi.join('; ')}`); continue; }
      const campo = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
      nuovi.push([
        `titolo: ${campo(e.titolo)}`, `categoria: ${campo(e.categoria)}`, `comune: ${campo(e.comune)}`, `provincia: ${campo(e.provincia)}`,
        `luogo: ${campo(e.luogo)}`, `indirizzo: ${campo(fonte.locale?.indirizzo || e.indirizzo)}`, `inizio: ${campo(e.inizio)}`, `fine: ${campo(e.fine)}`,
        `descrizione: ${campo(e.descrizione)}`, `prezzo: ${campo(e.prezzo)}`, `organizzatore: ${campo(e.organizzatore)}`,
        `fonte_url: ${campo(e.fonte_url)}`, `fonte_nome: ${campo(fonte.nome)}`, `fonte_tipo: ${fonte.tipo ?? 'aggregatore'}`,
        ...(fonte.locale && Number.isFinite(fonte.locale.lat) ? [`lat: ${fonte.locale.lat}`, `lon: ${fonte.locale.lon}`] : []),
      ].join('\n'));
      buoni++;
    }
    riga.eventi = buoni;
    if (fonte.codiceComune && hashNuovo) paginComuni[fonte.codiceComune] = { url: fonte.url, hash: hashNuovo };
    riga.falliti = 0; // la pagina ha risposto e il modello ha lavorato: non è «rotta», anche se oggi non ha eventi
    riga.esito = `ok: ${trovati.length} proposti, ${buoni} superano il controllo`;
    righe.push(`  ok   ${fonte.nome}: ${riga.esito}`);
  } catch (err) {
    riga.esito = 'errore: ' + String(err.message ?? err).slice(0, 100);
    righe.push(`  !!   ${fonte.nome}: ${riga.esito}`);
    if (/FREELLMAPI_KEY|raggiungibile|HTTP 401|HTTP 403/.test(riga.esito)) fermato = true;
  }
  return chiudi();
}

let prossima = 0;
let saltateTempo = 0;
const risultati = [];
async function operaio() {
  while (!fermato && prossima < elenco.length) {
    if (Date.now() - INIZIO > BUDGET_MS) { saltateTempo = elenco.length - prossima; return; }
    const fonte = elenco[prossima++];
    console.log(`[${Math.round((Date.now() - INIZIO) / 1000)} s] ${fonte.nome}`);
    risultati.push(await lavora(fonte));
    if (!simula) await pausa(2000);
  }
}
await Promise.all(Array.from({ length: CONCORRENZA }, () => operaio()));
for (const r of risultati) { resoconto.push(...r.righe); blocchi.push(...r.nuovi); }
if (saltateTempo) resoconto.push(`  ..   tempo a disposizione finito: ${saltateTempo} pagine saranno lette al prossimo giro`);
const invariate = risultati.filter((r) => r.righe.some((l) => l.includes('invariata'))).length;
resoconto.push(`Riepilogo: ${risultati.length} pagine lavorate (${invariate} invariate, senza chiamate al modello), ${blocchi.length} eventi superano il controllo.`);

if (prova) {
  console.log(`\n--- PROVA: ${blocchi.length} eventi superano il controllo (non scritti) ---\n${blocchi.join('\n\n')}\n`);
  console.log('=== ESITO PER FONTE ===\n' + resoconto.join('\n'));
  process.exit(0);
}
console.log('=== ESITO PER FONTE ===\n' + resoconto.join('\n'));
writeFileSync(fileStato, JSON.stringify(stato, null, 1) + '\n');
if (modalitaLocali) writeFileSync(fileStatoLocali, JSON.stringify(statoLocali) + '\n');
if (modalitaComuni) {
  writeFileSync(fileProgresso, JSON.stringify(progresso, null, 1) + '\n');
  writeFileSync(filePagine, JSON.stringify(paginComuni) + '\n');
}
if (blocchi.length) {
  mkdirSync('ricerca/consegne', { recursive: true });
  const nomeFile = `ricerca/consegne/auto-${OGGI}-${new Date().toISOString().slice(11, 16).replace(':', '')}.txt`;
  writeFileSync(nomeFile, blocchi.join('\n\n') + '\n');
  const r = spawnSync('node', ['scripts/importa-consegna.mjs', nomeFile], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
} else {
  console.log('Nessun evento nuovo in questo giro.');
}
