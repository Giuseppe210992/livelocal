// Controlli automatici dopo la costruzione del sito (npm run build li esegue da solo).
// Se qualcosa non va, il comando termina con errore e il sito NON viene pubblicato.
//  1. Privacy: nessuna email o numero di telefono nei file pubblicati.
//  2. Ogni pagina evento ha i dati strutturati Event completi.
//  3. Ogni pagina ha titolo e descrizione unici, lingua italiana e URL canonico.
//  4. Tutti i link interni portano a una pagina che esiste.
//  5. La sitemap contiene tutte le pagine evento.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = ((process.env.BASE_PATH ?? '/livelocal') || '/').replace(/\/?$/, '/');
const errori = [];
// L'unica email ammessa nelle pagine è il contatto pubblico scelto dal titolare (src/data/impostazioni.json).
const EMAIL_PUBBLICA = JSON.parse(readFileSync(new URL('../src/data/impostazioni.json', import.meta.url), 'utf8')).emailContatto;

function file(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? file(p) : [p];
  });
}

const tutti = file(DIST);
const pagine = tutti.filter((p) => p.endsWith('.html'));

// 1. Privacy
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}/g;
const TELEFONO = /(?:\+39[\s.]?)?\b(?:3\d{2}|0\d{1,3})[\s.]?\d{3}[\s.]?\d{3,4}\b/g;
for (const p of tutti.filter((x) => /\.(html|json|ics|xml|txt)$/.test(x))) {
  const testo = readFileSync(p, 'utf8')
    .replace(/<script type="application\/ld\+json">.*?<\/script>/gs, (m) => m.replace(/"(latitude|longitude)":[\d.]+/g, ''))
    .replace(/https?:\/\/[^\s"'<>]+/g, '') // gli indirizzi web (fonti) possono contenere numeri lunghi
    .replace(/UID:[^\r\n]+/g, '');
  const email = testo.match(EMAIL)?.filter((m) => !m.endsWith('@livelocal') && m !== EMAIL_PUBBLICA);
  const tel = testo.match(TELEFONO)?.filter((m) => !/^\d{6}$/.test(m.replace(/\D/g, '')) && !/^\d{5}$/.test(m));
  if (email?.length) errori.push(`PRIVACY ${relative(DIST, p)}: email trovata ${email.join(', ')}`);
  if (tel?.length) errori.push(`PRIVACY ${relative(DIST, p)}: possibile telefono ${tel.join(', ')}`);
}

// 2-4. Pagine
const titoli = new Map();
const descrizioni = new Map();
for (const p of pagine) {
  const nome = relative(DIST, p);
  const html = readFileSync(p, 'utf8');
  if (!html.includes('<html lang="it"')) errori.push(`${nome}: manca lang="it"`);
  const titolo = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const descr = html.match(/<meta name="description" content="(.*?)"/s)?.[1];
  if (!titolo) errori.push(`${nome}: manca il titolo`);
  if (!descr) errori.push(`${nome}: manca la descrizione`);
  if (!html.includes('rel="canonical"')) errori.push(`${nome}: manca l'URL canonico`);
  if (nome !== '404.html') {
    if (titoli.has(titolo)) errori.push(`${nome}: titolo uguale a ${titoli.get(titolo)}`);
    if (descrizioni.has(descr)) errori.push(`${nome}: descrizione uguale a ${descrizioni.get(descr)}`);
    titoli.set(titolo, nome);
    descrizioni.set(descr, nome);
  }

  const blocchi = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => {
    try { return JSON.parse(m[1]); } catch { errori.push(`${nome}: JSON-LD non leggibile`); return {}; }
  });
  if (nome.startsWith('evento/')) {
    const ev = blocchi.find((b) => b['@type'] === 'Event');
    if (!ev) errori.push(`${nome}: manca il JSON-LD Event`);
    else {
      for (const campo of ['name', 'startDate', 'eventStatus', 'eventAttendanceMode', 'description', 'url'])
        if (!ev[campo]) errori.push(`${nome}: JSON-LD Event senza "${campo}"`);
      if (!ev.location?.name || !ev.location?.address?.addressLocality || !ev.location?.geo)
        errori.push(`${nome}: JSON-LD Event con luogo incompleto`);
    }
    if (!blocchi.some((b) => b['@type'] === 'BreadcrumbList')) errori.push(`${nome}: manca BreadcrumbList`);
  }

  for (const [, link] of html.matchAll(/href="([^"]+)"/g)) {
    if (!link.startsWith(BASE) || link.startsWith('//')) continue;
    const percorso = decodeURI(link.slice(BASE.length).split('#')[0].split('?')[0]);
    const atteso = percorso === '' || percorso.endsWith('/') ? join(DIST, percorso, 'index.html') : join(DIST, percorso);
    if (!existsSync(atteso)) errori.push(`${nome}: link interno rotto ${link}`);
  }
}

