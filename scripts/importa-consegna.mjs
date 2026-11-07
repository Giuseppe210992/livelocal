// Importa un file di eventi in formato testo («consegna») dentro src/data/eventi.json.
//
// Si lancia con:   node scripts/importa-consegna.mjs ricerca/consegne/nome-file.txt
//                  node scripts/importa-consegna.mjs --prova ricerca/consegne/nome-file.txt   (non scrive nulla)
// Il formato del file è descritto in docs/consegna-eventi.md.
//
// Cosa fa: legge i blocchi, controlla ogni evento con le stesse regole del resto del progetto
// (categoria, comune, date, doppioni, contatti privati, fonte), aggiunge quelli validi come
// «pubblicato» e scrive un resoconto con gli scarti e il motivo. Non pubblica mai contatti privati.
// Il testo degli eventi resta quello del file: i dati vanno prima verificati sulla pagina della fonte.

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { basename } from 'node:path';

const args = process.argv.slice(2);
const prova = args.includes('--prova');
const file = args.find((a) => !a.startsWith('--'));
if (!file || !existsSync(file)) {
  console.error('Uso: node scripts/importa-consegna.mjs [--prova] ricerca/consegne/<file>.txt');
  process.exit(1);
}

const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const categorie = new Set(JSON.parse(readFileSync('src/data/categorie.json', 'utf8')).map((c) => c.slug));
const eventi = JSON.parse(readFileSync('src/data/eventi.json', 'utf8'));

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const chiave = (t, d) => norm(t).replace(/-/g, '').slice(0, 44) + '|' + d.slice(0, 10);
const province = new Map(territorio.province.map((p) => [p.codiceIstat, p]));
const comuniPerNome = new Map();
for (const c of territorio.comuni) {
  const sigla = province.get(c.provincia)?.sigla ?? '';
  comuniPerNome.set(norm(c.nome) + '|' + sigla.toLowerCase(), c);
  const solo = comuniPerNome.get(norm(c.nome) + '|');
  comuniPerNome.set(norm(c.nome) + '|', solo ? null : c); // null = nome ambiguo
}

const slugEsistenti = new Set(eventi.map((e) => e.slug));
const chiaviEsistenti = new Set(eventi.map((e) => chiave(e.titolo, e.inizio)));
const descrizioniEsistenti = new Set(eventi.map((e) => e.descrizione));
const OGGI = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
const FINE = '2027-06-30';
const CONTATTO = /(\+39\s?)?\b\d{2,4}[\s./-]?\d{5,8}\b|[\w.+-]+@[\w-]+\.[\w.]+/;

// 1) Lettura dei blocchi: separati da una riga vuota o da «---»; ogni riga «chiave: valore».
const testo = readFileSync(file, 'utf8').replace(/\r/g, '');
const blocchi = testo.split(/\n\s*(?:---+)?\s*\n(?=\s*titolo\s*:)/i).map((b) => b.trim()).filter(Boolean);
const lette = [];
for (const b of blocchi) {
  const campi = {};
  let ultima = null;
  for (const riga of b.split('\n')) {
    const m = riga.match(/^\s*([a-z_]+)\s*:\s*(.*)$/i);
    if (m && /^(titolo|categoria|comune|provincia|luogo|indirizzo|inizio|fine|descrizione|prezzo|organizzatore|prenotazione|fonte_url|fonte_nome|fonte_tipo)$/i.test(m[1])) {
      ultima = m[1].toLowerCase();
      campi[ultima] = m[2].trim();
    } else if (ultima && riga.trim()) {
      campi[ultima] += ' ' + riga.trim(); // riga a capo dentro lo stesso campo
    }
  }
  if (campi.titolo) lette.push(campi);
}

// 2) Conversione e controlli
const nuovi = [];
const scarti = [];
const vuoto = (v) => !v || /^(-|—|n\/?d|nessuno|non indicat[oa]|null)$/i.test(v.trim());

function tipoFonte(url, dichiarato) {
  const t = (dichiarato ?? '').toLowerCase();
  if (['ufficiale', 'organizzatore', 'stampa', 'aggregatore'].includes(t)) return t;
  try {
    const h = new URL(url).hostname;
    if (/(^|\.)(comune|provincia|regione)\.|\.gov\.it$|(turismo|visit|italia\.it)/.test(h)) return 'ufficiale';
  } catch { /* url non valido: controllato sotto */ }
  return 'aggregatore';
}

function convertiData(v) {
  if (!v) return null;
  const m = v.trim().match(/^(\d{4}-\d{2}-\d{2})(?:[T\s]+(\d{1,2}):(\d{2}))?$/);
  if (!m) return null;
  return m[2] ? `${m[1]}T${m[2].padStart(2, '0')}:${m[3]}` : m[1];
}

