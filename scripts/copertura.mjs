// Mappa della copertura: quanti eventi ci sono per regione e provincia, e dove non c'è ancora niente.
// Si lancia con:  node scripts/copertura.mjs
// Scrive docs/copertura.md. La ricerca automatica lo lancia a ogni giro, per sapere dove lavorare.
// Conta solo gli eventi «pubblicato». «In programma» = non ancora finiti alla data di oggi.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const eventi = JSON.parse(readFileSync('src/data/eventi.json', 'utf8')).filter((e) => e.stato === 'pubblicato');
const territorio = JSON.parse(readFileSync('src/data/territorio.json', 'utf8'));
const comuni = new Map(territorio.comuni.map((c) => [c.codiceIstat, c]));
const province = new Map(territorio.province.map((p) => [p.codiceIstat, p]));
const regioni = new Map(territorio.regioni.map((r) => [r.codiceIstat, r]));

const oggi = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' }); // AAAA-MM-GG
const inProgramma = (e) => (e.fine ?? e.inizio).slice(0, 10) >= oggi;

const perProvincia = new Map([...province.keys()].map((k) => [k, { tot: 0, prog: 0 }]));
for (const e of eventi) {
  const c = comuni.get(e.comune);
  if (!c) continue;
  const riga = perProvincia.get(c.provincia);
  if (!riga) continue;
  riga.tot++;
  if (inProgramma(e)) riga.prog++;
}

const righeRegioni = [];
const vuote = [];
for (const r of territorio.regioni) {
  const prov = territorio.province.filter((p) => p.regione === r.codiceIstat);
  const tot = prov.reduce((s, p) => s + perProvincia.get(p.codiceIstat).tot, 0);
  const prog = prov.reduce((s, p) => s + perProvincia.get(p.codiceIstat).prog, 0);
  const conEventi = prov.filter((p) => perProvincia.get(p.codiceIstat).tot > 0).length;
  righeRegioni.push({ nome: r.nome, tot, prog, conEventi, province: prov.length });
  for (const p of prov) if (perProvincia.get(p.codiceIstat).prog === 0) vuote.push(`${p.nome} (${p.sigla}), ${r.nome}`);
}

let instagram = '';
if (existsSync('ricerca/instagram-nuovi.json')) {
  const n = JSON.parse(readFileSync('ricerca/instagram-nuovi.json', 'utf8')).numeri;
  if (n) {
    instagram =
      `\n## Instagram\n\n- Account leggibili ogni giorno: **${n.accountLeggibili}**\n` +
      `- Candidati in attesa di essere valutati: ${n.candidatiInAttesa}\n` +
      `- Account provati e non adatti o non leggibili: ${n.scartati + n.accountNonLeggibili}\n` +
      `- Link a post in attesa di controllo: ${n.linkInAttesa}\n`;
  }
}

const tot = eventi.length;
const prog = eventi.filter(inProgramma).length;
let md = `# Copertura degli eventi (generato il ${oggi})\n\n`;
md += `File generato da \`scripts/copertura.mjs\`: non modificarlo a mano.\n\n`;
md += `**${tot} eventi pubblicati, ${prog} in programma.** Province con almeno un evento in programma: **${110 - vuote.length} su 110**.\n\n`;
md += `## Per regione\n\n| Regione | Pubblicati | In programma | Province con eventi |\n|---|---:|---:|---:|\n`;
for (const r of righeRegioni.sort((a, b) => b.prog - a.prog)) {
  md += `| ${r.nome} | ${r.tot} | ${r.prog} | ${r.conEventi} / ${r.province} |\n`;
}
md += `\n## Province senza eventi in programma (da cercare per prime)\n\n`;
md += vuote.length ? vuote.map((v) => `- ${v}`).join('\n') + '\n' : 'Nessuna: tutte le province hanno almeno un evento.\n';
md += instagram;
writeFileSync('docs/copertura.md', md);
console.log(`${tot} pubblicati, ${prog} in programma, ${vuote.length} province senza eventi in programma.`);
