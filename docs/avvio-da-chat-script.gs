// Ponte tra una chat (o un link) e le ricerche automatiche di LiveLocal.
// Si incolla in Google Apps Script (script.google.com) e si pubblica come «App web».
//
// DUE MODI DI USARLO
//  1) Link nel browser:   .../exec?chiave=LA_TUA_FRASE&cmd=comuni&quanti=40
//  2) Connettore MCP nella chat (Impostazioni → Connettori → Aggiungi connettore):
//     indirizzo  .../exec?chiave=LA_TUA_FRASE
//     La chat vede tre strumenti: avvia_ricerca_comuni, avvia_lettura_fonti, stato_ricerche.
//
// Comandi (parametro cmd, solo per il modo 1):
//   comuni   avvia la ricerca dei comuni da 10.000 abitanti non ancora fatti   (quanti = 1-120, predefinito 30)
//   fonti    avvia la lettura delle pagine fisse di ricerca/fonti-automatiche.json (quanti = 1-120, predefinito 60)
//   stato    dice come sono andate le ultime ricerche (non avvia niente)
//
// Sicurezza: serve la «chiave» (una frase lunga che scegli tu, salvata nelle Proprietà dello script, mai nel testo).
// Il token GitHub (permesso solo «Actions: lettura e scrittura» sul repository livelocal) sta nelle Proprietà dello script.
// Un solo avvio ogni 5 minuti. Le ricerche pubblicano solo eventi che superano i controlli (formato, date, doppioni,
// contatti privati) e solo se il sito si costruisce senza errori.

const REPO = 'Giuseppe210992/livelocal';
const FLUSSI = { comuni: 'estrai-comuni.yml', fonti: 'estrai-eventi.yml' };

function risposta(testo) {
  return ContentService.createTextOutput(testo).setMimeType(ContentService.MimeType.TEXT);
}
function rispostaJson(oggetto) {
  return ContentService.createTextOutput(JSON.stringify(oggetto)).setMimeType(ContentService.MimeType.JSON);
}
function chiaveGiusta(par) {
  const segreto = PropertiesService.getScriptProperties().getProperty('SEGRETO');
  return !!segreto && par.chiave === segreto;
}

function gh(percorso, opzioni) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  return UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + percorso, Object.assign({
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'livelocal-avvio' },
    muteHttpExceptions: true,
  }, opzioni || {}));
}

// ---- Le due azioni: leggono lo stato o avviano un giro ----
function stato() {
  const righe = [];
  for (const nome of Object.keys(FLUSSI)) {
    const r = gh('/actions/workflows/' + FLUSSI[nome] + '/runs?per_page=3');
    if (r.getResponseCode() !== 200) { righe.push(nome + ': errore ' + r.getResponseCode()); continue; }
    const corse = JSON.parse(r.getContentText()).workflow_runs || [];
    righe.push(nome + ': ' + (corse.map(function (c) { return (c.conclusion || c.status) + ' (' + c.created_at.slice(5, 16).replace('T', ' ') + ')'; }).join(', ') || 'nessun giro'));
  }
  return righe.join('\n');
}

