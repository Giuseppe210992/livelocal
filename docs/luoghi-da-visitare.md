# Luoghi da visitare (sezione `/luoghi/`)

Musei, aree archeologiche, castelli e palazzi aperti al pubblico, con orari e costi **copiati dalle fonti ufficiali**.

- Dati: `src/data/luoghi-da-visitare.json`. Ogni scheda ha `fonte` (pagina ufficiale), `sito` e `verificato` (data del controllo).
- Regole: descrizione scritta con parole nostre; orari e prezzi riportati come li scrive la fonte, mai dedotti. Se la fonte è poco chiara o ha un avviso (chiusure, lavori) si scrive in `avviso`. Niente telefoni né email nel sito.
- Coordinate: se mancano (`lat`/`lon`) si usa il centro del comune e il JSON-LD non scrive la posizione.
- Fonte principale per i luoghi statali: schede del Ministero della Cultura (`cultura.gov.it/luogo/<nome>`) e siti delle Direzioni regionali Musei. Per gli altri (castelli e musei comunali o privati): sito del Comune o dell'ente gestore.
- Pagine: `/luoghi/` (elenco per regione e provincia) e `/luoghi/<slug>/` (scheda, con JSON-LD `Museum`/`TouristAttraction` e gli eventi in programma nello stesso comune).
- Primo gruppo (15/11/2026): Minturnae, Museo di Formia, Museo e Villa di Tiberio a Sperlonga, Reggia di Caserta, Anfiteatro Campano.
- Da fare: allargare il censimento (le schede ufficiali del Ministero sono migliaia: si possono leggere a gruppi), ricontrollare orari e prezzi ogni 30 giorni.

## Lettura automatica con FreeLLMAPI (15/11/2026)

- `scripts/scopri-luoghi.mjs` elenca da Wikidata (CC0) musei, aree archeologiche, castelli, palazzi e cattedrali italiani con sito ufficiale (`ricerca/luoghi-elenco.json`, rifatto ogni 30 giorni, riprende da dove era arrivato se si interrompe).
- `scripts/estrai-luoghi-ia.mjs` apre il sito di ogni luogo (rispettando `robots.txt`) e le pagine «orari/biglietti/visita» (massimo 3), le manda al modello e accetta la scheda **solo** se: il luogo risulta aperto con orari ordinari, la frase degli orari è citata con le parole esatte della pagina, ogni numero degli orari e ogni importo compare nella pagina, e nei testi non ci sono telefoni, email o indirizzi web. Un luogo senza orari ufficiali leggibili non si pubblica (esito `senza-orari`). Le schede scritte a mano non si toccano.
- Ricontrollo di ogni luogo dopo 30 giorni; se la pagina non è cambiata (impronta) non si chiede nulla al modello.
- Action `estrai-luoghi.yml` (ogni ora, parte ogni `ORE_LUOGHI` ore, predefinito 6; `LUOGHI_PER_GIRO`, predefinito 60). Salva solo se `npm run build` passa.
- Dalla chat di giot.ai: strumento `avvia_ricerca_luoghi`; impostazioni `ORE_LUOGHI` e `LUOGHI_PER_GIRO` con `imposta_impostazione`. Serve ripubblicare il Worker (`docs/avvio-da-chat-worker.js`, vedi `docs/avvio-da-chat.md`).
- `ricerca/luoghi-semi.json`: pagine ufficiali da leggere con priorità (per esempio le schede `cultura.gov.it/luogo/…`).
- Pagine: oltre 40 luoghi l'indice `/luoghi/` si divide per provincia (`/luoghi/zona/<regione>/<provincia>/`).
- **Limiti**: Wikidata non conosce tutti i luoghi; molti siti caricano gli orari con JavaScript o in PDF (non letti); i luoghi senza orari scritti sul sito restano fuori. Collaudato solo offline con una pagina di prova (scheda corretta accettata, orari e prezzi inventati scartati): la prima lettura vera è il primo giro dell'Action.

