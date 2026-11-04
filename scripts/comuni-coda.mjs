// Coda dei comuni italiani in ordine alfabetico, per il censimento comune per comune.
// Uso:
//   node scripts/comuni-coda.mjs prossimi 12        stampa (JSON) i prossimi 12 comuni non ancora fatti
//   node scripts/comuni-coda.mjs segna file.json    registra l'esito: [{codice, esito, eventi, note}]
//   node scripts/comuni-coda.mjs stato              quanti comuni sono fatti, dove siamo arrivati
// Lo stato è in ricerca/comuni-progresso.json (solo codice, data, esito, numero di eventi).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const province = new Map(territorio.province.map((p) => [p.codiceIstat, p]));
const ordinati = [...territorio.comuni].sort((a, b) => a.nome.localeCompare(b.nome, 'it') || a.codiceIstat.localeCompare(b.codiceIstat));
const FILE = 'ricerca/comuni-progresso.json';
const prog = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : { _nota: 'Comuni già censiti, in ordine alfabetico (scripts/comuni-coda.mjs). esito: eventi | nessun-evento | fonti-illeggibili.', fatti: {} };
const [cmd, arg] = process.argv.slice(2);

if (cmd === 'prossimi') {
  const n = Number(arg ?? 12);
  const out = ordinati.filter((c) => !prog.fatti[c.codiceIstat]).slice(0, n)
    .map((c) => ({ codice: c.codiceIstat, nome: c.nome, provincia: province.get(c.provincia).sigla }));
  console.log(JSON.stringify(out));
} else if (cmd === 'segna') {
  const oggi = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
  for (const r of JSON.parse(readFileSync(arg, 'utf8'))) prog.fatti[r.codice] = { data: oggi, esito: r.esito, eventi: r.eventi ?? 0 };
  writeFileSync(FILE, JSON.stringify(prog, null, 1) + '\n');
  console.log('registrati', Object.keys(prog.fatti).length);
} else {
  const fatti = ordinati.filter((c) => prog.fatti[c.codiceIstat]);
  const ultimo = fatti.at(-1);
  console.log(`${fatti.length} comuni su ${ordinati.length} (${((fatti.length / ordinati.length) * 100).toFixed(1)}%). Ultimo: ${ultimo ? ultimo.nome : '-'}`);
}
