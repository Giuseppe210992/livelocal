// Ponte tra la chat (connettore MCP) o un link e le ricerche automatiche di LiveLocal.
// Si incolla in un Cloudflare Worker (gratuito). Risponde direttamente, senza reindirizzamenti.
//
// Variabili (da impostare come «Secret» nel Worker, mai nel testo):
//   GITHUB_TOKEN   token GitHub con i soli permessi «Actions» e «Variables» (lettura e scrittura) su livelocal
//   SEGRETO        frase lunga scelta da te: si scrive nell'indirizzo come  ?chiave=LA_TUA_FRASE
//
// Due modi di usarlo:
//  1) Link nel browser:   https://NOME.UTENTE.workers.dev/?chiave=FRASE&cmd=comuni&quanti=40   (cmd = comuni | fonti | stato)
//  2) Connettore MCP nella chat:   https://NOME.UTENTE.workers.dev/?chiave=FRASE
//     Strumenti: avvia_ricerca_comuni, avvia_ricerca_locali, avvia_lettura_fonti, stato_ricerche, leggi_impostazioni, imposta_impostazione.
//
// Una ricerca non parte se la stessa è già in coda o in corso. Le ricerche pubblicano solo eventi che superano i controlli
// (formato, date, doppioni, contatti privati) e solo se il sito si costruisce senza errori.

const REPO = 'Giuseppe210992/livelocal';
const FLUSSI = { comuni: 'estrai-comuni.yml', fonti: 'estrai-eventi.yml', locali: 'estrai-locali.yml' };

