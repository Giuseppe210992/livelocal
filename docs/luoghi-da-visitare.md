# Luoghi da visitare (sezione `/luoghi/`)

Musei, aree archeologiche, castelli e palazzi aperti al pubblico, con orari e costi **copiati dalle fonti ufficiali**.

- Dati: `src/data/luoghi-da-visitare.json`. Ogni scheda ha `fonte` (pagina ufficiale), `sito` e `verificato` (data del controllo).
- Regole: descrizione scritta con parole nostre; orari e prezzi riportati come li scrive la fonte, mai dedotti. Se la fonte è poco chiara o ha un avviso (chiusure, lavori) si scrive in `avviso`. Niente telefoni né email nel sito.
- Coordinate: se mancano (`lat`/`lon`) si usa il centro del comune e il JSON-LD non scrive la posizione.
- Fonte principale per i luoghi statali: schede del Ministero della Cultura (`cultura.gov.it/luogo/<nome>`) e siti delle Direzioni regionali Musei. Per gli altri (castelli e musei comunali o privati): sito del Comune o dell'ente gestore.
- Pagine: `/luoghi/` (elenco per regione e provincia) e `/luoghi/<slug>/` (scheda, con JSON-LD `Museum`/`TouristAttraction` e gli eventi in programma nello stesso comune).
- Primo gruppo (15/11/2026): Minturnae, Museo di Formia, Museo e Villa di Tiberio a Sperlonga, Reggia di Caserta, Anfiteatro Campano.
- Da fare: allargare il censimento (le schede ufficiali del Ministero sono migliaia: si possono leggere a gruppi), ricontrollare orari e prezzi ogni 30 giorni.
