# LiveLocal (ex SuccedeQui) — brief di progetto per Claude Code

> Sintesi della conversazione del 2 novembre 2026 tra Giuseppe Di Buccio e Claude.
> Usa questo file come `CLAUDE.md` nella cartella principale del repository, oppure incollalo come primo messaggio.
> Documento di struttura completo (con diagrammi): https://claude.ai/artifact/E66BoBLv9Ak3hDsTUvVvYV

---

## 1. Chi è l'utente e come lavorare con lui

- **Giuseppe Di Buccio**, gestisce il B&B Room & Relax a Scauri (Minturno, provincia di Latina, Lazio). Lavora nell'immobiliare. Sviluppa per hobby.
- **Lavora quasi solo da smartphone Android.** Ogni istruzione che deve eseguire lui va pensata per il telefono: browser, app GitHub, app Google Fogli. Niente terminale sul suo lato.
- **Lingua: italiano**, sia nella conversazione che nel sito.
- **Metodo: un passo alla volta, con un controllo dopo ogni passo.** Mostra un risultato visibile, aspetta la sua conferma, poi vai avanti. Niente consegne enormi tutte in una volta.
- Ha già: account GitHub **GioTec21** (usa GitHub Pages: giotec21.github.io), il dominio **roomandrelax.it** su Register.it con il sottodominio app.roomandrelax.it puntato su GitHub Pages, un progetto Firebase (usato per un'altra cosa), Google Drive.

## 2. L'idea

Un **calendario unico, gratuito e pubblico degli eventi del territorio** (mostre, visite guidate, concerti, sagre, feste, conferenze, mercatini…), consultabile da chiunque e **leggibile da Google e dagli agenti/motori AI**.

Nasce da un problema reale: a Sant'Agata dei Goti un bell'evento culturale in un palazzo ducale non era pubblicizzato, e nemmeno chiedendo a un'IA si trovava. Gli aggregatori esistenti (es. eventiesagre.it, il calendario regionale delle sagre della Campania) non ricevono gli eventi piccoli: chi li organizza mette una locandina su Facebook e basta.

**Il valore sta nella raccolta attiva** degli eventi (Pro Loco, associazioni, parrocchie, musei, ufficio cultura del Comune) e nel renderli leggibili alle macchine. Non nel sito in sé.

## 3. Decisioni prese

| Tema | Decisione |
|---|---|
| Nome | **LiveLocal** — slogan "Gli eventi vicino a te". Deciso da Giuseppe il 02/11/2026 al posto di SuccedeQui (primo nome) |
| Dominio | **Da decidere.** livelocal.com è già registrato da altri (dal 1998, verificato via RDAP il 02/11/2026). livelocal.it da verificare su Register.it. I domini succedequi.it/.com non servono più |
| Nomi scartati | eventiitaly (resta come riserva), eventitaly / eventoday / eventiqui / eventivicini (già presi), relaxevent (legato al B&B, vedi sotto) |
| Neutralità | Il sito è **neutro**, non è un sito del B&B. Altrimenti Comune, Pro Loco e altre strutture non contribuiscono. Room & Relax compare solo come **"Un progetto promosso da Room & Relax Scauri"** nel footer, con link a roomandrelax.it |
| Zona pilota | **Minturno, con tutte le frazioni** (sicuramente Scauri e Marina di Minturno; elenco completo delle frazioni da verificare su fonte ufficiale). Ogni frazione ha una sua pagina, perché molti cercano "eventi Scauri" e non "eventi Minturno" |
| Espansione | Fase 3: comuni confinanti (Formia, Santi Cosma e Damiano, Castelforte, Sessa Aurunca, Spigno Saturnia), poi le province. La struttura deve reggere tutta Italia fin dall'inizio |
| Costi | Quasi zero: solo il dominio (~10-15 €/anno). Tutto il resto con strumenti gratuiti |
| Monetizzazione | **Nessuna all'inizio.** Niente pubblicità, niente tracciamento |

### Contesto fiscale e legale (per non fare scelte tecniche sbagliate)
- Giuseppe non ha partita IVA. Un sito informativo gratuito si può gestire da privato.
- Sponsor fissi in futuro = attività abituale → servirà partita IVA (che sta già valutando) oppure un'associazione/APS. Si decide più avanti con un commercialista. **Non costruire ora sistemi di pagamento o pubblicità.**
- Servono **privacy policy** (raccogliamo nome e contatto degli organizzatori). Se non usi cookie di tracciamento né analytics, **non serve il banner cookie**: tienilo così.
- I contatti degli organizzatori **non vanno mai pubblicati** e non devono mai finire nel repository pubblico.

## 4. Architettura tecnica

**Principio chiave: pagine statiche già pronte in HTML.** Molti crawler AI non eseguono JavaScript, quindi i contenuti non devono dipendere da JS lato client. Il JS serve solo per comodità: ricerca per raggio, filtri, mappa.

| Pezzo | Strumento | Note |
|---|---|---|
| Generatore del sito | **Astro** (output statico) | In alternativa Eleventy; scegli Astro salvo motivi forti |
| Modulo segnalazioni | **Google Moduli** | Lo crea Giuseppe a mano: tu prepari domande e testi pronti da copiare |
| Archivio e moderazione | **Google Fogli**, due fogli: **privato** (risposte complete con contatti) e **pubblico** (solo eventi approvati, **senza contatti**) | Giuseppe approva da telefono scrivendo "sì" in una colonna. Il foglio pubblico si genera dal privato (es. con QUERY/FILTER che escludono le colonne dei contatti) |
| Aggiornamento automatico | **GitHub Actions**, ogni ora + a ogni push | Scarica il CSV del foglio pubblico (URL in una variabile del repo), rigenera il sito e lo pubblica |
| Hosting | **GitHub Pages** sul repo `Giuseppe210992/livelocal`: https://giuseppe210992.github.io/livelocal/ | Dominio personalizzato in seguito (record DNS su Register.it + Custom domain in Settings → Pages, con guida passo passo per Android) |
| Mappa | **Leaflet + OpenStreetMap** | Senza chiavi a pagamento. Rispetta la policy d'uso delle tile OSM |
| Dati dei comuni | **Elenco ufficiale ISTAT** (codice, comune, provincia, regione) + coordinate del centro di ogni comune | Per il pilota bastano Minturno e le sue frazioni, ma lo schema deve già prevedere tutta Italia |
| Più avanti | Firebase per account di organizzatori fidati che pubblicano senza attesa | Non ora |

Finché gli eventi sono al massimo qualche migliaio, la ricerca per raggio funziona lato client su `eventi.json`. Oltre, serve un database con ricerca geografica.

## 5. Mappa delle pagine e URL

URL in minuscolo, senza accenti, con trattini. **Una volta pubblicati non cambiano mai.**

**Sfoglia per luogo**
- `/` — home: prossimi eventi, ricerca, "vicino a me"
- `/eventi/lazio/` — regione
- `/eventi/lazio/latina/` — provincia
- `/eventi/lazio/latina/minturno/` — comune
- `/eventi/lazio/latina/minturno/scauri/` — frazione
- `/evento/2026/<titolo>-<comune>/` — **pagina evento**: una per evento, URL unico e stabile, è la pagina che Google e le IA indicizzano. Lo slug deve essere unico: aggiungi comune e, se serve, la data.

**Trova**
- `/vicino-a-me/?r=25` — raggio 10, 25, 50, 100 km o `r=0` per tutta Italia (dal più vicino al più lontano). Usa la posizione del telefono con consenso; senza GPS si sceglie un comune come centro.
- `/oggi/`, `/weekend/` — anche per comune, es. "Oggi a Minturno", "Questo weekend in provincia di Latina"
- `/categoria/<categoria>/`
- `/mappa/` — eventi filtrati come puntine

**Partecipa**
- `/segnala/` — rimanda al Google Modulo, con spiegazione
- `/organizzatori/` — guida per chi organizza
- `/chi-siamo/`, `/privacy/`
- `/sostieni/` — fase 3, per ora non pubblicare

**File per le macchine**, rigenerati a ogni pubblicazione (dal 3/11/2026 non sono più linkati nel piè di pagina, per scelta di Giuseppe; restano raggiungibili e annunciati in `<head>`, `robots.txt` e `llms.txt`):
- `sitemap.xml`
- `robots.txt` — consenti Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended
- `llms.txt` — spiega alle IA cosa contiene il sito e dove sono i dati. È una convenzione proposta, non uno standard ufficiale
- `eventi.json` — API aperta
- `eventi.ics` — calendario da aggiungere a Google Calendar
- `feed.xml` — RSS

**Filtri su tutte le liste:** quando (oggi, weekend, questo mese, date a scelta), categoria, solo gratuiti.

## 6. Scheda evento (modello dati)

| Campo | Chi lo compila | Note |
|---|---|---|
| titolo | organizzatore | obbligatorio |
| categoria | organizzatore | mostra, visita guidata, concerto, teatro, sagra, festa religiosa, mercatino, conferenza, sport, bambini |
| inizio (data e ora) | organizzatore | obbligatorio, ISO 8601, fuso Europe/Rome |
| fine (data e ora) | organizzatore | consigliata; serve per le mostre di più giorni |
| luogo | organizzatore | nome del posto, es. "Palazzo Ducale" |
| indirizzo + comune (+ frazione) | organizzatore | comune scelto dall'elenco ISTAT, non scritto a mano |
| descrizione | organizzatore | 2-5 righe, con parole proprie, **mai copiate da altri siti** |
| prezzo | organizzatore | gratuito, prezzo in euro, oppure a offerta |
| prenotazione | organizzatore | link o telefono, facoltativo |
| locandina | organizzatore | solo con il permesso di pubblicarla |
| organizzatore | organizzatore | nome pubblico |
| contatto per verifiche | organizzatore | **privato, mai pubblicato, mai nel repo** |
| coordinate | sito | dalla puntina o dall'indirizzo |
| stato | sito / Giuseppe | in revisione, pubblicato, annullato, rinviato |
| fonte + data di inserimento | sito | |

- **Annullato o rinviato**: si aggiorna lo stato (e `eventStatus`), la pagina non si cancella.
- **Eventi passati**: restano online come archivio, segnati come conclusi.

## 7. Visibilità su Google e IA (requisiti obbligatori)

1. **JSON-LD schema.org `Event`** in ogni pagina evento, generato dalla scheda: `name`, `startDate`, `endDate`, `eventStatus`, `eventAttendanceMode` (offline), `location` (`Place` con `PostalAddress` e `geo`), `image`, `description`, `offers` (prezzo in EUR o gratuito, url), `organizer`. Riferimento: https://developers.google.com/search/docs/appearance/structured-data/event
2. Google accetta per la sua vetrina eventi **solo eventi in un luogo fisico e aperti al pubblico**, ciascuno con un **URL unico** e i dati strutturati su quell'URL.
3. Aggiungi `BreadcrumbList`, `title` e `meta description` unici, Open Graph, `<html lang="it">`, URL canonici.
4. Sito veloce e pensato prima di tutto per il telefono.
5. **Checkpoint**: le pagine evento devono superare il Test dei risultati multimediali di Google.
6. Dopo la messa online: registrazione su Google Search Console e Bing Webmaster Tools (con guida passo passo per Giuseppe).

## 8. Flusso di un evento (moderazione)

```
Chi organizza (Pro Loco, associazioni, comune, musei)
  → Google Modulo (da telefono, 2 minuti, nessun account) oppure WhatsApp a Giuseppe, che lo inserisce lui
  → Foglio PRIVATO (in revisione, con contatti)
  → Controllo di Giuseppe: ok?
       no → chiede correzioni o scarta
       sì → Foglio PUBBLICO (solo approvati, senza contatti)
  → GitHub Actions ogni ora rigenera il sito
  → Sito pubblicato (pagine, sitemap, JSON, ICS, RSS)
  → Google e agenti AI lo leggono
```

**Il controllo in 4 punti:**
1. L'evento esiste: contatto verificato o fonte ufficiale.
2. Data e luogo tornano.
3. Non è un doppione.
4. Testo e locandina si possono pubblicare.

Sul modulo servono anche una verifica anti-bot e l'informativa privacy. Gli organizzatori affidabili possono essere segnati come "fidati".

## 9. Fasi e checkpoint

**Fase 0 — Decisioni (tocca a Giuseppe)**
- [ ] Verificare su Register.it e registrare succedequi.it e succedequi.com
- [ ] Creare su GitHub il repository vuoto `succedequi` (account GioTec21)
- [ ] Facoltativo: prendere @succedequi su Instagram e Facebook
- [x] Fare l'elenco di Pro Loco, associazioni, parrocchie e luoghi di eventi di Minturno (fatto da Claude il 3/11/2026: `docs/organizzatori-da-seguire.md`, da far crescere)

**Fase 1 — Prototipo (1-2 settimane) ← INIZIA DA QUI**
- [ ] Progetto Astro con home, pagina comune Minturno (+ frazioni) e pagina evento
- [ ] **~10 eventi veri di Minturno**, ciascuno con la fonte annotata. **Non inventare eventi.** Se un evento non è verificabile, segnalo chiaramente come "ESEMPIO"
- [ ] Ricerca per comune e "vicino a me" funzionanti da telefono
- [ ] JSON-LD, sitemap, robots.txt, llms.txt, eventi.json, eventi.ics
- [ ] Footer "Un progetto promosso da Room & Relax Scauri"
- [ ] Pubblicazione su GitHub Pages: Giuseppe la apre dal telefono e dà l'ok
- [x] Checkpoint: una pagina evento supera il Test dei risultati multimediali di Google (3/11/2026: Museo archeologico di Formia, 2 elementi validi, Events + Breadcrumbs, solo avvisi non critici)

**Fase 2 — Pilota (1-2 mesi)**
- [ ] Google Modulo: testi e domande preparati da te, creato da Giuseppe
- [ ] Fogli privato/pubblico + GitHub Action ogni ora
- [ ] Pagine `/segnala/`, `/organizzatori/`, `/privacy/`, `/chi-siamo/`
- [ ] Dominio succedequi.it collegato a GitHub Pages
- [x] Search Console + Bing Webmaster Tools (3/11/2026)
- [ ] Contatti con Pro Loco, associazioni, area archeologica e ufficio cultura del Comune di Minturno
- [ ] Checkpoint: la maggior parte degli eventi arriva da altri, non inserita da Giuseppe

**Fase 3 — Estensione**
- [ ] Comuni confinanti, poi le province
- [ ] Versione in inglese
- [ ] Sponsor, dopo la scelta tra partita IVA e associazione

## 10. Regole per Claude Code

- Lavora **un passo alla volta**: a ogni passo mostra qualcosa che Giuseppe può aprire sul telefono, poi aspetta il suo ok.
- Spiegagli ciò che deve fare lui in passi numerati, pensati per **Android** (app GitHub, browser, app Google Fogli).
- Testi del sito in italiano, chiari e semplici.
- **Mai pubblicare contatti privati**, mai metterli nel repo. Niente tracker né cookie di profilazione.
- Niente contenuti copiati da altri siti: descrizioni riscritte, locandine solo con permesso.
- Tieni il codice semplice e documentato. Giuseppe è un hobbista e deve poterlo mantenere.

---

## 11. Stato dei lavori (aggiornato da Claude Code)

**Repository: `Giuseppe210992/livelocal`**, sito online su https://giuseppe210992.github.io/livelocal/ (GitHub Pages attivato da Giuseppe il 2 novembre 2026). **Il sito si chiama LiveLocal** (rinominato da SuccedeQui il 2 novembre 2026). Il codice è nella radice del repo, branch `main`. La copia in `Giuseppe210992/a` (cartella `succedequi/`) è ferma al passo 1 e non va più aggiornata.

**2 novembre 2026, sera — zona allargata e ricerca automatica (richiesta di Giuseppe):**
- Zona: **tutta Italia dal 3/11/2026** (20 regioni, 110 province, 7.896 comuni da confini ISTAT 1/1/2026 via Openpolis, CC BY 4.0; prima erano solo Lazio e Campania). Le pagine di regioni, province e comuni esistono solo quando hanno eventi. `src/data/territorio.json` è generato da `scripts/aggiorna-comuni.mjs`; le frazioni (solo Minturno) sono in `src/data/frazioni.json`.
- Mappa: casella "parti da" con tutti i comuni (elenco `/comuni.json`, caricato solo quando serve); `?da=<codice ISTAT>`.
- **Ricerca automatica con IA**: attività programmata di Claude Code due volte al giorno, procedura in `docs/ricerca-eventi.md`. Fonte ufficiale o organizzatore → pubblicato da solo; solo stampa o aggregatori → `in-revisione`, approvazione rispondendo all'email (`ok 1 3`). Le email vanno all'indirizzo che Giuseppe ha indicato (scritto solo nel testo dell'attività programmata, non nel repo pubblico).
- Attività programmata attiva: `trig_019yZWr1NBF4CcwD4nWiAhwD` («LiveLocal – ricerca eventi», 2:37 e 14:37 ora italiana), che lavora nella **sessione dedicata** `session_012jWfbWtmQWcixSF4zsY6Fc` (con Gmail, TinyFish e il repository). Il testo dell'attività si può cambiare **solo da quella sessione**, non da altre; la vera procedura è `docs/ricerca-eventi.md`, riletta a ogni giro, quindi basta aggiornare quel file. La vecchia `trig_01ENV7NRMW6Y2TPTZhvG3no8` è stata eliminata.
- **Regola confermata da Giuseppe il 3/11/2026 (opzione A)**: fonte dell'organizzatore (sito o profilo dell'evento) o ufficiale → online da solo; solo giornali o aggregatori → `in-revisione`, approvazione via email (`ok 1 3`). Primo giro di prova (Benevento, Avellino, Salerno): 4 eventi trovati e approvati da lui, pubblicati.
- **Questa regola cambia il brief**: prima "ogni evento passa dal controllo di Giuseppe"; ora il controllo in 4 punti lo fa l'IA per le fonti ufficiali. Proposta fatta a Giuseppe, da confermare; per tornare a "tutto da approvare" basta cambiare il punto 6 della procedura.
- **Fatto il 3/11:** pagine `/segnala/` e `/privacy/`, `src/data/impostazioni.json` (contatto pubblico consultec2192@gmail.com, scelto da Giuseppe), **modulo sul sito** `/segnala/modulo/` (pulsante «Invia per revisione», invio via Web3Forms → email a Giuseppe; collaudato in Chromium con servizio simulato, 8 scenari ok), guida `docs/modulo-segnalazioni.md`. **Collaudato dal vivo il 3/11/2026**: Giuseppe ha inviato una segnalazione di prova da livelocal.roomandrelax.it e l'email è arrivata (chiave Web3Forms inserita in `formKey`). **Sito spostato su https://livelocal.roomandrelax.it** (dominio collegato da Giuseppe; canonical e sitemap sempre https). Privacy policy: **letta e approvata da Giuseppe il 3/11/2026** (titolare e tempi di conservazione scelti da Claude e accettati da lui; non rivista da un professionista). Passo successivo = foglio pubblico senza contatti → CSV → sito.
- **3/11/2026 — ricerca entro 100 km da Minturno (richiesta di Giuseppe)**: aggiunti 43 eventi, 26 `pubblicato` (fonte ufficiale o dell'organizzatore: musei del Ministero della Cultura del 4 novembre, Maestri alla Reggia, Armonie in Movimento e Favole di Luce a Gaeta, mostra Càmpora a Campoli Appennino, musical «Scugnizzi» a Fondi) e 17 `in-revisione` **(approvati da Giuseppe e pubblicati il 3/11/2026, «ok tutti»)** (solo stampa o aggregatori: Borgo Divino a Formia, GRAPE a Riardo, Festa del Tartufo di Campoli, Inno al Novello di Mignano, Avion Travel e Strafelicissima a Formia, 5 spettacoli del Teatro D'Annunzio di Latina, 5 attività della Reggia di Caserta, mostra alle Gallerie d'Italia di Napoli). Scartati: «Parole e mestieri del Sud Pontino» (itinerante, nessun luogo e orario precisi, il sito dell'organizzatore non risponde), «Sei personaggi in cerca d'autore» al Teatro Ariston di Gaeta (solo biglietteria, pagina bloccata), mostra Colbert a Pompei (date in contrasto tra le fonti). Limiti: Facebook e Instagram non sono leggibili dagli strumenti; Napoli e Roma hanno molti più eventi di quelli trovati.
- **3/11/2026 — Facebook e Instagram (richiesta di Giuseppe)**: provato cosa si legge senza accedere. Instagram: post e reel sì, profili solo biografia. Facebook: i link ai singoli post delle pagine sì; pagine, eventi e quasi tutti i post dei gruppi no (chiedono l'accesso). Le anteprime della ricerca sui social sono inaffidabili (un reel 2025 compariva come 2026). Metodo e regole (mai accedere, fonte = account dell'organizzatore, gruppi solo per scoprire) in `docs/ricerca-eventi.md`, sezione «Facebook e Instagram», con un primo elenco di account da cercare. Con i post letti sono state confermate e arricchite Favole di Luce, Armonie in Movimento, Avion Travel (prezzi), Borgo Divino (fonte ufficiale del Comune di Formia) e GRAPE (account ufficiale della Pro Loco). Non usare l'account personale di Giuseppe per leggere i social: viola le regole di Meta e rischia il blocco dell'account.
- **3/11/2026 — Google Search Console verificata** (proprietà «Prefisso URL» `https://livelocal.roomandrelax.it/`, metodo tag HTML, account Google scelto da Giuseppe). Il codice è in `src/data/impostazioni.json` (`verificaGoogle`) e va lasciato lì, altrimenti la verifica decade. `verificaBing` è pronto ma vuoto (Bing si collega importando da Search Console). Sitemap inviata il 3/11: «Success», 112 pagine. Test dei risultati multimediali superato. **Bing Webmaster Tools collegato il 3/11**: l'importazione da Search Console ha funzionato (la pagina di Bing sembrava tornare alla scelta, ma il sito era già aggiunto); codice `msvalidate.01` comunque in `verificaBing`, da non togliere. Sitemap su Bing: 0 errori, 112 indirizzi. Possibile miglioramento: IndexNow (avvisa Bing a ogni pubblicazione).
- **3/11/2026 — richieste di Giuseppe (tutta Italia, Segnala, posizione, dati aperti, errori)**: (1) ricerca e sito per **tutta Italia**; la ricerca automatica ruota su 10 gruppi di regioni (ogni gruppo ogni 5 giorni) e guarda sempre la zona pilota di Minturno; (2) **pulsante «Segnala un evento»** nell'intestazione di ogni pagina, in home e in fondo a liste ed eventi; (3) **«Dati aperti» nascosti** dal piè di pagina (file e `<link>` nell'intestazione restano per Google e IA); (4) **posizione personale mai in automatico**: si usa solo toccando «Usa la mia posizione»; nuova distanza **«Tutta Italia»** e pulsante «cerca in tutta Italia» quando in zona non c'è nulla; (5) avviso **«Possono esserci errori»** nel piè di pagina, nelle pagine evento, nell'elenco della mappa e in `llms.txt`; (6) approvati e pubblicati i 3 eventi della ricerca automatica (Extinction a Salerno, sagre di Sorbo Serpico e Acerno); (7) elenco Pro Loco e associazioni in `docs/organizzatori-da-seguire.md` (albo di Minturno con 88 associazioni, Pro Loco del Golfo e del casertano); gli elenchi ufficiali di Regione Lazio e Campania non si scaricano dalla rete della sessione (siti bloccati).
- **3/11/2026 — prima ricerca in tutta Italia (richiesta di Giuseppe)**: aggiunti 31 eventi in 14 regioni: 19 `pubblicato` (portali turistici ufficiali di Lombardia, Calabria, Liguria, Piemonte, Emilia-Romagna, Toscana e Italia.it, più i siti degli organizzatori di Arte Laguna Prize e Eurochocolate) e 12 `in-revisione` **(approvati da Giuseppe e pubblicati il 3/11/2026, «ok tutti e 12»)** (Magie Barocche a Catania dal portale Visit Sicily, di cui non si è potuto leggere il piè di pagina; sagre di Puglia, Sardegna, Friuli e Abruzzo dagli articoli di SiViaggia). Scartati per luogo non preciso: Sherbeth Festival (Palermo), Sfincione Fest (Bagheria), Fiera di Sant'Andrea a Gorizia, Fiera di San Carlo ad Aiello. Mancano ancora Valle d'Aosta, Marche, Molise e Basilicata (non trovati eventi con fonte leggibile) e quasi tutto il Nord-Est oltre a Venezia. Dove OpenStreetMap non trova il luogo, o lo confonde con un altro comune (Conversano, Laconi), si usa il centro del paese con posizione indicativa.
- **3/11/2026 — collegamento a Facebook e Instagram**: `docs/collegamento-facebook-instagram.md` riassume le strade ufficiali di Meta (Instagram Business Discovery: praticabile con un account professionale di LiveLocal; Facebook Page Public Content Access: richiede App Review e verifica dell'attività, quindi un soggetto giuridico; Meta Content Library: solo ricerca accademica o non profit). Nessun connettore pronto legge le pagine altrui. Decisioni aperte per Giuseppe: creare Pagina Facebook e account Instagram «LiveLocal»; scegliere tra APS e partita IVA. **Passo successivo (3/11/2026, sera)**: Giuseppe ha chiesto le indicazioni per Instagram; guida in 3 parti (telefono, computer, poi Claude) nella sezione «Guida passo passo per la prova su Instagram» dello stesso file: si prova Business Discovery con il Graph API Explorer, senza creare un'app. Il token Meta non va mai in chat né nel repository. **Prova riuscita il 3/11/2026, sera**: Pagina «livelocal» e Instagram `livelocal21` creati e collegati, app Meta «LiveLocalEventi» in modalità sviluppo; Business Discovery ha letto da `pro_loco_riardo` follower, numero di post e gli ultimi post (testo, data, link) senza App Review né verifica dell'attività. Nota: l'Explorer richiede un'app e le autorizzazioni Instagram vanno attivate dal caso d'uso (dettagli in `docs/collegamento-facebook-instagram.md`). **Fatto lo stesso giorno**: token lungo (scade il **2 gennaio 2027**, rinnovo descritto nel file) salvato come segreto `META_TOKEN` di GitHub; controllo `scripts/controlla-instagram.mjs` + `.github/workflows/controlla-instagram.yml` (1:47 e 13:47 ora italiana) che scrive in `ricerca/instagram-nuovi.json` solo i link ai post che sembrano eventi (mai le didascalie); gli account sono in `ricerca/instagram-account.json`; la ricerca automatica li legge a ogni giro (sezione in `docs/ricerca-eventi.md`) e avvisa Giuseppe 14 giorni prima della scadenza. **Allargamento a tutta Italia (3/11/2026, sera, richiesta di Giuseppe: «censisci tutta Italia di eventi reali da tutti i profili possibili»)**: il controllo gira 4 volte al giorno, controlla fino a 250 account per lancio, **scopre da solo nuovi profili di enti** dai nomi citati nei post (entra solo chi ha nome o biografia da ente; persone e negozi scartati, nome e biografia non salvati), si ferma se Meta dice «troppe richieste»; `scripts/copertura.mjs` genera `docs/copertura.md` (eventi per regione e provincia, province vuote) e la procedura di ricerca lo usa per decidere dove lavorare («Censimento nazionale» in `docs/ricerca-eventi.md`). Punto di partenza: 101 eventi pubblicati, 35 province su 110 con eventi in programma, 48 account Instagram (45 leggibili). **Scoperta dei profili**: `scripts/scopri-account.mjs` (Wikidata, ogni 7 giorni: 717 candidati al primo lancio), `scripts/scopri-da-siti.mjs` (siti dei Comuni, 700 per lancio) e le citazioni nei post; il controllo gira ogni 3 ore con al massimo 190 chiamate (Meta tollera circa 200 all'ora). Le citazioni nei post sono poche (23 su 1.124 post): la crescita vera viene da Wikidata e dai siti dei Comuni. **Giri orari della ricerca (3/11/2026, sera, richiesta di Giuseppe)**: nuova attività programmata `trig_01SxzEGSiVztXDa9yf9sCBXE` («LiveLocal – giro orario della ricerca», ogni ora al minuto :59 UTC, legata alla sessione dedicata `session_012jWfbWtmQWcixSF4zsY6Fc`) in aggiunta ai due giri storici di `trig_019yZWr1NBF4CcwD4nWiAhwD` (2:37 e 14:37). Regole in `docs/ricerca-eventi.md`: budget per giro (15 ricerche, 30 pagine; **TinyFish search e fetch sono gratuiti e non toccano il credito, il limite vero è 1.000 pagine al giorno**; il portafoglio da 10 dollari serve solo a TinyAgent/TinyBrowser, che non usiamo, quindi la ricarica automatica non serve), email contenute (un solo riepilogo serale dopo le 20:00, richieste di approvazione al massimo ogni 6 ore). Per fermare i giri orari: `update_trigger` con `enabled=false` oppure `delete_trigger` su quell'identificativo. **Altre regioni, locandine e IndexNow (3/11/2026, sera, richiesta di Giuseppe)**: quattro ricerche per gruppi di regioni (Nord-Ovest, Nord-Est, Centro, Sud e isole) hanno aggiunto circa 130 eventi da portali turistici, calendari dei Comuni, teatri e musei; 191 locandine Instagram lette dalle immagini (scaricate con `curl` dagli indirizzi che il controllo salva, poi lette con `Read`; **l'ambiente «Predefinito» ha i domini `cdninstagram.com`, `fbcdn.net`, `*.cdninstagram.com`, `*.fbcdn.net` tra quelli consentiti**) hanno dato altri 40 circa; nuova categoria «cerimonia»; scartati consigli comunali, avvisi, bandi e passati (criteri in `docs/ricerca-eventi.md`, «4 bis»). Il flusso di lavoro per grandi lotti: `search` e `fetch_content` di TinyFish (max 14 ricerche e 30 pagine a testa), risultati in file JSON, controllo con uno script (formato, codice ISTAT, date, doppioni, contatti), poi unione in `eventi.json`. Eventi senza fonte ufficiale: `in-revisione` (approvazione di Giuseppe per email). **IndexNow** (`scripts/indexnow.mjs`, chiave in `public/`): avvisa Bing a ogni evento nuovo, perché ChatGPT non trovava le pagine del sito (il sito è leggibile, ma non ancora nell'indice dei motori). Controllo Instagram: orario, al massimo 150 chiamate (Meta ha risposto «limite dell'applicazione» dopo ~200 in un'ora: non fare lanci a mano ravvicinati). Stato al 3/11 sera: 239 eventi pubblicati, 70 province su 110 con eventi.
- **3/11/2026, sera — pagine «Oggi», «Domani», «Questo weekend»**: Gemini, interrogato su «eventi per domani su livelocal.roomandrelax.it», non trovava nulla (ChatGPT sì). Aggiunte `/oggi/`, `/domani/`, `/weekend/` (codice in `src/lib/giorni.ts` e `src/components/PaginaGiorno.astro`), con elenco in HTML e `ItemList` JSON-LD, rigenerate ogni ora dalla Action; collegate da menu, home, sitemap e `llms.txt`. Gemini usa l'indice di Google: il sito va ancora indicizzato (Search Console → Controllo URL → Richiedi indicizzazione per home, /domani/ e /oggi/).
- (Richiesta originale) modulo per segnalare un evento con solo **nome, cognome e cellulare** dell'organizzatore (Giuseppe verifica con una telefonata) e **notifica email** a lui. Il cellulare non va mai nel repo pubblico: serve un archivio privato (proposta: Google Apps Script + Google Foglio privato).

**2 novembre 2026 — Fase 1, passo 2 fatto:** pagine `/mappa/` e `/vicino-a-me/` (componente `Esplora.astro` + `src/scripts/esplora.ts`): giorno a scelta (tutti, weekend, 14 giorni, data libera), posizione del telefono con consenso oppure paese di partenza, raggio 10/25/50 km, mappa Leaflet + OSM. Collaudo automatico in Chromium: 10 scenari ok (giorni, weekend, data passata, posizione concessa/negata, senza JS). GitHub Action `pubblica.yml` (push su main + ogni ora + manuale). Giuseppe deve attivare Pages (Settings → Pages → Source: GitHub Actions).

**2 novembre 2026 — Fase 1, passo 1 fatto** (allora nel repo `Giuseppe210992/a`, cartella `succedequi/`).

- Il repo `succedequi` non esiste ancora. L'account GitHub collegato a Claude è **Giuseppe210992**, non GioTec21. Quando il repo esiste, la cartella `succedequi/` diventa la sua radice.
- Fatto: progetto Astro 7 statico; home; pagine regione, provincia, comune Minturno e 6 frazioni; pagina evento con JSON-LD Event + BreadcrumbList; eventi.json, eventi.ics (anche per singolo evento), feed.xml, sitemap.xml, robots.txt, llms.txt; footer "Un progetto promosso da Room & Relax Scauri"; controlli automatici (privacy, JSON-LD, link, titoli unici).
- Eventi: 7 veri, ognuno con fonte (5 in programma tra 4 e 14 novembre 2026, 2 conclusi come archivio). Nessun evento inventato. Il calendario di Natale 2026 del Comune (5 dicembre - 6 gennaio) non è ancora uscito: avviso con proposte entro l'11 novembre 2026.
- Ricerca fonti: WebFetch è bloccato dalla rete della sessione; funziona il connettore TinyFish (search + fetch_content).
- Prossimi passi: verifica di Giuseppe sul telefono del link pubblicato; Test dei risultati multimediali di Google; ricerca per comune (elenco ISTAT); pagine statiche /oggi/, /weekend/, /categoria/; filtri categoria e solo gratuiti.
- Decisioni aperte: categoria "Apertura straordinaria" (aggiunta), frazioni Fontana Perrelli e Solacciano, licenza dati aperti (ora meno urgente: i dati aperti non sono più in vista), dominio (livelocal.com è preso; livelocal.it da verificare).
- Privacy policy (Fase 2): citare che le tessere della mappa arrivano da OpenStreetMap e che la posizione resta nel telefono.
