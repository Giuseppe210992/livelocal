// Serve alle GitHub Action di estrazione automatica (FreeLLMAPI) quando, durante il salvataggio, qualcun altro
// (la ricerca automatica, l'importazione di Claude, il controllo Instagram) ha cambiato gli stessi file nel frattempo.
//
// Durante un «git pull --rebase» fermo per conflitto, per ciascun file in conflitto:
//   - src/data/eventi.json            parte dalla versione online e aggiunge solo gli eventi di QUESTO giro
//                                     (inseritoDa = consegna) che non ci sono già;
//   - ricerca/comuni-progresso.json   unisce i comuni: vale la versione più recente per ogni comune;
//   - ricerca/automazione-stato.json  unisce le fonti: vale la nostra riga per le fonti lavorate in questo giro.
// Poi il rebase può continuare. Non perde mai dati altrui e non duplica i nostri.
// Se ci sono conflitti su altri file, esce con errore (la Action ferma il rebase e riprova).

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 300 * 1024 * 1024 });
const leggi = (stadio, f) => JSON.parse(sh(`git show :${stadio}:${f}`)); // 2 = versione online («ours» nel rebase), 3 = la nostra
const scrivi = (f, o, sp = 2) => writeFileSync(f, JSON.stringify(o, null, sp) + '\n');

const risolutori = {
  'src/data/eventi.json': (f) => {
    const online = leggi(2, f), nostra = leggi(3, f);
    const slug = new Set(online.map((e) => e.slug));
    const chiavi = new Set(online.map((e) => `${e.titolo}|${e.inizio}`));
    const nuovi = nostra.filter((e) => e.inseritoDa === 'consegna' && !slug.has(e.slug) && !chiavi.has(`${e.titolo}|${e.inizio}`));
    scrivi(f, [...online, ...nuovi], 2);
    return `${online.length} eventi online + ${nuovi.length} nuovi`;
  },
  'ricerca/comuni-progresso.json': (f) => {
    const online = leggi(2, f), nostra = leggi(3, f);
    const fatti = { ...online.fatti };
    for (const [k, v] of Object.entries(nostra.fatti ?? {})) if (!fatti[k] || String(v.data) >= String(fatti[k].data)) fatti[k] = v;
    scrivi(f, { ...online, fatti }, 1);
    return `${Object.keys(fatti).length} comuni`;
  },
  'ricerca/comuni-abitanti.json': (f) => { scrivi(f, leggi(2, f), 0); return 'versione online'; },
  'ricerca/comuni-pagine.json': (f) => {
    const online = leggi(2, f), nostra = leggi(3, f);
    scrivi(f, { ...online, ...nostra }, 0);
    return `${Object.keys({ ...online, ...nostra }).length} pagine`;
  },
  'ricerca/automazione-stato.json': (f) => {
    const online = leggi(2, f), nostra = leggi(3, f);
    scrivi(f, { ...online, fonti: { ...online.fonti, ...nostra.fonti } }, 1);
    return `${Object.keys({ ...online.fonti, ...nostra.fonti }).length} fonti`;
  },
};

const inConflitto = sh('git diff --name-only --diff-filter=U').split('\n').filter(Boolean);
const sconosciuti = inConflitto.filter((f) => !risolutori[f]);
if (sconosciuti.length) { console.error('Conflitto su file che non so unire:', sconosciuti.join(', ')); process.exit(1); }
for (const f of inConflitto) console.log(`Conflitto risolto in ${f}: ${risolutori[f](f)}`);
