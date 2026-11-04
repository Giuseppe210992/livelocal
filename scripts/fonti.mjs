// Registro delle fonti: da dove arrivano gli eventi e quali pagine abbiamo già provato.
// Serve per aggiornare gli eventi SENZA rifare tutte le ricerche: si riaprono le pagine già note.
//
// Si lancia con:  node scripts/fonti.mjs
// Legge:   src/data/eventi.json (le fonti di ogni evento) e ricerca/fonti-consultate.json
//          (pagine aperte e ricerche fatte dagli agenti, anche quando non hanno dato eventi)
// Scrive:  ricerca/fonti.json (per le macchine) e docs/fonti.md (da leggere)
// Non salva mai il testo delle pagine, solo indirizzi, titoli ed esito.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const eventi = JSON.parse(readFileSync('src/data/eventi.json', 'utf8')).filter((e) => e.stato === 'pubblicato');
const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const comuni = new Map(territorio.comuni.map((c) => [c.codiceIstat, c]));
const province = new Map(territorio.province.map((p) => [p.codiceIstat, p]));
const regioni = new Map(territorio.regioni.map((r) => [r.codiceIstat, r]));
const consultate = existsSync('ricerca/fonti-consultate.json')
  ? JSON.parse(readFileSync('ricerca/fonti-consultate.json', 'utf8'))
  : { pagine: [], ricerche: [] };

const SOCIAL = /(^|\.)(instagram|facebook|fb|tiktok|youtube|youtu)\.(com|be)$/;
// Servizi usati solo per trovare le coordinate: non sono fonti di eventi.
const NON_FONTI = /(^|\.)(nominatim\.openstreetmap\.org|openstreetmap\.org)$/;

function normalizza(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    for (const k of [...u.searchParams.keys()]) if (/^(utm_|fbclid|gclid)/.test(k)) u.searchParams.delete(k);
    let s = u.toString();
    if (s.endsWith('/') && u.pathname !== '/') s = s.slice(0, -1);
    return s;
  } catch {
    return url;
  }
}
const dominio = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return '?'; }
};

