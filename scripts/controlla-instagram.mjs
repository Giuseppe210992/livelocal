// Controllo di Instagram (Business Discovery, API ufficiale di Meta), pensato per crescere fino a migliaia di account.
//
// A ogni lancio:
//  1. controlla gli account dell'elenco (ricerca/instagram-account.json) e quelli scoperti da solo,
//     dal meno recente al più recente, fino al limite di chiamate per lancio;
//  2. tiene solo i post NUOVI che sembrano parlare di un evento (una data, un orario, «sagra»,
//     «concerto»…) e scrive in ricerca/instagram-nuovi.json SOLO link, account e data
//     (mai le didascalie: il repository è pubblico);
//  3. SCOPRE nuovi account: i nomi citati nei post (@nome) diventano «candidati». Con le chiamate
//     che avanzano si guarda nome e biografia del candidato: entra tra gli account controllati solo se
//     sembra un ENTE (Pro Loco, Comune, teatro, museo, associazione…), non una persona o un negozio.
//     Nome e biografia non vengono salvati: si salva solo l'esito.
//  4. si ferma da solo se Meta dice «troppe richieste» e riprende al lancio dopo.
//
// Serve il segreto META_TOKEN (token lungo, ~60 giorni). Non viene mai stampato.
// Esce con errore (GitHub manda un'email a Giuseppe) solo se il token è scaduto.
//
// Prova in locale senza Meta: GRAPH_BASE=http://localhost:PORTA META_TOKEN=x node scripts/controlla-instagram.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BASE = process.env.GRAPH_BASE || 'https://graph.facebook.com/v26.0';
const TOKEN = process.env.META_TOKEN;
const FILE_ACCOUNT = 'ricerca/instagram-account.json';
const FILE_USCITA = 'ricerca/instagram-nuovi.json';
// Data di scadenza del token lungo (da aggiornare quando si rinnova, vedi docs/collegamento-facebook-instagram.md)
const TOKEN_SCADE = process.env.META_TOKEN_SCADE || '2027-01-02';

const MAX_CHIAMATE = Number(process.env.MAX_CHIAMATE || 150); // in totale per lancio: Meta ne tollera circa 200 all'ora
const MAX_CANDIDATI = Number(process.env.MAX_CANDIDATI || 70); // di cui, al massimo, per i candidati
const RISERVA_CANDIDATI = Number(process.env.RISERVA_CANDIDATI || 60); // chiamate sempre lasciate ai candidati
const PAUSA_MS = Number(process.env.PAUSA_MS ?? 700); // pausa tra due chiamate, per non correre
const GIORNI_INDIETRO_PRIMA_VOLTA = 10;
const GIORNI_LINK_VALIDI = 25; // i link in attesa più vecchi si eliminano
const GIORNI_PRIMA_DI_RIPROVARE_NON_LEGGIBILI = 30;
const POST_PER_ACCOUNT = 25;
const LOCANDINE_PER_ACCOUNT = 3; // al massimo tre post «solo locandina» per account a ogni lancio
const DIDASCALIA_CORTA = 140; // sotto questa lunghezza un post con immagine è probabilmente una locandina
const MAX_CANDIDATI_IN_ATTESA = 3000;

const MESI = 'gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre';
const SEMBRA_EVENTO = new RegExp(
  `(\\d{1,2}\\s*(${MESI}))|(\\bore\\s*\\d)|(\\b\\d{1,2}[:.]\\d{2}\\b)|(\\b(sagra|concerto|mostra|spettacolo|festival|festa|evento|visita guidata|mercatino|degustazion|inaugurazion|rassegna|teatro|ingresso)\\w*)`,
  'i',
);

