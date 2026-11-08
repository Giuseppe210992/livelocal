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
function costruisciPrompt(pagine) {
  const testo = pagine.map((p, i) => `=== PAGINA ${i + 1}: ${p.url}\n${p.testo}`).join('\n\n');
  return `Oggi è ${OGGI}. Estrai gli eventi pubblici in luogo fisico, aperti al pubblico, che iniziano da oggi in poi, dalle pagine qui sotto. Usa SOLO ciò che è scritto nelle pagine.

Regole:
- Un evento si scrive solo se la pagina riporta già la data di inizio (con giorno e mese) e un luogo preciso (un posto con un nome; «Centro storico» va bene). Altrimenti saltalo. Mai dedurre date da «ogni sabato» o simili, mai indovinare.
- Compila "citazione_data" e "citazione_luogo" COPIANDO ESATTAMENTE dal testo della pagina (stessi caratteri) la frase in cui sono scritti. Se non puoi citarli, non scrivere l'evento.
- "fonte_url" è l'indirizzo della PAGINA da cui hai letto l'evento (uno di quelli indicati).
- Se la pagina riporta l'ora, scrivila in inizio (e in fine se c'è). Prezzo: «gratuito» se è scritto gratuito o ingresso libero; «12 euro» se c'è l'importo; altrimenti «non indicato». L'organizzatore è chi organizza (ente, associazione, compagnia), non chi ospita né chi patrocina; se non c'è, stringa vuota.
- "descrizione": 100-300 caratteri, tua, solo fatti letti (tema, ospiti, tipo di evento), senza ipotesi, senza ripetere il titolo.
- "titolo" e "luogo" in maiuscole e minuscole normali (non tutto in maiuscolo), senza virgolette attorno al titolo e senza articoli iniziali nel luogo (scrivi «Auditorium Norma Cossetto», non «ALL'AUDITORIUM NORMA COSSETTO»). Le citazioni invece vanno copiate identiche alla pagina.
- Mai telefoni, email, nomi di privati o contatti in nessun campo.
- categoria: una sola tra ${categorie.join(', ')}.
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
function controlla(e, mappaTesti) {
  const motivi = [];
  for (const k of ['titolo', 'categoria', 'comune', 'luogo', 'inizio', 'descrizione', 'fonte_url', 'citazione_data', 'citazione_luogo']) if (!e[k] || !String(e[k]).trim()) motivi.push('manca ' + k);
  if (motivi.length) return motivi;
  const testo = mappaTesti.get(normUrl(e.fonte_url));
  if (!testo) return ['fonte_url non è una delle pagine lette'];
  // Confronto senza punteggiatura, accenti e maiuscole: conta che le PAROLE siano quelle della pagina, nello stesso ordine.
  const nz = (s) => ' ' + norm(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
  const tt = nz(testo);
  if (!tt.includes(nz(e.citazione_data))) motivi.push('citazione della data non presente nella pagina');
  if (!tt.includes(nz(e.citazione_luogo))) motivi.push('citazione del luogo non presente nella pagina');
  const t = norm(testo);
  if (!dataCoerente(String(e.inizio), e.citazione_data)) motivi.push('la data non coincide con la citazione');
  const paroleLuogo = norm(e.luogo).split(/[^a-z0-9]+/).filter((p) => p.length >= 5);
  if (paroleLuogo.length && !paroleLuogo.some((p) => t.includes(p))) motivi.push('il luogo non compare nella pagina');
  const paroleTitolo = norm(e.titolo).split(/[^a-z0-9]+/).filter((p) => p.length >= 4);
  if (paroleTitolo.length && paroleTitolo.filter((p) => t.includes(p)).length < Math.ceil(paroleTitolo.length * 0.6)) motivi.push('il titolo non compare nella pagina');
  return motivi;
}

// ---------- 4) Giro ----------
const fileFonti = 'ricerca/fonti-automatiche.json';
const fileStato = 'ricerca/automazione-stato.json';
const stato = existsSync(fileStato) ? JSON.parse(readFileSync(fileStato, 'utf8')) : { _nota: 'Generato da scripts/estrai-eventi-ia.mjs: ultimo giro per ogni fonte.', fonti: {} };

let elenco;
if (htmlLocale) elenco = [{ url: urlLocale, nome: 'Pagina di prova', tipo: 'ufficiale', dettagli: false }];
else elenco = JSON.parse(readFileSync(fileFonti, 'utf8')).fonti;
const ROTTA_DA_GIORNI = 14;
const giorniFa = (d) => (Date.now() - new Date(d || '2000-01-01').getTime()) / 86400000;
elenco = elenco.filter((f) => { const s = stato.fonti[f.url]; return !(s && (s.falliti ?? 0) >= 3 && giorniFa(s.ultima) < ROTTA_DA_GIORNI); }); // pagine che falliscono da 3 giri: si riprova dopo 14 giorni
elenco = [...elenco].sort((a, b) => (stato.fonti[a.url]?.ultima ?? '').localeCompare(stato.fonti[b.url]?.ultima ?? '')).slice(0, MAX_FONTI);

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
  const chiudi = () => { stato.fonti[fonte.url] = riga; return { righe, nuovi }; };
  try {
    let html, urlFinale = fonte.url;
    if (htmlLocale) html = readFileSync(htmlLocale, 'utf8');
    else {
      const s = await scarica(fonte.url);
      if (s.errore) { riga.esito = 'non letta: ' + s.errore; righe.push(`  --  ${fonte.nome}: ${riga.esito}`); return chiudi(); }
      html = s.html; urlFinale = s.urlFinale;
    }
    const pagine = [{ url: normUrl(fonte.url), testo: htmlInTesto(html).slice(0, MAX_TESTO) }];
    if (fonte.dettagli && !htmlLocale) {
      for (const link of linkDettaglio(html, urlFinale).slice(0, MAX_DETTAGLI)) {
        await pausa(1200);
        const d = await scarica(link);
        if (!d.errore) pagine.push({ url: link, testo: htmlInTesto(d.html).slice(0, MAX_TESTO_DETTAGLIO) });
      }
    }
    if (pagine[0].testo.length < 200) { riga.esito = 'pagina vuota (probabile contenuto caricato con JavaScript)'; righe.push(`  --  ${fonte.nome}: ${riga.esito}`); return chiudi(); }

    const mappa = new Map(pagine.map((p) => [normUrl(p.url), p.testo]));
    if (args.includes('--prompt')) { console.log(costruisciPrompt(pagine)); process.exit(0); }
    const risposta = await chiediAlModello(costruisciPrompt(pagine));
    const trovati = Array.isArray(risposta.eventi) ? risposta.eventi : [];
    let buoni = 0;
    for (const e of trovati) {
      const motivi = controlla(e, mappa);
      if (motivi.length) { righe.push(`  KO   ${String(e.titolo ?? '?').slice(0, 55)} → ${motivi.join('; ')}`); continue; }
      const campo = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
      nuovi.push([
        `titolo: ${campo(e.titolo)}`, `categoria: ${campo(e.categoria)}`, `comune: ${campo(e.comune)}`, `provincia: ${campo(e.provincia)}`,
        `luogo: ${campo(e.luogo)}`, `indirizzo: ${campo(e.indirizzo)}`, `inizio: ${campo(e.inizio)}`, `fine: ${campo(e.fine)}`,
        `descrizione: ${campo(e.descrizione)}`, `prezzo: ${campo(e.prezzo)}`, `organizzatore: ${campo(e.organizzatore)}`,
        `fonte_url: ${campo(e.fonte_url)}`, `fonte_nome: ${campo(fonte.nome)}`, `fonte_tipo: ${fonte.tipo ?? 'aggregatore'}`,
      ].join('\n'));
      buoni++;
    }
    riga.eventi = buoni;
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
resoconto.push(`Riepilogo: ${risultati.length} pagine lavorate, ${blocchi.length} eventi superano il controllo.`);

console.log(resoconto.join('\n'));
if (prova) {
  console.log(`\n--- PROVA: ${blocchi.length} eventi superano il controllo (non scritti) ---\n${blocchi.join('\n\n')}`);
  process.exit(0);
}
writeFileSync(fileStato, JSON.stringify(stato, null, 1) + '\n');
if (blocchi.length) {
  mkdirSync('ricerca/consegne', { recursive: true });
  const nomeFile = `ricerca/consegne/auto-${OGGI}-${new Date().toISOString().slice(11, 16).replace(':', '')}.txt`;
  writeFileSync(nomeFile, blocchi.join('\n\n') + '\n');
  const r = spawnSync('node', ['scripts/importa-consegna.mjs', nomeFile], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
} else {
  console.log('Nessun evento nuovo in questo giro.');
}