## Mappa dei luoghi (15/11/2026)

- Pagina `/luoghi/mappa/` (`src/scripts/mappa-luoghi.ts`): Leaflet + OpenStreetMap, un punto colorato per luogo (colore = tipo), filtri per tipo, ricerca per nome o comune (anche con l'elenco dei comuni), «Vicino a me» solo al tocco, elenco dei luoghi in vista sotto la mappa. Punti disegnati su canvas: regge migliaia di luoghi senza raggruppamenti.
- Dati: `/luoghi.json` (una riga per luogo: slug, nome, tipo, comune, sigla, lat, lon, posizione indicativa, orari in breve), generato a ogni pubblicazione.
- Le schede senza coordinate esatte (quelle scritte a mano) usano il centro del comune e sono segnate «posizione indicativa» (punto più chiaro). Le schede automatiche hanno le coordinate di Wikidata.
- Senza JavaScript la pagina rimanda all'elenco `/luoghi/`.

## Luoghi «base» e navigazione separata (15/11/2026, sera)

- Eventi e luoghi hanno **ognuno la sua mappa**: `/mappa/` (solo eventi) e `/luoghi/mappa/` (solo luoghi). Menu: Eventi, Mappa eventi, Luoghi, Mappa luoghi; ogni mappa rimanda all'altra in una nota.
- Tutti i luoghi dell'elenco Wikidata (`ricerca/luoghi-elenco.json`, ~3.400 con sito ufficiale) compaiono subito sulla mappa e negli elenchi per provincia (`/luoghi/zona/<regione>/<provincia>/`) come **luoghi base**: nome, tipo, comune, coordinate e collegamento al sito ufficiale, con la scritta «scheda non ancora verificata». Quando la lettura automatica trova orari e costi citabili la scheda diventa **completa** (punto grande sulla mappa, pagina propria, JSON-LD). I luoghi base non hanno pagina propria (per non pubblicare pagine vuote).
- `/luoghi.json` ha una riga per luogo: [id, nome, tipo, comune, sigla, lat, lon, indicativa, orari, completa, sito] (circa 490 KB, 150 KB compressi).

## Luoghi minori da OpenStreetMap (15/11/2026, sera)

- `scripts/scopri-luoghi-osm.mjs` (nello stesso flusso `estrai-luoghi.yml`, solo se l'elenco manca o ha più di 45 giorni) elenca da OpenStreetMap, regione per regione, musei, siti archeologici, rovine, castelli, fortezze, monasteri, ville e palazzi storici, porte, mura, acquedotti e tombe con un nome, non privati né abbandonati: `ricerca/luoghi-osm.json` (id, nome, classe, comune più vicino, coordinate, sito se c'è, codice Wikidata se c'è). Fonte © contributori di OpenStreetMap (ODbL).
- Al momento della costruzione del sito si tolgono i doppioni (stesso codice Wikidata, oppure stesso nome entro circa 1 km da una scheda o da un luogo base). I luoghi minori restano **solo sulla mappa**, senza pagina propria e fuori dagli elenchi per provincia.
- Per non appesantire la pagina la mappa li carica **per regione quando ci si avvicina** (zoom 8 o più): `/luoghi-regioni.json` (riquadri e conteggi) e `/luoghi-osm/<regione>.json`. Dove non c'è un sito, il popup rimanda alla pagina del luogo su OpenStreetMap.
- Collaudato offline con una risposta finta di Overpass (filtri su privati e tipi, doppioni, caricamento a zone nel browser). La prima lettura vera è il primo giro dell'Action (circa un'ora per tutte le regioni).

## Localizzazione precisa dei luoghi (15/11/2026, sera)

- I luoghi storici sono fissi: la posizione si assegna una volta sola, non si chiede alla lettura dei siti.
- **Schede scritte a mano**: coordinate esatte da OpenStreetMap (campo `coordFonte`): prima erano il centro del comune, anche a 3-4 km di distanza (Museo di Formia, Minturnae, Reggia di Caserta, Anfiteatro Campano, Villa di Tiberio).
- **Luoghi da Wikidata** (96% ha già le coordinate); **luoghi senza coordinate**: `src/lib/osmGrezzi.ts` le cerca per nome nello stesso comune tra i luoghi di OpenStreetMap (soglia 0,6 di somiglianza dei nomi; fonte © contributori di OpenStreetMap, ODbL) e le usa quando le trova; altrimenti resta il centro del comune, segnato «posizione indicativa».
- Pagina di ogni scheda con posizione esatta: pulsanti **«Apri nell'app mappe»** (indirizzo `geo:` che su Android apre l'app delle mappe), **«Indicazioni stradali»** (Google Maps) e **OpenStreetMap**; il JSON-LD ha `geo`. Senza posizione esatta: «Cerca sulla mappa» e la nota che il punto è il centro del paese.
- Limiti: il codice ISTAT dei comuni fusi o rinominati, in Wikidata, può essere vecchio: se mancano anche le coordinate il luogo non si può collocare (2 casi su 3.418, esclusi).