// Sembra un ente? Parole che lo indicano, e parole che indicano una persona o un'attività commerciale.
const PAROLE_ENTE = new RegExp(
  '\\b(pro ?loco|unpli|comune|città|citta|municipio|assessorato|ufficio turistico|turismo|infopoint|iat|visit|' +
    'teatro|cinema|museo|musei|parco|biblioteca|archivio|galleria|castello|palazzo|' +
    'associazione|aps|odv|onlus|fondazione|consorzio|circolo|accademia|università|' +
    'festival|sagra|rassegna|diocesi|parrocchia|oratorio|confraternita|' +
    'orchestra|coro|banda|gruppo folk|folklor|compagnia|cai|lega navale|regione|provincia|camera di commercio|gal)\\b',
  'i',
);
const PAROLE_NO = new RegExp(
  '\\b(sindaco|assessore|consigliere|candidat|politic|blogger|influencer|creator|fotograf|' +
    'shop|negozio|ristorante|pizzeria|trattoria|hotel|b&b|bed and breakfast|agriturismo|boutique|parrucchier|estetist|' +
    'immobiliar|agenzia|studio|avvocat|dottor|coach|personal trainer|dj|cantante)\\b',
  'i',
);

if (!TOKEN) {
  console.error('Manca il segreto META_TOKEN: il controllo non può partire.');
  process.exit(1);
}

const elenco = JSON.parse(readFileSync(FILE_ACCOUNT, 'utf8'));
const uscita = existsSync(FILE_USCITA) ? JSON.parse(readFileSync(FILE_USCITA, 'utf8')) : {};
uscita.daVerificare ??= [];
uscita.account ??= {};
uscita.candidati ??= {}; // nome → { visto: data, fonte: 'citazione' | 'wikidata' }
uscita.scartati ??= []; // nomi già provati e non adatti (persone, negozi, account personali…)

const adesso = new Date();
const adessoIso = adesso.toISOString();
const primaVolta = new Date(adesso.getTime() - GIORNI_INDIETRO_PRIMA_VOLTA * 86400000).toISOString();
const scartati = new Set(uscita.scartati);
const dormi = (ms) => new Promise((r) => setTimeout(r, ms));

let chiamate = 0;
let tokenScaduto = false;
let limiteRaggiunto = false;
const novita = { link: 0, controllati: 0, candidatiNuovi: 0, accettati: 0, scartatiOra: 0, citazioni: 0, post: 0, conDidascalia: 0, locandine: 0 };

const normalizza = (n) => n.toLowerCase().replace(/\.+$/, '');

let campiEstesi = true; // se Meta non li accetta, si passa ai campi base per tutto il lancio

/** Una chiamata a Business Discovery. Restituisce {dati} oppure {errore: codice}. */
async function leggi(nome, conInfo) {
  const info = conInfo ? 'name,biography,' : '';
  const base = 'caption,timestamp,permalink';
  const estesi = `${base},media_type,media_url,children{media_url,media_type}`;
  let provatoEstesi = false;
  for (const usaEstesi of campiEstesi ? [true, false] : [false]) {
    chiamate++;
    const campi = `business_discovery.username(${nome}){username,${info}media.limit(${POST_PER_ACCOUNT}){${usaEstesi ? estesi : base}}}`;
    const url = `${BASE}/${elenco.mioId}?fields=${encodeURIComponent(campi)}&access_token=${encodeURIComponent(TOKEN)}`;
    let r;
    try {
      r = await (await fetch(url)).json();
    } catch {
      return { errore: 'rete' };
    }
    if (!r.error) {
      if (!usaEstesi && campiEstesi && provatoEstesi) {
        campiEstesi = false; // con i campi estesi dava errore e con quelli base no: Meta non li accetta
        console.log('Meta non accetta i campi con gli indirizzi delle immagini: per questo lancio uso solo quelli base.');
      }
      return { dati: r.business_discovery ?? {} };
    }
    // Errore 100 con i campi estesi: forse Meta non li accetta, oppure l'account non esiste. Riprova subito con i campi base.
    if (r.error.code === 100 && usaEstesi) {
      provatoEstesi = true;
      continue;
    }
    return { errore: r.error.code }; // Non stampiamo mai l'indirizzo: contiene il token.
  }
  return { errore: 100 };
}

/** Indirizzi delle immagini di un post (al massimo tre pagine di un album). Solo link, mai le immagini. */
function immaginiDi(p) {
  if (p.media_type === 'IMAGE' && p.media_url) return [p.media_url];
  if (p.media_type === 'CAROUSEL_ALBUM') {
    return (p.children?.data ?? []).filter((c) => c.media_type === 'IMAGE' && c.media_url).slice(0, 3).map((c) => c.media_url);
  }
  return [];
}