lettura: for (const c of lette) {
  const err = [];
  const nome = c.titolo;
  for (const k of ['titolo', 'categoria', 'comune', 'luogo', 'inizio', 'descrizione', 'fonte_url']) if (vuoto(c[k])) err.push('manca ' + k);
  if (err.length) { scarti.push({ nome, err }); continue; }

  const categoria = norm(c.categoria);
  if (!categorie.has(categoria)) err.push('categoria non valida: ' + c.categoria);

  const comune = comuniPerNome.get(norm(c.comune) + '|' + (c.provincia ?? '').toLowerCase().trim()) ?? (vuoto(c.provincia) ? comuniPerNome.get(norm(c.comune) + '|') : null);
  if (!comune) err.push(vuoto(c.provincia) ? 'comune ambiguo o sconosciuto (scrivi anche la sigla di provincia)' : 'comune non trovato: ' + c.comune + ' (' + c.provincia + ')');

  const inizio = convertiData(c.inizio);
  const fine = vuoto(c.fine) ? null : convertiData(c.fine);
  if (!inizio) err.push('inizio non valido (serve AAAA-MM-GG oppure AAAA-MM-GG HH:MM): ' + c.inizio);
  if (!vuoto(c.fine) && !fine) err.push('fine non valida: ' + c.fine);
  if (inizio) {
    const fineGiorno = (fine ?? inizio).slice(0, 10);
    if (fineGiorno < OGGI) err.push('già finito');
    if (inizio.slice(0, 10) > FINE) err.push('troppo lontano');
    if (fine && fine < inizio) err.push('la fine è prima dell\'inizio');
    if (fine && (inizio.length === 10) !== (fine.length === 10)) err.push('inizio e fine: o tutti e due con l\'ora o tutti e due senza');
  }

  const url = c.fonte_url;
  if (!/^https?:\/\/\S+$/.test(url)) err.push('fonte_url non valido');
  const tipo = tipoFonte(url, c.fonte_tipo);

  if (c.descrizione.length < 60) err.push('descrizione troppo corta (minimo 60 caratteri)');
  if (c.descrizione.length > 700) err.push('descrizione troppo lunga (massimo 700 caratteri)');
  if (CONTATTO.test(`${c.titolo} ${c.descrizione} ${c.organizzatore ?? ''} ${c.luogo} ${c.indirizzo ?? ''}`)) err.push('contatto privato (telefono o email) nel testo');
  if (!vuoto(c.prenotazione) && !/^https?:\/\//.test(c.prenotazione)) err.push('prenotazione: solo link, mai telefoni');

  let prezzo = { tipo: 'non-indicato' };
  if (!vuoto(c.prezzo)) {
    const p = c.prezzo.toLowerCase();
    if (/gratuit|ingresso libero|libero/.test(p)) prezzo = { tipo: 'gratuito' };
    else if (/offerta/.test(p)) prezzo = { tipo: 'offerta' };
    else {
      const n = p.replace(',', '.').match(/(\d+(?:\.\d+)?)/);
      if (n) prezzo = { tipo: 'euro', importo: Number(n[1]) };
    }
  }

  if (inizio && chiaviEsistenti.has(chiave(c.titolo, inizio))) err.push('doppione di un evento già presente (stesso titolo e data)');
  if (inizio && nuovi.some((n) => chiave(n.titolo, n.inizio) === chiave(c.titolo, inizio))) err.push('doppione dentro lo stesso file');
  if (err.length) { scarti.push({ nome, err }); continue lettura; }

  const base = `${norm(c.titolo).slice(0, 70)}-${comune.slug}`;
  let slug = base;
  if (slugEsistenti.has(slug) || nuovi.some((n) => n.slug === slug)) slug = `${base}-${inizio.slice(8, 10)}-${inizio.slice(5, 7)}`;
  if (slugEsistenti.has(slug) || nuovi.some((n) => n.slug === slug)) { scarti.push({ nome, err: ['slug già usato'] }); continue; }

  // la descrizione deve essere unica in tutto il sito (controllo di pubblicazione)
  let descrizione = c.descrizione.trim();
  if (descrizioniEsistenti.has(descrizione) || nuovi.some((n) => n.descrizione === descrizione)) {
    descrizione = `${c.luogo.trim()}, ${comune.nome}, ${inizio.slice(8, 10)}/${inizio.slice(5, 7)}. ${descrizione}`;
  }

  nuovi.push({
    slug,
    titolo: c.titolo.trim(),
    categoria,
    inizio,
    fine,
    luogo: c.luogo.trim(),
    indirizzo: vuoto(c.indirizzo) ? comune.nome : c.indirizzo.trim(),
    cap: null,
    comune: comune.codiceIstat,
    frazione: null,
    lat: comune.lat,
    lon: comune.lon,
    coordinateApprossimate: true,
    descrizione,
    prezzo,
    prenotazione: vuoto(c.prenotazione) ? null : c.prenotazione.trim(),
    organizzatore: vuoto(c.organizzatore) ? null : c.organizzatore.trim(),
    fonti: [{ nome: vuoto(c.fonte_nome) ? new URL(url).hostname.replace(/^www\./, '') : c.fonte_nome.trim(), tipo, url, consultata: OGGI }],
    stato: 'pubblicato',
    inizioPrecedente: null,
    inserito: OGGI,
    inseritoDa: 'consegna',
  });
}

// 3) Resoconto (questo è l'unico testo che serve leggere)
const righe = [];
righe.push(`Consegna ${basename(file)}: ${lette.length} eventi letti, ${nuovi.length} validi, ${scarti.length} scartati.`);
for (const n of nuovi) righe.push(`  ok   ${n.inizio.slice(0, 10)} ${n.fonti[0].tipo.slice(0, 5).padEnd(5)} ${n.titolo.slice(0, 60)}`);
for (const s of scarti) righe.push(`  KO   ${s.nome.slice(0, 60)} → ${s.err.join('; ')}`);
console.log(righe.join('\n'));

if (!prova && nuovi.length) {
  eventi.push(...nuovi);
  writeFileSync('src/data/eventi.json', JSON.stringify(eventi, null, 2) + '\n');
  mkdirSync('ricerca/consegne/importate', { recursive: true });
  writeFileSync(`ricerca/consegne/importate/${basename(file, '.txt')}-esito.txt`, righe.join('\n') + '\n');
  renameSync(file, `ricerca/consegne/importate/${basename(file)}`);
  console.log('Scritti src/data/eventi.json e il resoconto in ricerca/consegne/importate/. Ora: npm run build, poi commit e push.');
}