function avvia(cmd, quantiGrezzo) {
  const file = FLUSSI[cmd];
  if (!file) return { ok: false, testo: 'Comando sconosciuto. Usa comuni, fonti o stato.' };
  const cache = CacheService.getScriptCache();
  if (cache.get('ultimo-avvio')) return { ok: false, testo: 'Un avvio è già partito da meno di 5 minuti: aspetta.' };
  const quanti = Math.max(1, Math.min(120, Number(quantiGrezzo || (cmd === 'comuni' ? 30 : 60)) || 30));
  const inputs = cmd === 'comuni' ? { prova: 'false', quanti: String(quanti) } : { prova: 'false', max: String(quanti) };
  const r = gh('/actions/workflows/' + file + '/dispatches', {
    method: 'post', contentType: 'application/json', payload: JSON.stringify({ ref: 'main', inputs: inputs }),
  });
  if (r.getResponseCode() === 204) {
    cache.put('ultimo-avvio', '1', 300);
    return { ok: true, testo: 'Avviato: ' + cmd + ' (' + quanti + '). Se non ci sono duplicati o errori, gli eventi vanno online da soli in circa 15-40 minuti.' };
  }
  return { ok: false, testo: 'GitHub ha risposto ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 160) };
}

// ---- Modo 1: link nel browser ----
function doGet(e) {
  const par = (e && e.parameter) || {};
  if (!chiaveGiusta(par)) return risposta('Chiave errata.');
  const cmd = par.cmd || 'stato';
  if (cmd === 'stato') return risposta(stato());
  return risposta(avvia(cmd, par.quanti).testo);
}

// ---- Modo 2: connettore MCP (JSON-RPC) per la chat ----
const STRUMENTI = [
  {
    name: 'avvia_ricerca_comuni',
    description: 'Avvia su GitHub la ricerca automatica degli eventi dei comuni con più di 10.000 abitanti non ancora controllati. Gli eventi con errori o doppioni vengono scartati e gli altri vanno online da soli se il sito si costruisce senza errori. Un solo avvio ogni 5 minuti.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quanti comuni controllare in questo giro (predefinito 30).' } } },
    annotations: { title: 'Avvia ricerca eventi dei comuni', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
  {
    name: 'avvia_lettura_fonti',
    description: 'Avvia su GitHub la rilettura delle pagine fisse di eventi già note (teatri, musei, Comuni). Stessi controlli: errori e doppioni scartati, pubblicazione solo se il sito si costruisce.',
    inputSchema: { type: 'object', properties: { quanti: { type: 'integer', minimum: 1, maximum: 120, description: 'Quante pagine leggere (predefinito 60).' } } },
    annotations: { title: 'Avvia lettura delle fonti fisse', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
  {
    name: 'stato_ricerche',
    description: 'Dice come sono andati gli ultimi giri di ricerca (riusciti, falliti, in corso). Non avvia niente.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { title: 'Stato delle ricerche', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
];

function gestisciMcp(msg) {
  const id = msg.id;
  const ok = function (result) { return { jsonrpc: '2.0', id: id, result: result }; };
  const errore = function (codice, testo) { return { jsonrpc: '2.0', id: id, error: { code: codice, message: testo } }; };
  if (id === undefined || id === null) return null; // notifiche (es. notifications/initialized): nessuna risposta
  switch (msg.method) {
    case 'initialize':
      return ok({
        protocolVersion: (msg.params && msg.params.protocolVersion) || '2025-03-26',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'livelocal-avvio', version: '1.0.0' },
        instructions: 'Strumenti per avviare le ricerche automatiche di eventi di LiveLocal. Prima di avviare una ricerca chiama stato_ricerche per vedere se ce n\'è già una in corso.',
      });
    case 'ping':
      return ok({});
    case 'tools/list':
      return ok({ tools: STRUMENTI });
    case 'tools/call': {
      const nome = msg.params && msg.params.name;
      const argomenti = (msg.params && msg.params.arguments) || {};
      let testo, sbagliato = false;
      if (nome === 'stato_ricerche') testo = stato();
      else if (nome === 'avvia_ricerca_comuni' || nome === 'avvia_lettura_fonti') {
        const r = avvia(nome === 'avvia_ricerca_comuni' ? 'comuni' : 'fonti', argomenti.quanti);
        testo = r.testo; sbagliato = !r.ok;
      } else return errore(-32602, 'Strumento sconosciuto: ' + nome);
      return ok({ content: [{ type: 'text', text: testo }], isError: sbagliato });
    }
    default:
      return errore(-32601, 'Metodo non supportato: ' + msg.method);
  }
}

function doPost(e) {
  const par = (e && e.parameter) || {};
  if (!chiaveGiusta(par)) return rispostaJson({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'Chiave errata.' } });
  let corpo;
  try { corpo = JSON.parse(e.postData.contents); } catch (err) {
    return rispostaJson({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'JSON non valido.' } });
  }
  if (Array.isArray(corpo)) {
    const risposte = corpo.map(gestisciMcp).filter(function (x) { return x; });
    return risposte.length ? rispostaJson(risposte) : risposta('');
  }
  const r = gestisciMcp(corpo);
  return r ? rispostaJson(r) : risposta('');
}
