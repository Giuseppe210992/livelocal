// Controllo giornaliero di Instagram (Business Discovery, API ufficiale di Meta).
//
// Cosa fa: per ogni account in ricerca/instagram-account.json legge gli ultimi post,
// tiene solo quelli NUOVI (dopo l'ultimo controllo) che sembrano parlare di un evento
// (una data, un orario, «sagra», «concerto»…) e scrive in ricerca/instagram-nuovi.json
// SOLO il link al post, l'account e la data. Le didascalie non vengono mai salvate né
// stampate: il repository è pubblico. La ricerca automatica poi apre il link e controlla
// l'evento con il controllo in 4 punti (vedi docs/ricerca-eventi.md).
//
// Serve il segreto META_TOKEN (token utente lungo, ~60 giorni). Non viene mai stampato.
// Uscita con errore (e quindi email di GitHub a Giuseppe) se il token è scaduto.
//
// Prova in locale senza Meta: GRAPH_BASE=http://localhost:PORTA META_TOKEN=x node scripts/controlla-instagram.mjs

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const BASE = process.env.GRAPH_BASE || 'https://graph.facebook.com/v26.0';
const TOKEN = process.env.META_TOKEN;
const FILE_ACCOUNT = 'ricerca/instagram-account.json';
const FILE_USCITA = 'ricerca/instagram-nuovi.json';
// Data di scadenza del token lungo (da aggiornare quando si rinnova, vedi docs/collegamento-facebook-instagram.md)
const TOKEN_SCADE = process.env.META_TOKEN_SCADE || '2027-01-02';
const GIORNI_INDIETRO_PRIMA_VOLTA = 10;
const POST_PER_ACCOUNT = 25;

const MESI = 'gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre';
const SEMBRA_EVENTO = new RegExp(
  `(\\d{1,2}\\s*(${MESI}))|(\\bore\\s*\\d)|(\\b\\d{1,2}[:.]\\d{2}\\b)|(\\b(sagra|concerto|mostra|spettacolo|festival|festa|evento|visita guidata|mercatino|degustazion|inaugurazion|rassegna|teatro|ingresso)\\w*)`,
  'i',
);

if (!TOKEN) {
  console.error('Manca il segreto META_TOKEN: il controllo non può partire.');
  process.exit(1);
}

const elenco = JSON.parse(readFileSync(FILE_ACCOUNT, 'utf8'));
const uscita = existsSync(FILE_USCITA)
  ? JSON.parse(readFileSync(FILE_USCITA, 'utf8'))
  : { daVerificare: [], account: {} };
uscita.daVerificare ??= [];
uscita.account ??= {};

const adesso = new Date();
const primaVolta = new Date(adesso.getTime() - GIORNI_INDIETRO_PRIMA_VOLTA * 86400000).toISOString();
let tokenScaduto = false;
let nuoviTotali = 0;

for (const nome of elenco.account) {
  const campi =
    `business_discovery.username(${nome}){username,media.limit(${POST_PER_ACCOUNT}){caption,timestamp,permalink}}`;
  const url = `${BASE}/${elenco.mioId}?fields=${encodeURIComponent(campi)}&access_token=${encodeURIComponent(TOKEN)}`;
  let risposta;
  try {
    const r = await fetch(url);
    risposta = await r.json();
  } catch {
    uscita.account[nome] = { stato: 'rete', controllato: adesso.toISOString() };
    console.log(`${nome}: errore di rete`);
    continue;
  }

  if (risposta.error) {
    // Non stampiamo l'indirizzo (contiene il token): solo il codice dell'errore.
    const codice = risposta.error.code;
    if (codice === 190) {
      tokenScaduto = true;
      console.log(`${nome}: token non valido o scaduto (codice 190)`);
      break;
    }
    const stato = codice === 110 || codice === 24 || codice === 100 ? 'non-leggibile' : `errore-${codice}`;
    uscita.account[nome] = { ...uscita.account[nome], stato, controllato: adesso.toISOString() };
    console.log(`${nome}: ${stato}`);
    continue;
  }

  const post = risposta.business_discovery?.media?.data ?? [];
  const precedente = uscita.account[nome]?.ultimoPost ?? primaVolta;
  const nuovi = post
    .filter((p) => p.timestamp && p.timestamp > precedente)
    .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1));
  let aggiunti = 0;
  for (const p of nuovi) {
    const giaPresente = uscita.daVerificare.some((x) => x.link === p.permalink);
    if (!giaPresente && SEMBRA_EVENTO.test(p.caption || '')) {
      uscita.daVerificare.push({ account: nome, link: p.permalink, data: p.timestamp.slice(0, 10) });
      aggiunti++;
    }
  }
  const ultimo = nuovi.length ? nuovi[nuovi.length - 1].timestamp : precedente;
  uscita.account[nome] = { stato: 'ok', ultimoPost: ultimo, controllato: adesso.toISOString() };
  nuoviTotali += aggiunti;
  console.log(`${nome}: ok, ${nuovi.length} post nuovi, ${aggiunti} da verificare`);
}

uscita.aggiornato = adesso.toISOString();
uscita.tokenScade = TOKEN_SCADE;
uscita.stato = tokenScaduto ? 'token-scaduto' : 'ok';
writeFileSync(FILE_USCITA, JSON.stringify(uscita, null, 2) + '\n');

console.log(`Fatto: ${nuoviTotali} nuovi link da verificare, ${uscita.daVerificare.length} in attesa in totale.`);
if (tokenScaduto) {
  console.error('Il token Meta è scaduto: va rinnovato (vedi docs/collegamento-facebook-instagram.md).');
  process.exit(1);
}
