// Ponte tra una chat (o un link) e le ricerche automatiche di LiveLocal.
// Si incolla in Google Apps Script (script.google.com) e si pubblica come «App web».
// Con un indirizzo del tipo  .../exec?chiave=LA_TUA_FRASE&cmd=comuni&quanti=40  avvia la ricerca su GitHub.
//
// Comandi (parametro cmd):
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

function gh(percorso, opzioni) {
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  return UrlFetchApp.fetch('https://api.github.com/repos/' + REPO + percorso, Object.assign({
    headers: { Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'livelocal-avvio' },
    muteHttpExceptions: true,
  }, opzioni || {}));
}

function doGet(e) {
  const par = (e && e.parameter) || {};
  const segreto = PropertiesService.getScriptProperties().getProperty('SEGRETO');
  if (!segreto || par.chiave !== segreto) return risposta('Chiave errata.');
  const cmd = par.cmd || 'stato';

  if (cmd === 'stato') {
    const righe = [];
    for (const nome of Object.keys(FLUSSI)) {
      const r = gh('/actions/workflows/' + FLUSSI[nome] + '/runs?per_page=3');
      if (r.getResponseCode() !== 200) { righe.push(nome + ': errore ' + r.getResponseCode()); continue; }
      const corse = JSON.parse(r.getContentText()).workflow_runs || [];
      righe.push(nome + ': ' + (corse.map(function (c) { return (c.conclusion || c.status) + ' (' + c.created_at.slice(5, 16).replace('T', ' ') + ')'; }).join(', ') || 'nessun giro'));
    }
    return risposta(righe.join('\n'));
  }

  const file = FLUSSI[cmd];
  if (!file) return risposta('Comando sconosciuto. Usa comuni, fonti o stato.');
  const cache = CacheService.getScriptCache();
  if (cache.get('ultimo-avvio')) return risposta('Un avvio è già partito da meno di 5 minuti: aspetta.');
  const quanti = Math.max(1, Math.min(120, Number(par.quanti || (cmd === 'comuni' ? 30 : 60)) || 30));
  const inputs = cmd === 'comuni' ? { prova: 'false', quanti: String(quanti) } : { prova: 'false', max: String(quanti) };
  const r = gh('/actions/workflows/' + file + '/dispatches', {
    method: 'post', contentType: 'application/json', payload: JSON.stringify({ ref: 'main', inputs: inputs }),
  });
  if (r.getResponseCode() === 204) {
    cache.put('ultimo-avvio', '1', 300);
    return risposta('Avviato: ' + cmd + ' (' + quanti + '). Se non ci sono duplicati o errori, gli eventi vanno online da soli in circa 15-40 minuti.');
  }
  return risposta('GitHub ha risposto ' + r.getResponseCode() + ': ' + r.getContentText().slice(0, 160));
}
