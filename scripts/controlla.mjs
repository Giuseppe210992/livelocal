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

// 5. Sitemap
const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
for (const p of pagine.filter((x) => relative(DIST, x).startsWith('evento/'))) {
  const percorso = relative(DIST, p).replace(/index\.html$/, '');
  if (!sitemap.includes(`${BASE}${percorso}<`)) errori.push(`sitemap: manca /${percorso}`);
}

if (errori.length) {
  console.error(`\n✗ Controlli NON superati (${errori.length}):\n- ${errori.join('\n- ')}\n`);
  process.exit(1);
}
console.log(`✓ Controlli superati: ${pagine.length} pagine, ${tutti.length} file. Nessun contatto privato pubblicato.`);