// 1) Fonti degli eventi pubblicati
const perUrl = new Map();
for (const e of eventi) {
  const c = comuni.get(e.comune);
  const p = c ? province.get(c.provincia) : null;
  for (const f of e.fonti) {
    const url = normalizza(f.url);
    const r = perUrl.get(url) ?? { url, dominio: dominio(url), nomi: new Map(), tipi: new Map(), eventi: 0, province: new Set(), regioni: new Set(), consultata: '' };
    r.eventi++;
    r.nomi.set(f.nome, (r.nomi.get(f.nome) ?? 0) + 1);
    r.tipi.set(f.tipo, (r.tipi.get(f.tipo) ?? 0) + 1);
    if (p) { r.province.add(p.sigla); r.regioni.add(regioni.get(p.regione)?.nome); }
    if ((f.consultata ?? '') > r.consultata) r.consultata = f.consultata;
    perUrl.set(url, r);
  }
}
const piuFrequente = (m) => [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

// 2) Pagine aperte dagli agenti
const aperte = new Map();
for (const p of consultate.pagine) {
  if (NON_FONTI.test(dominio(p.url))) continue;
  const url = normalizza(p.url);
  const vecchia = aperte.get(url);
  // se la stessa pagina è stata aperta più volte, vale l'esito migliore
  if (!vecchia || (vecchia.esito !== 'letta' && p.esito === 'letta')) aperte.set(url, { ...p, url });
}

const fonti = [];
for (const r of perUrl.values()) {
  const a = aperte.get(r.url);
  fonti.push({
    url: r.url,
    dominio: r.dominio,
    nome: piuFrequente(r.nomi),
    tipo: piuFrequente(r.tipi),
    esito: 'letta',
    eventi: r.eventi,
    regioni: [...r.regioni].sort(),
    province: [...r.province].sort(),
    consultata: r.consultata || a?.data || '',
    titolo: a?.titolo ?? '',
  });
}
for (const [url, a] of aperte) {
  if (perUrl.has(url)) continue;
  fonti.push({ url, dominio: dominio(url), nome: '', tipo: '', esito: a.esito, eventi: 0, regioni: [], province: [], consultata: a.data ?? '', titolo: a.titolo ?? '' });
}
fonti.sort((x, y) => x.dominio.localeCompare(y.dominio) || x.url.localeCompare(y.url));

const oggi = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
writeFileSync(
  'ricerca/fonti.json',
  JSON.stringify({
    _nota: 'Generato da scripts/fonti.mjs: non modificare a mano. Una riga per pagina: dove ha dato eventi, quanti, in quali province, quando è stata letta. Il testo delle pagine non è salvato.',
    generato: oggi,
    fonti,
  }, null, 1) + '\n',
);

// 3) docs/fonti.md
const conEventi = fonti.filter((f) => f.eventi > 0);
const social = conEventi.filter((f) => SOCIAL.test(f.dominio));
const sitiConEventi = conEventi.filter((f) => !SOCIAL.test(f.dominio));
const dominiConEventi = new Set(sitiConEventi.map((f) => f.dominio));
const senzaEventi = fonti.filter((f) => f.eventi === 0 && !dominiConEventi.has(f.dominio));
const falliti = senzaEventi.filter((f) => !SOCIAL.test(f.dominio) && (f.esito.startsWith('errore') || f.esito === 'vuota'));

const L = [];
L.push('# Fonti consultate');
L.push('');
L.push('File generato da `scripts/fonti.mjs`: non modificarlo a mano. I dati grezzi sono in `ricerca/fonti.json` (una riga per pagina) e `ricerca/fonti-consultate.json` (pagine aperte e ricerche fatte).');
L.push('');
L.push(`Aggiornato il ${oggi}. **${sitiConEventi.length} pagine di ${dominiConEventi.size} siti** hanno dato eventi; ${social.length} fonti sono post di Instagram o Facebook; ${falliti.length} pagine non si sono lette (bloccate, vuote o errore); ${consultate.ricerche.length} ricerche già fatte.`);
L.push('');
L.push('## Come usarlo per aggiornare senza ricominciare');
L.push('');
L.push('1. Scegli la zona (regione o provincia) nelle sezioni sotto e riapri con `fetch_content` le pagine indicate in «Pagina da riaprire», **prima quelle con l\'ultima lettura più vecchia**. Sono i calendari e le agende che hanno già dato eventi: non serve cercarli di nuovo.');
L.push('2. Confronta con `src/data/eventi.json` (stesso titolo e stessa data = già presente) e aggiungi solo gli eventi nuovi o i cambi di data, annullamenti e rinvii.');
L.push('3. Aggiorna `consultata` nelle fonti degli eventi toccati, poi lancia `node scripts/fonti.mjs`.');
L.push('4. Se una pagina non si apre più o è cambiata, scrivila in `ricerca/fonti-consultate.json` (campo `pagine`: `url`, `esito`, `data`) e cerca un\'alternativa, senza rifare le ricerche dell\'intera zona. Le ricerche già fatte sono in quel file, campo `ricerche`.');
L.push('5. Per Instagram non serve nulla: il controllo automatico legge ogni ora gli account di `ricerca/instagram-account.json`.');
L.push('');
L.push('Regole che valgono sempre: mai copiare il testo delle pagine, mai contatti privati, data di inizio e luogo precisi scritti nella pagina letta (non nelle anteprime di ricerca).');
L.push('');
L.push('## Fonti che hanno dato eventi, per zona');
L.push('');

for (const r of territorio.regioni) {
  const provReg = territorio.province.filter((p) => p.regione === r.codiceIstat);
  const blocchi = [];
  for (const p of provReg) {
    const righe = new Map(); // dominio -> { eventi, pagine:Map(url->n), tipi, nomi, consultata }
    for (const f of sitiConEventi) {
      if (!f.province.includes(p.sigla)) continue;
      const d = righe.get(f.dominio) ?? { eventi: 0, pagine: new Map(), tipi: new Map(), nomi: new Map(), consultata: '' };
      d.eventi += f.eventi;
      d.pagine.set(f.url, f.eventi);
      d.tipi.set(f.tipo, (d.tipi.get(f.tipo) ?? 0) + f.eventi);
      d.nomi.set(f.nome, (d.nomi.get(f.nome) ?? 0) + f.eventi);
      if (f.consultata > d.consultata) d.consultata = f.consultata;
      righe.set(f.dominio, d);
    }
    if (!righe.size) continue;
    const tab = [...righe.entries()].sort((a, b) => b[1].eventi - a[1].eventi);
    blocchi.push(`### ${p.nome} (${p.sigla})\n\n| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |\n|---|---|---:|---|---|\n` + tab.map(([dom, d]) => {
      const pag = [...d.pagine.entries()].sort((a, b) => b[1] - a[1] || a[0].length - b[0].length);
      const altre = pag.length > 1 ? ` (+${pag.length - 1} altre pagine)` : '';
      return `| ${piuFrequente(d.nomi).replace(/\|/g, '/') || dom} | ${piuFrequente(d.tipi)} | ${d.eventi} | ${pag[0][0]}${altre} | ${d.consultata} |`;
    }).join('\n'));
  }
  if (blocchi.length) L.push(`## ${r.nome}\n\n${blocchi.join('\n\n')}\n`);
}

L.push('## Instagram e Facebook');
L.push('');
L.push(`${social.length} fonti sono post di Instagram o Facebook, letti dal controllo automatico (\`ricerca/instagram-account.json\`, \`scripts/controlla-instagram.mjs\`). Si trovano in \`ricerca/fonti.json\`. Non si riaprono a mano: non accedere mai con l'account personale.`);
L.push('');
L.push('## Pagine che non si sono lette');
L.push('');
L.push('Provate dagli agenti e non utilizzabili. Non riprovare con gli stessi strumenti: cerca una fonte alternativa (Comune, Pro Loco, teatro, portale turistico) o aspetta che il sito cambi. Gli errori `bot_blocked`, `login_required` e le pagine «vuote» sono quasi sempre siti che caricano il contenuto con JavaScript o bloccano i robot.');
L.push('');
const perEsito = new Map();
for (const f of falliti) perEsito.set(f.esito, [...(perEsito.get(f.esito) ?? []), f]);
for (const [esito, lista] of [...perEsito.entries()].sort((a, b) => b[1].length - a[1].length)) {
  L.push(`### ${esito} (${lista.length})`);
  L.push('');
  L.push(lista.map((f) => `- ${f.url}`).join('\n'));
  L.push('');
}
const sensaFalliti = senzaEventi.filter((f) => f.esito === 'letta' && !SOCIAL.test(f.dominio)).length;
L.push('## Pagine aperte che non hanno dato eventi');
L.push('');
L.push(`${sensaFalliti} pagine sono state lette ma non hanno prodotto eventi (data o luogo mancanti, già passati, già presenti, fuori zona). Elenco in \`ricerca/fonti.json\` (\`eventi: 0\`, \`esito: letta\`): utile per non riaprirle inutilmente.`);
L.push('');
writeFileSync('docs/fonti.md', L.join('\n'));
console.log(`fonti.json: ${fonti.length} pagine; docs/fonti.md: ${sitiConEventi.length} pagine con eventi su ${dominiConEventi.size} siti, ${falliti.length} non lette, ${sensaFalliti} senza eventi.`);
