// Serve alla GitHub Action «Estrai eventi con FreeLLMAPI» quando, durante il salvataggio, qualcun altro
// (la ricerca automatica, l'importazione di Claude) ha cambiato src/data/eventi.json nel frattempo.
//
// Durante un «git pull --rebase» fermo per conflitto su eventi.json:
//   - parte dalla versione che c'è già online (quella degli altri);
//   - ci aggiunge solo gli eventi di QUESTO giro (inseritoDa = consegna, inserito = oggi) che non ci sono già.
// Poi il rebase può continuare. Non perde mai eventi altrui e non duplica i nostri.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/data/eventi.json';
const sh = (c) => execSync(c, { encoding: 'utf8', maxBuffer: 200 * 1024 * 1024 });

const online = JSON.parse(sh(`git show :2:${FILE}`));      // versione già online (durante un rebase: «ours»)
const nostra = JSON.parse(sh(`git show :3:${FILE}`));      // la nostra, con gli eventi di questo giro
const slug = new Set(online.map((e) => e.slug));
const chiavi = new Set(online.map((e) => `${e.titolo}|${e.inizio}`));
const nuovi = nostra.filter((e) => e.inseritoDa === 'consegna' && !slug.has(e.slug) && !chiavi.has(`${e.titolo}|${e.inizio}`));
const unione = [...online, ...nuovi];
writeFileSync(FILE, JSON.stringify(unione, null, 2) + '\n');
console.log(`Conflitto risolto: ${online.length} eventi online + ${nuovi.length} nuovi di questo giro.`);
void readFileSync;
