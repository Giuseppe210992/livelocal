// llms.txt: spiega agli assistenti AI cosa c'è nel sito e dove sono i dati.
// È una convenzione proposta (llmstxt.org), non uno standard ufficiale.
import type { APIRoute } from 'astro';
import { prossimi, localita, comuniConPagina } from '../lib/eventi';
import { quandoEsteso } from '../lib/date';
import { regioni, provinceDi, comuni, percorsoRegione, percorsoProvincia, percorsoComune, nomeProvincia, inRegione } from '../lib/luoghi';
import { SITO, urlAssoluto } from '../lib/sito';

export const GET: APIRoute = () => {
  const righe = [
    `# ${SITO.nome}`,
    '',
    `> ${SITO.descrizione} Ogni evento ha una pagina propria con dati strutturati schema.org/Event. Gli eventi sono controllati prima della pubblicazione e ogni pagina indica la fonte.`,
    '',
    `Lingua: italiano. Fuso orario: Europe/Rome. Zona coperta: ${regioni.map((r) => r.nome).join(' e ')} (Italia). Gli eventi passati restano online come archivio.`,
    `Calendar of public local events in ${regioni.map((r) => r.nome).join(' and ')}, Italy. Content in Italian.`,
    '',
    '## Dati',
    '',
    `- [eventi.json](${urlAssoluto('/eventi.json')}): tutti gli eventi in JSON (titolo, date ISO 8601, luogo, coordinate, prezzo, stato, fonti)`,
    `- [eventi.ics](${urlAssoluto('/eventi.ics')}): calendario iCalendar`,
    `- [feed.xml](${urlAssoluto('/feed.xml')}): feed RSS dei nuovi eventi`,
    `- [sitemap.xml](${urlAssoluto('/sitemap.xml')}): elenco di tutte le pagine`,
    '',
    '## Luoghi',
    '',
    ...regioni.flatMap((r) => [
      `- [Eventi ${inRegione(r)}](${urlAssoluto(percorsoRegione(r))})`,
      ...provinceDi(r).map((p) => `  - [${nomeProvincia(p)}](${urlAssoluto(percorsoProvincia(p))})`),
    ]),
    '',
    '## Comuni con eventi',
    '',
    ...comuniConPagina(comuni).map((c) => `- [Eventi a ${c.nome}](${urlAssoluto(percorsoComune(c))})`),
    '',
    '## Prossimi eventi',
    '',
    ...prossimi().map((e) => `- [${e.titolo}](${urlAssoluto(e.percorso)}): ${quandoEsteso(e.inizio, e.fine)}, ${e.luogo}, ${localita(e)}`),
    '',
  ];
  return new Response(righe.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
