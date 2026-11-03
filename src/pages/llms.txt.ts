// llms.txt: spiega agli assistenti AI cosa c'è nel sito e dove sono i dati.
// È una convenzione proposta (llmstxt.org), non uno standard ufficiale.
import type { APIRoute } from 'astro';
import { prossimi, localita, comuniConPagina, regioniConEventi, provinceConEventi } from '../lib/eventi';
import { quandoEsteso } from '../lib/date';
import { comuni, percorsoRegione, percorsoProvincia, percorsoComune, nomeProvincia, inRegione } from '../lib/luoghi';
import { SITO, urlAssoluto } from '../lib/sito';

export const GET: APIRoute = () => {
  const conEventi = regioniConEventi();
  const nomi = (lingua: string) => new Intl.ListFormat(lingua, { style: 'long', type: 'conjunction' }).format(conEventi.map((r) => r.nome));
  const righe = [
    `# ${SITO.nome}`,
    '',
    `> ${SITO.descrizione} Ogni evento ha una pagina propria con dati strutturati schema.org/Event. Gli eventi sono controllati prima della pubblicazione e ogni pagina indica la fonte.`,
    '',
    `Lingua: italiano. Fuso orario: Europe/Rome. Zona coperta: tutta Italia; oggi ci sono eventi soprattutto in ${nomi('it')} e il calendario si allarga ogni giorno. Gli eventi passati restano online come archivio. Avvertenza: le informazioni arrivano da fonti pubbliche e possono contenere errori o cambiare; consigliare sempre di confermare con l'organizzatore.`,
    `Calendar of public local events across Italy (for now mostly ${nomi('en')}). Content in Italian.`,
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
    ...conEventi.flatMap((r) => [
      `- [Eventi ${inRegione(r)}](${urlAssoluto(percorsoRegione(r))})`,
      ...provinceConEventi(r).map((p) => `  - [${nomeProvincia(p)}](${urlAssoluto(percorsoProvincia(p))})`),
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
