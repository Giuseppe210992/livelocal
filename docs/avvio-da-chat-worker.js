// Ponte tra la chat (connettore MCP) o un link e le ricerche automatiche di LiveLocal.
// Si incolla in un Cloudflare Worker (gratuito). Risponde direttamente, senza reindirizzamenti.
//
// Variabili (da impostare come «Secret» nel Worker, mai nel testo):
//   GITHUB_TOKEN   token GitHub con il solo permesso «Actions: lettura e scrittura» su livelocal
//   SEGRETO        frase lunga scelta da te: si scrive nell'indirizzo come  ?chiave=LA_TUA_FRASE
//
// Due modi di usarlo:
//  1) Link nel browser:   https://NOME.UTENTE.workers.dev/?chiave=FRASE&cmd=comuni&quanti=40   (cmd = comuni | fonti | stato)
//  2) Connettore MCP nella chat:   https://NOME.UTENTE.workers.dev/?chiave=FRASE
//     Strumenti: avvia_ricerca_comuni, avvia_lettura_fonti, stato_ricerche.
//
// Una ricerca non parte se la stessa è già in coda o in corso. Le ricerche pubblicano solo eventi che superano i controlli
// (formato, date, doppioni, contatti privati) e solo se il sito si costruisce senza errori.

const REPO = 'Giuseppe210992/livelocal';
const FLUSSI = { comuni: 'estrai-comuni.yml', fonti: 'estrai-eventi.yml' };

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
  if (!file) return { ok: false, testo: 'Comando sconosciuto. Usa comuni, fonti o stato.' };
  const gia = await gh(env, '/actions/workflows/' + file + '/runs?per_page=5');
  if (gia.ok) {
    const attivi = ((await gia.json()).workflow_runs || []).filter((c) => c.status === 'queued' || c.status === 'in_progress');
    if (attivi.length) return { ok: false, testo: 'Questa ricerca è già in coda o in corso (' + attivi[0].status + '): aspetta che finisca.' };
  }
  const quanti = Math.max(1, Math.min(120, Number(quantiGrezzo || (cmd === 'comuni' ? 30 : 60)) || 30));
  const inputs = cmd === 'comuni' ? { prova: 'false', quanti: String(quanti) } : { prova: 'false', max: String(quanti) };
  const r = await gh(env, '/actions/workflows/' + file + '/dispatches', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ref: 'main', inputs }) });
  if (r.status === 204) return { ok: true, testo: 'Avviato: ' + cmd + ' (' + quanti + '). Se non ci sono duplicati o errori, gli eventi vanno online da soli in circa 15-40 minuti.' };
  return { ok: false, testo: 'GitHub ha risposto ' + r.status + ': ' + (await r.text()).slice(0, 160) };
}

const STRUMENTI = [
  { name: 'avvia_ricerca_comuni', description: 'Avvia su GitHub la ricerca automatica degli eventi dei comuni con più di 10.000 abitanti non ancora controllati. Gli eventi con errori o doppioni vengono scartati e gli altri vanno online da soli se il sito si costruisce senza errori. Non parte se una ricerca uguale è già in corso.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quanti comuni controllare in questo giro (predefinito 30).' } } },
    annotations: { title: 'Avvia ricerca eventi dei comuni', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true } },
  { name: 'avvia_lettura_fonti', description: 'Avvia su GitHub la rilettura delle pagine fisse di eventi già note (teatri, musei, Comuni). Stessi controlli: errori e doppioni scartati, pubblicazione solo se il sito si costruisce.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quante pagine leggere (predefinito 60).' } } },
    annotations: { title: 'Avvia lettura delle fonti fisse', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true } },
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
      if (nome === 'avvia_ricerca_comuni' || nome === 'avvia_lettura_fonti') {
        const r = await avvia(env, nome === 'avvia_ricerca_comuni' ? 'comuni' : 'fonti', arg.quanti);
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