// 4b. Ogni pagina evento deve avere l'immagine indicata nei dati per Google (e nell'anteprima)
for (const p of pagine.filter((x) => relative(DIST, x).startsWith('evento/'))) {
  const html = readFileSync(p, 'utf8');
  const img = html.match(/<meta property="og:image" content="[^"]*?(\/evento\/[^"]+\.png)"/)?.[1];
  if (!img || !existsSync(join(DIST, img.replace(/^\//, '')))) errori.push(`${relative(DIST, p)}: immagine dell'evento mancante`);
}

// Avvisi (non bloccano la pubblicazione): testi troppo lunghi per Google
for (const p of pagine) {
  const html = readFileSync(p, 'utf8');
  const t = html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '';
  const d = html.match(/name="description" content="(.*?)"/s)?.[1] ?? '';
  if (t.length > 90 || d.length > 170) console.warn(`  ! ${relative(DIST, p)}: titolo ${t.length} / descrizione ${d.length} caratteri (consigliati 60 / 160)`);
}

// 5. Sitemap
// /sitemap.xml è un indice: le pagine stanno in sitemap-principali, -territorio, -eventi e -luoghi.
const indice = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
if (!indice.includes('<sitemapindex')) errori.push('sitemap.xml non è un indice di mappe');
// In fase 1 l'indice cita solo le mappe che hanno pagine (src/data/indicizzazione.json): ogni mappa citata deve esistere.
const FASE = JSON.parse(readFileSync('src/data/indicizzazione.json', 'utf8')).fase;
const citate = [...indice.matchAll(/sitemap-([a-z]+)\.xml</g)].map((m) => m[1]);
if (!citate.includes('principali')) errori.push("sitemap: l'indice non cita sitemap-principali.xml");
const sitemap = citate.map((n) => readFileSync(join(DIST, `sitemap-${n}.xml`), 'utf8')).join('\n');
// La mappa degli eventi contiene solo quelli in programma o in corso (i conclusi restano online ma fuori mappa):
// ogni indirizzo in mappa deve esistere, e la mappa non può essere vuota.
const inMappa = [...sitemap.matchAll(/<loc>([^<]*\/evento\/[^<]*)<\/loc>/g)].map((m) => m[1]);
if (FASE >= 2 && inMappa.length === 0) errori.push('sitemap: nessun evento in mappa');
if (FASE === 1 && inMappa.length > 0) errori.push('sitemap: in fase 1 non ci devono essere eventi in mappa');
for (const u of inMappa) {
  const percorso = new URL(u).pathname.slice(BASE.length);
  const f = join(DIST, percorso, 'index.html');
  if (!existsSync(f)) errori.push(`sitemap: /${percorso} è in mappa ma la pagina non esiste`);
  else if (/<meta name="robots" content="noindex/.test(readFileSync(f, 'utf8'))) errori.push(`sitemap: /${percorso} è in mappa ma ha noindex`);
}

if (errori.length) {
  console.error(`\n✗ Controlli NON superati (${errori.length}):\n- ${errori.join('\n- ')}\n`);
  process.exit(1);
}
console.log(`✓ Controlli superati: ${pagine.length} pagine, ${tutti.length} file. Nessun contatto privato pubblicato.`);
