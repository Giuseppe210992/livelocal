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