/** Controlla i post di un account e aggiunge i link che sembrano eventi. Raccoglie anche i nomi citati. */
function elaboraPost(nome, post) {
  const precedente = uscita.account[nome]?.ultimoPost ?? primaVolta;
  const nuovi = post
    .filter((p) => p.timestamp && p.timestamp > precedente)
    .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
  let aggiunti = 0;
  let locandine = 0;
  for (const p of nuovi) {
    const testo = p.caption || '';
    if (uscita.daVerificare.some((x) => x.link === p.permalink)) continue;
    const immagini = immaginiDi(p);
    const sembraEvento = SEMBRA_EVENTO.test(testo);
    // Post con poca didascalia e un'immagine: di solito è la locandina, e data e luogo stanno nell'immagine.
    const soloLocandina = !sembraEvento && immagini.length > 0 && testo.length < DIDASCALIA_CORTA && locandine < LOCANDINE_PER_ACCOUNT;
    if (!sembraEvento && !soloLocandina) continue;
    const voce = { account: nome, link: p.permalink, data: p.timestamp.slice(0, 10) };
    if (immagini.length) voce.immagini = immagini;
    if (soloLocandina) {
      voce.locandina = true;
      locandine++;
      novita.locandine++;
    }
    uscita.daVerificare.push(voce);
    aggiunti++;
  }
  // Riempimento: per i link già in coda senza immagine (messi in coda prima di questa funzione), se il post è tra quelli letti, aggiungi l'immagine.
  for (const p of post) {
    const voce = uscita.daVerificare.find((x) => x.link === p.permalink && !x.immagini);
    if (voce) {
      const immagini = immaginiDi(p);
      if (immagini.length) voce.immagini = immagini;
    }
  }
  // Nomi citati (@nome) in TUTTI i post letti: sono i candidati da valutare.
  for (const p of post) {
    novita.post++;
    if (p.caption) novita.conDidascalia++;
    for (const m of (p.caption || '').matchAll(/@([a-z0-9._]{3,30})/gi)) {
      const n = normalizza(m[1]);
      novita.citazioni++;
      if (n === nome || scartati.has(n) || uscita.account[n] || uscita.candidati[n]) continue;
      if (elenco.account.includes(n)) continue;
      if (Object.keys(uscita.candidati).length >= MAX_CANDIDATI_IN_ATTESA) continue;
      uscita.candidati[n] = { visto: adessoIso.slice(0, 10), fonte: 'citazione' };
      novita.candidatiNuovi++;
    }
  }
  const ultimo = nuovi.length ? nuovi[nuovi.length - 1].timestamp : precedente;
  return { aggiunti, nuovi: nuovi.length, ultimo };
}

// ---------- 1. Account già noti, dal meno recente ----------
const noti = [...new Set([...elenco.account.map(normalizza), ...Object.keys(uscita.account)])];
const giorniFa = (iso) => (iso ? (adesso - new Date(iso)) / 86400000 : Infinity);
const daControllare = noti
  .filter((n) => {
    const s = uscita.account[n];
    if (!s) return true;
    if (s.stato === 'non-leggibile') return giorniFa(s.controllato) > GIORNI_PRIMA_DI_RIPROVARE_NON_LEGGIBILI;
    return true;
  })
  .sort((a, b) => (uscita.account[a]?.controllato ?? '') < (uscita.account[b]?.controllato ?? '') ? -1 : 1);

for (const nome of daControllare) {
  // Teniamo da parte una quota di chiamate per i candidati, così la scoperta non si ferma mai.
  if (chiamate >= MAX_CHIAMATE - RISERVA_CANDIDATI) break;
  const { dati, errore } = await leggi(nome, false);
  if (errore) {
    if (errore === 190) {
      tokenScaduto = true;
      console.log('Token non valido o scaduto (codice 190)');
      break;
    }
    if ([4, 17, 32, 613].includes(errore) || (errore >= 80000 && errore < 80010)) {
      limiteRaggiunto = true;
      console.log(`Meta chiede di rallentare (codice ${errore}): mi fermo e riprendo al prossimo lancio`);
      break;
    }
    const stato = [110, 24, 100].includes(errore) ? 'non-leggibile' : `errore-${errore}`;
    uscita.account[nome] = { ...uscita.account[nome], stato, controllato: adessoIso };
    await dormi(PAUSA_MS);
    continue;
  }
  const r = elaboraPost(nome, dati.media?.data ?? []);
  uscita.account[nome] = { ...uscita.account[nome], stato: 'ok', ultimoPost: r.ultimo, controllato: adessoIso };
  novita.controllati++;
  novita.link += r.aggiunti;
  await dormi(PAUSA_MS);
}