const TESTO = (t, stato = 200) => new Response(t, { status: stato, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
const JSON_R = (o, stato = 200) => new Response(JSON.stringify(o), { status: stato, headers: { 'Content-Type': 'application/json' } });

function gh(env, percorso, opzioni = {}) {
  return fetch('https://api.github.com/repos/' + REPO + percorso, {
    ...opzioni,
    headers: { Authorization: 'Bearer ' + env.GITHUB_TOKEN, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'livelocal-avvio', ...(opzioni.headers || {}) },
  });
}

async function stato(env) {
  const righe = [];
  for (const nome of Object.keys(FLUSSI)) {
    const r = await gh(env, '/actions/workflows/' + FLUSSI[nome] + '/runs?per_page=3');
    if (!r.ok) { righe.push(nome + ': errore ' + r.status); continue; }
    const corse = (await r.json()).workflow_runs || [];
    righe.push(nome + ': ' + (corse.map((c) => (c.conclusion || c.status) + ' (' + c.created_at.slice(5, 16).replace('T', ' ') + ')').join(', ') || 'nessun giro'));
  }
  return righe.join('\n');
}

async function avvia(env, cmd, quantiGrezzo) {
  const file = FLUSSI[cmd];
  if (!file) return { ok: false, testo: 'Comando sconosciuto. Usa comuni, fonti, locali o stato.' };
  const gia = await gh(env, '/actions/workflows/' + file + '/runs?per_page=5');
  if (gia.ok) {
    const attivi = ((await gia.json()).workflow_runs || []).filter((c) => c.status === 'queued' || c.status === 'in_progress');
    if (attivi.length) return { ok: false, testo: 'Questa ricerca è già in coda o in corso (' + attivi[0].status + '): aspetta che finisca.' };
  }
  const quanti = Math.max(1, Math.min(120, Number(quantiGrezzo || (cmd === 'comuni' ? 30 : cmd === 'locali' ? 80 : 60)) || 30));
  const inputs = cmd === 'fonti' ? { prova: 'false', max: String(quanti) } : { prova: 'false', quanti: String(quanti) };
  const r = await gh(env, '/actions/workflows/' + file + '/dispatches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: 'main', inputs }) });
  if (r.status === 204) return { ok: true, testo: 'Avviato: ' + cmd + ' (' + quanti + '). Se non ci sono duplicati o errori, gli eventi vanno online da soli in circa 15-40 minuti.' };
  return { ok: false, testo: 'GitHub ha risposto ' + r.status + ': ' + (await r.text()).slice(0, 160) };
}

// Impostazioni delle ricerche automatiche: sono variabili del repository GitHub, lette dalle Action a ogni giro.
// Il token deve avere il permesso «Variables: lettura e scrittura» sul repository.
const IMPOSTAZIONI = {
  ATTIVO: { tipo: 'bool', predefinito: 'true', desc: 'true = ricerche programmate attive, false = sospese (restano possibili gli avvii a mano)' },
  ORE_COMUNI: { min: 1, max: 24, predefinito: '3', desc: 'ogni quante ore parte il giro dei comuni' },
  ORE_LOCALI: { min: 1, max: 24, predefinito: '3', desc: 'ogni quante ore parte il giro dei locali (pub, bar, club)' },
  ORE_FONTI: { min: 1, max: 24, predefinito: '6', desc: 'ogni quante ore parte la rilettura delle pagine fisse (teatri, musei, Comuni)' },
  COMUNI_PER_GIRO: { min: 10, max: 400, predefinito: '240', desc: 'quanti comuni per giro' },
  LOCALI_PER_GIRO: { min: 10, max: 200, predefinito: '80', desc: 'quanti locali per giro' },
  FONTI_PER_GIRO: { min: 5, max: 120, predefinito: '60', desc: 'quante pagine fisse per giro' },
  BUDGET_MINUTI: { min: 20, max: 150, predefinito: '100', desc: 'tempo massimo di ogni giro, in minuti' },
};

async function leggiImpostazioni(env) {
  const r = await gh(env, '/actions/variables?per_page=100');
  if (!r.ok) return { ok: false, testo: 'GitHub ha risposto ' + r.status + ' (al token serve il permesso «Variables: Read and write»).' };
  const attuali = Object.fromEntries(((await r.json()).variables || []).map((v) => [v.name, v.value]));
  const righe = Object.entries(IMPOSTAZIONI).map(([n, d]) => n + ' = ' + (attuali[n] ?? d.predefinito + ' (predefinito)') + ' — ' + d.desc);
  return { ok: true, testo: righe.join('\n') };
}

async function impostaImpostazione(env, nome, valoreGrezzo) {
  const def = IMPOSTAZIONI[nome];
  if (!def) return { ok: false, testo: 'Impostazione sconosciuta. Quelle ammesse: ' + Object.keys(IMPOSTAZIONI).join(', ') + '.' };
  let valore = String(valoreGrezzo ?? '').trim().toLowerCase();
  if (def.tipo === 'bool') {
    if (!['true', 'false'].includes(valore)) return { ok: false, testo: nome + ' accetta solo true o false.' };
  } else {
    const n = Number(valore);
    if (!Number.isInteger(n) || n < def.min || n > def.max) return { ok: false, testo: nome + ' deve essere un numero intero tra ' + def.min + ' e ' + def.max + '.' };
    valore = String(n);
  }
  let r = await gh(env, '/actions/variables/' + nome, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nome, value: valore }) });
  if (r.status === 404) r = await gh(env, '/actions/variables', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: nome, value: valore }) });
  if (r.status === 204 || r.status === 201) return { ok: true, testo: 'Impostato ' + nome + ' = ' + valore + '. Vale dal prossimo giro automatico.' };
  return { ok: false, testo: 'GitHub ha risposto ' + r.status + ': ' + (await r.text()).slice(0, 140) + ' (al token serve il permesso «Variables: Read and write»).' };
}

const STRUMENTI = [
  { name: 'avvia_ricerca_comuni', description: 'Avvia su GitHub la ricerca automatica degli eventi dei comuni con più di 10.000 abitanti non ancora controllati. Gli eventi con errori o doppioni vengono scartati e gli altri vanno online da soli se il sito si costruisce senza errori. Non parte se una ricerca uguale è già in corso.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quanti comuni controllare in questo giro (predefinito 30).' } } },
    annotations: { title: 'Avvia ricerca eventi dei comuni', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true } },
  { name: 'avvia_lettura_fonti', description: 'Avvia su GitHub la rilettura delle pagine fisse di eventi già note (teatri, musei, Comuni). Stessi controlli: errori e doppioni scartati, pubblicazione solo se il sito si costruisce.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quante pagine leggere (predefinito 60).' } } },
    annotations: { title: 'Avvia lettura delle fonti fisse', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true } },
  { name: 'avvia_ricerca_locali', description: 'Avvia su GitHub la ricerca degli eventi di pub, bar, club e locali con musica dal vivo (post Instagram professionali e pagine eventi dei siti). Stessi controlli su errori e doppioni. Non parte se una ricerca uguale è già in corso.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quanti locali controllare in questo giro (predefinito 80).' } } },
    annotations: { title: 'Avvia ricerca eventi dei locali', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true } },
  { name: 'leggi_impostazioni', description: 'Mostra le impostazioni delle ricerche automatiche (ogni quante ore parte ogni giro, quanti comuni e locali per giro, tempo massimo, ricerche attive o sospese).',
    inputSchema: { type: 'object', properties: {} },
    annotations: { title: 'Leggi le impostazioni delle ricerche', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } },
  { name: 'imposta_impostazione', description: 'Cambia UNA impostazione delle ricerche automatiche. Nomi ammessi: ATTIVO (true/false), ORE_COMUNI, ORE_LOCALI, ORE_FONTI (1-24), COMUNI_PER_GIRO (10-400), LOCALI_PER_GIRO (10-200), FONTI_PER_GIRO (5-120), BUDGET_MINUTI (20-150). Vale dal prossimo giro.',
    inputSchema: { type: 'object', properties: { nome: { type: 'string', description: 'Nome dell\'impostazione, per esempio ORE_COMUNI.' }, valore: { type: 'string', description: 'Nuovo valore, per esempio 6 oppure false.' } }, required: ['nome', 'valore'] },
    annotations: { title: 'Cambia un\'impostazione delle ricerche', readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true } },
  { name: 'stato_ricerche', description: 'Dice come sono andati gli ultimi giri di ricerca (riusciti, falliti, in corso). Non avvia niente.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { title: 'Stato delle ricerche', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true } },
];