## Tutta Italia e poi l'Europa

- Italia: Wikidata (tutta Italia, 3.418 luoghi con sito) + OpenStreetMap (le 20 regioni, in corso dal 15/11/2026) + schede complete.
- Per allargare all'**Europa** servirebbero: (1) un parametro «paese» negli script (`scopri-luoghi.mjs`: classe e paese Wikidata al posto di Q38 e dei codici ISTAT; `scopri-luoghi-osm.mjs`: aree `ISO3166-1` e regioni `ISO3166-2` di ogni paese); (2) un elenco di località per paese al posto dei comuni ISTAT (da Geonames o dai `place=*` di OpenStreetMap) per assegnare il luogo; (3) indirizzi delle pagine con il paese (`/luoghi/zona/<paese>/<regione>/…`), mappa e file per regione già pensati a zone; (4) lingua: nomi e orari restano nella lingua del luogo, i testi del sito si traducono più avanti (Fase 3 del brief). Il lavoro più pesante è il punto 2; si fa paese per paese.

## Europa (16/11/2026)

- `scripts/scopri-luoghi-europa.mjs` (nel flusso `estrai-luoghi.yml`, a tappe di 40 minuti per giro, riprende da dove era arrivato) elenca da Wikidata i luoghi più noti di 41 paesi europei (Italia esclusa): musei, musei d'arte, siti archeologici, castelli e palazzi con coordinate, nome in italiano o in inglese e almeno 2 pagine di Wikipedia in lingue diverse (per tenere solo i luoghi davvero noti). Prima di ogni paese controlla che il codice Wikidata sia quello giusto (nome inglese). Risultato: `ricerca/luoghi-europa.json` (l'elenco è «completo» solo quando tutti i paesi sono finiti).
- Sito: i luoghi europei stanno **solo sulla mappa** (`/luoghi/mappa/`), caricati paese per paese quando ci si avvicina (`/luoghi-europa/<paese>.json`, elenco delle zone in `/luoghi-regioni.json`), e nell'indice `/luoghi/europa/` (paesi con conteggio; toccando un paese si apre la mappa su quel paese con `?zona=<iso>`). Nessuna scheda propria: fuori dall'Italia non ci sono orari e costi verificati; il popup rimanda al sito ufficiale se c'è, altrimenti alla voce di Wikidata.
- Collaudato offline con una risposta finta di Wikidata (doppioni di riga, nomi mancanti, paese, mappa, ricerca, pagina Europa). La prima lettura vera è il primo giro dell'Action.
- **Da fare per portarla al livello dell'Italia** (schede con orari e costi): lettura dei siti con FreeLLMAPI paese per paese (lingua diversa: il modello legge nella lingua del sito, i testi del sito restano in italiano), e OpenStreetMap per i luoghi minori (stesso metodo dell'Italia, paese per paese, dopo la verifica del primo risultato).
