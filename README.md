# SuccedeQui

**Gli eventi vicino a te.** Calendario gratuito e pubblico degli eventi del territorio, leggibile da Google e dagli assistenti AI. Zona pilota: Minturno con le frazioni.

Un progetto promosso da [Room & Relax Scauri](https://roomandrelax.it).

## Come è fatto

Il sito è fatto di **pagine statiche**: l'HTML è già pronto, non serve JavaScript per leggerlo. È così che lo leggono bene anche i crawler delle IA.

```
succedequi/
├── src/data/
│   ├── eventi.json      ← GLI EVENTI (qui si aggiunge o si modifica un evento)
│   ├── luoghi.json      ← regioni, province, comuni (codice ISTAT) e frazioni
│   └── categorie.json   ← elenco delle categorie
├── src/pages/           ← una cartella per ogni tipo di pagina
│   ├── index.astro                        → /
│   ├── eventi/[regione]/.../[frazione]/   → /eventi/lazio/latina/minturno/scauri/
│   ├── evento/[anno]/[slug]/              → /evento/2026/calici-a-corte-minturno/
│   ├── mappa/, vicino-a-me/               → mappa per giorno e ricerca per distanza
│   └── eventi.json.ts, eventi.ics.ts, feed.xml.ts, sitemap.xml.ts, robots.txt.ts, llms.txt.ts
├── src/lib/             ← logica: date, luoghi, eventi, dati per Google (JSON-LD), calendario
├── src/components/      ← pezzi riusati (scheda evento, briciole di pane, Esplora = mappa)
├── src/scripts/esplora.ts ← l'unico JavaScript: mappa, scelta del giorno, posizione del telefono
├── src/styles/          ← grafica
└── scripts/controlla.mjs ← controlli automatici dopo ogni costruzione
```

## Mappa e "vicino a me"

- `/mappa/` e `/vicino-a-me/` usano lo stesso strumento: si sceglie il giorno (tutti, weekend, i prossimi 14 giorni o una data qualsiasi) e, se si vuole, la propria posizione con raggio 10, 25 o 50 km.
- La **posizione del telefono** si chiede solo quando si tocca "Usa la mia posizione". Le distanze si calcolano nel telefono: la posizione non viene salvata né inviata, e non finisce nell'indirizzo della pagina. Se il permesso è negato, la pagina spiega come riattivarlo e si può scegliere un paese di partenza.
- La mappa è **Leaflet + OpenStreetMap**, senza chiavi a pagamento. Le tessere della mappa arrivano dai server di OpenStreetMap: va scritto nella privacy policy.
- Senza JavaScript la pagina mostra comunque l'elenco dei prossimi eventi.
- L'indirizzo ricorda le scelte, così un link si può condividere: `/mappa/?giorno=2026-11-08`, `/mappa/?da=scauri&r=10`.

## Pubblicazione

GitHub Pages, con la GitHub Action `.github/workflows/pubblica.yml`: parte a ogni modifica su `main`, ogni ora e a mano (Actions → Pubblica il sito → Run workflow). Se un controllo fallisce, il sito online resta quello di prima.

## Aggiungere un evento (per ora a mano)

Apri `src/data/eventi.json` e copia un evento esistente. I campi:

| Campo | Cosa scrivere |
|---|---|
| `slug` | parte finale dell'indirizzo: titolo + comune, minuscolo, con trattini. **Una volta pubblicato non si cambia più** |
| `titolo` | nome dell'evento |
| `categoria` | uno degli `slug` di `categorie.json` (es. `sagra`, `concerto`) |
| `inizio`, `fine` | ora italiana: `2026-11-06T19:00`, oppure solo il giorno `2026-11-07`. `fine` può essere `null` |
| `luogo`, `indirizzo` | nome del posto e via |
| `comune` | codice ISTAT del comune (Minturno = `059014`) |
| `frazione` | `slug` della frazione (es. `scauri`) oppure `null` per il capoluogo |
| `lat`, `lon` | coordinate. Se sono quelle del centro paese, metti `coordinateApprossimate: true` |
| `descrizione` | 2-5 righe **con parole proprie**, mai copiate da altri siti |
| `prezzo` | `{ "tipo": "gratuito" }`, `{ "tipo": "euro", "importo": 5 }`, `{ "tipo": "offerta" }` o `{ "tipo": "non-indicato" }` |
| `organizzatore` | nome pubblico (Pro Loco, associazione...) oppure `null` |
| `stato` | `pubblicato`, `annullato`, `rinviato` (senza nuova data) o `in-revisione` (non appare) |
| `inizioPrecedente` | se l'evento è stato spostato: la vecchia data di inizio. Altrimenti `null` |
| `fonti` | da dove arriva la notizia: nome, tipo (`ufficiale`, `stampa`, `aggregatore`, `organizzatore`), link, data del controllo |
| `inserito` | data di inserimento |

**Annullato o rinviato:** si cambia lo `stato`, la pagina non si cancella. **Eventi passati:** restano online come archivio, il sito li segna "Concluso" da solo.

Dalla Fase 2 gli eventi arriveranno dal Google Foglio pubblico, senza toccare questo file.

## Regole che il sito fa rispettare da solo

La costruzione del sito **si ferma con un errore** se:

- un evento contiene un'email o un numero di telefono (i contatti degli organizzatori non si pubblicano mai);
- manca un campo obbligatorio, la categoria o il comune non esistono, due eventi hanno lo stesso indirizzo;
- una pagina evento non ha i dati strutturati completi per Google;
- c'è un link interno rotto, o due pagine hanno lo stesso titolo.

## Comandi (per chi lavora al codice)

```bash
npm install        # la prima volta
npm run dev        # anteprima mentre si lavora: http://localhost:4321
npm run build      # costruisce il sito in dist/ ed esegue i controlli
```

Variabili facoltative: `SITE_URL` (indirizzo pubblico, predefinito `https://succedequi.it`) e `BASE_PATH` (sottocartella, es. `/succedequi` per GitHub Pages senza dominio).

## Decisioni ancora aperte

- **Categorie:** al brief è stata aggiunta "Apertura straordinaria" (musei e siti aperti gratis o in giorni speciali). Da confermare.
- **Frazioni:** pubblicate le 6 frazioni citate dal portale turistico locale e da Wikipedia (Scauri, Marina di Minturno, Tremensuoli, Tufo, Santa Maria Infante, Pulcherini). Wikipedia cita anche Fontana Perrelli e Solacciano: da verificare con il Comune.
- **Licenza dei dati aperti** (`eventi.json`): da decidere. Proposta: CC BY 4.0, riuso libero citando SuccedeQui.