async function mcp(env, msg) {
  const id = msg.id;
  if (id === undefined || id === null) return null; // notifica: nessuna risposta
  const ok = (result) => ({ jsonrpc: '2.0', id, result });
  const errore = (code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });
  switch (msg.method) {
    case 'initialize':
      return ok({ protocolVersion: (msg.params && msg.params.protocolVersion) || '2025-03-26', capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'livelocal-avvio', version: '1.0.0' },
        instructions: "Strumenti per avviare le ricerche automatiche di eventi di LiveLocal. Prima di avviare una ricerca chiama stato_ricerche per vedere se ce n'è già una in corso." });
    case 'ping': return ok({});
    case 'tools/list': return ok({ tools: STRUMENTI });
    case 'tools/call': {
      const nome = msg.params && msg.params.name;
      const arg = (msg.params && msg.params.arguments) || {};
      if (nome === 'stato_ricerche') return ok({ content: [{ type: 'text', text: await stato(env) }], isError: false });
      if (nome === 'leggi_impostazioni') { const r = await leggiImpostazioni(env); return ok({ content: [{ type: 'text', text: r.testo }], isError: !r.ok }); }
      if (nome === 'imposta_impostazione') { const r = await impostaImpostazione(env, String(arg.nome ?? '').toUpperCase(), arg.valore); return ok({ content: [{ type: 'text', text: r.testo }], isError: !r.ok }); }
      if (nome === 'avvia_ricerca_comuni' || nome === 'avvia_lettura_fonti' || nome === 'avvia_ricerca_locali') {
        const r = await avvia(env, nome === 'avvia_ricerca_comuni' ? 'comuni' : nome === 'avvia_ricerca_locali' ? 'locali' : 'fonti', arg.quanti);
        return ok({ content: [{ type: 'text', text: r.testo }], isError: !r.ok });
      }
      return errore(-32602, 'Strumento sconosciuto: ' + nome);
    }
    default: return errore(-32601, 'Metodo non supportato: ' + msg.method);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!env.SEGRETO || url.searchParams.get('chiave') !== env.SEGRETO) return JSON_R({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Chiave errata.' } }, 401);

    if (request.method === 'POST') {
      let corpo;
      try { corpo = await request.json(); } catch { return JSON_R({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'JSON non valido.' } }, 400); }
      if (Array.isArray(corpo)) {
        const risposte = (await Promise.all(corpo.map((m) => mcp(env, m)))).filter(Boolean);
        return risposte.length ? JSON_R(risposte) : new Response(null, { status: 202 });
      }
      const r = await mcp(env, corpo);
      return r ? JSON_R(r) : new Response(null, { status: 202 });
    }

    if (request.method === 'GET') {
      const cmd = url.searchParams.get('cmd');
      if (!cmd && (request.headers.get('Accept') || '').includes('text/event-stream')) return new Response('Questo server non apre flussi.', { status: 405, headers: { Allow: 'POST, GET' } });
      if (!cmd || cmd === 'stato') return TESTO(await stato(env));
      return TESTO((await avvia(env, cmd, url.searchParams.get('quanti'))).testo);
    }
    if (request.method === 'DELETE') return new Response(null, { status: 405, headers: { Allow: 'POST, GET' } });
    return new Response('Metodo non supportato', { status: 405 });
  },
};