// ---------- 2. Candidati: solo con le chiamate rimaste ----------
if (!tokenScaduto && !limiteRaggiunto) {
  const coda = Object.keys(uscita.candidati);
  let fatti = 0;
  for (const nome of coda) {
    if (chiamate >= MAX_CHIAMATE || fatti >= MAX_CANDIDATI) break;
    fatti++;
    const fidato = uscita.candidati[nome]?.fonte === 'wikidata'; // già indicato come ente (Comune, museo, teatro…) da Wikidata
    const { dati, errore } = await leggi(nome, true);
    if (errore === 190) {
      tokenScaduto = true;
      break;
    }
    if (errore && ([4, 17, 32, 613].includes(errore) || (errore >= 80000 && errore < 80010))) {
      limiteRaggiunto = true;
      break;
    }
    delete uscita.candidati[nome];
    if (errore) {
      scartati.add(nome); // account personale, inesistente o non leggibile
      novita.scartatiOra++;
      await dormi(PAUSA_MS);
      continue;
    }
    const intestazione = `${dati.username ?? nome} ${dati.name ?? ''} ${dati.biography ?? ''}`;
    if (fidato || (PAROLE_ENTE.test(intestazione) && !PAROLE_NO.test(intestazione))) {
      const r = elaboraPost(nome, dati.media?.data ?? []);
      uscita.account[nome] = { stato: 'ok', ultimoPost: r.ultimo, controllato: adessoIso, origine: fidato ? 'wikidata' : 'scoperto' };
      novita.accettati++;
      novita.link += r.aggiunti;
    } else {
      scartati.add(nome);
      novita.scartatiOra++;
    }
    await dormi(PAUSA_MS);
  }
}

// ---------- Pulizia e riepilogo ----------
const limiteData = new Date(adesso.getTime() - GIORNI_LINK_VALIDI * 86400000).toISOString().slice(0, 10);
uscita.daVerificare = uscita.daVerificare.filter((x) => x.data >= limiteData);
uscita.scartati = [...scartati].sort();
uscita.aggiornato = adessoIso;
uscita.tokenScade = TOKEN_SCADE;
uscita.stato = tokenScaduto ? 'token-scaduto' : limiteRaggiunto ? 'rallentato' : 'ok';
const leggibili = Object.values(uscita.account).filter((a) => a.stato === 'ok').length;
uscita.numeri = {
  accountLeggibili: leggibili,
  accountNonLeggibili: Object.keys(uscita.account).length - leggibili,
  candidatiInAttesa: Object.keys(uscita.candidati).length,
  scartati: uscita.scartati.length,
  linkInAttesa: uscita.daVerificare.length,
};
writeFileSync(FILE_USCITA, JSON.stringify(uscita, null, 2) + '\n');

console.log(
  `Fatto (${chiamate} chiamate): ${novita.controllati} account controllati, ${novita.link} link nuovi, ` +
    `${novita.candidatiNuovi} candidati nuovi, ${novita.accettati} accettati, ${novita.scartatiOra} scartati.`,
);
console.log(`Post letti: ${novita.post}, con didascalia: ${novita.conDidascalia}, citazioni (@nome) trovate: ${novita.citazioni}, locandine segnalate: ${novita.locandine}.`);
console.log(`Indirizzi delle immagini in coda: ${uscita.daVerificare.filter((x) => x.immagini).length} su ${uscita.daVerificare.length}.`);
console.log(`In totale: ${leggibili} account leggibili, ${uscita.numeri.candidatiInAttesa} candidati in attesa, ${uscita.daVerificare.length} link in attesa.`);
if (tokenScaduto) {
  console.error('Il token Meta è scaduto: va rinnovato (vedi docs/collegamento-facebook-instagram.md).');
  process.exit(1);
}
