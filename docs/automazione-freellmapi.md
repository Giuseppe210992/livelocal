# Estrazione automatica di eventi con FreeLLMAPI

Una GitHub Action (`.github/workflows/estrai-eventi.yml`) riapre ogni giorno le pagine elencate in `ricerca/fonti-automatiche.json`, ne legge il **testo intero**, chiede a FreeLLMAPI di estrarre gli eventi e importa quelli che superano i controlli. **Non usa Claude**: i token di Claude non vengono toccati.

## Come funziona, in breve

1. `scripts/estrai-eventi-ia.mjs` scarica la pagina (rispetta `robots.txt`, si presenta come `LiveLocalBot`) e, se `dettagli` è `true`, anche fino a 6 schede dei singoli eventi non ancora note.
2. Il modello deve rispondere in JSON e **citare le frasi esatte** della pagina in cui ha letto data e luogo.
3. Lo script **scarta da solo** ogni evento la cui citazione non compare nella pagina, la cui data non coincide con la citazione, o il cui luogo e titolo non si trovano nel testo (è il controllo contro le invenzioni; collaudato: un evento inventato e uno con data sbagliata sono stati scartati).
4. I superstiti vanno in `ricerca/consegne/auto-<data>.txt` e li importa `scripts/importa-consegna.mjs` (comune, categoria, date, doppioni, contatti privati). Il resoconto resta in `ricerca/consegne/importate/`.
5. La Action costruisce il sito (`npm run build`) **prima** di salvare: se i controlli non passano, non salva nulla.
6. Se nel frattempo qualcun altro ha cambiato `eventi.json`, `scripts/risolvi-conflitto-eventi.mjs` tiene la versione online e aggiunge solo gli eventi nuovi di questo giro.

## Cosa deve fare Giuseppe (una volta sola, dal browser del telefono)

1. **Apri FreeLLMAPI** e cerca la sezione dove si crea una **chiave API** (o «API key», «token», «Chiavi di accesso») per usarlo da programmi esterni. Crea una chiave nuova e copiala. **Non incollarla in chat.**
2. Su GitHub, repository `livelocal` → **Settings → Secrets and variables → Actions → New repository secret**:
   - Nome: `FREELLMAPI_KEY`
   - Valore: la chiave. Salva.
3. Nella stessa pagina, scheda **Variables → New repository variable** (facoltative):
   - `FREELLMAPI_URL` = l'indirizzo base con `/v1` (es. `https://ai.roomandrelax.it/v1`). Se non lo imposti, usa proprio questo.
   - `FREELLMAPI_MODEL` = il modello. Consigliato `gpt-oss-120b` (risponde bene in JSON); se non lo imposti usa `auto`.
4. **Prima prova, senza salvare niente**: scheda **Actions → Estrai eventi con FreeLLMAPI → Run workflow**, spunta **Solo prova**, lascia 60 pagine (o scrivi 3 per un giro corto) e premi il pulsante verde.
5. Quando ha finito, apri l'esecuzione: in fondo c'è il **Riepilogo** con le pagine lette, gli eventi proposti, quelli scartati e perché. Mandalo a Claude per il controllo.
6. Se va bene, lo stesso comando **senza** «Solo prova» salva davvero. Poi gira da solo quattro volte al giorno (circa alle 3:23, 9:23, 15:23 e 21:23 ora italiana).

## Aggiungere pagine

Una riga in `ricerca/fonti-automatiche.json` (`url`, `nome`, `tipo`: `ufficiale` o `organizzatore`, `dettagli`: `true` se la pagina è un elenco con link alle schede). Meglio calendari di Comuni, teatri, musei, Pro Loco e portali turistici. Claude può farlo in blocco partendo da `docs/fonti.md`. Ogni giro legge fino a 60 pagine, le meno recenti per prime, tre alla volta (circa 100 secondi per pagina, tempo massimo 100 minuti). Una pagina che non risponde o è vuota per 3 giri di fila viene messa da parte per 14 giorni (`ricerca/automazione-stato.json`, campo `falliti`).

## Limiti da conoscere

- **Pagine che caricano il contenuto con JavaScript** o che bloccano i robot risultano «non lette» o «pagina vuota»: restano nell'elenco dello stato (`ricerca/automazione-stato.json`) e si possono togliere.
- **FreeLLMAPI deve essere raggiungibile da internet** (da questa sessione di Claude il suo indirizzo non si raggiunge, quindi il collaudo reale lo fa la Action).
- **Quota gratuita**: ogni pagina usa una richiesta al modello. con 60 pagine per giro e 4 giri al giorno sono fino a 240 richieste al giorno: se il fornitore gratuito arriva al limite, il giro si ferma da solo e riprende al successivo.
- **Qualità**: i modelli gratuiti sbagliano più dei grandi. Il controllo sulle citazioni toglie le invenzioni, non gli errori di interpretazione (categoria, prezzo, organizzatore): Claude fa un controllo a campione sulle consegne automatiche.
- Gli eventi arrivano come «pubblicato» con fonte `ufficiale` o `organizzatore` (secondo la riga della fonte) e con l'avviso «Possono esserci errori» già presente sul sito.

## Giro dei comuni da 10.000 abitanti (Action «Estrai eventi dei comuni con FreeLLMAPI»)

Seconda Action (`.github/workflows/estrai-comuni.yml`), ogni 3 ore, 30 comuni per giro. Per ogni comune da 10.000 abitanti non ancora fatto (`ricerca/comuni-grandi.json`, segnalibro in `ricerca/comuni-progresso.json`):
1. trova il sito ufficiale del Comune (da Wikidata, salvato in `ricerca/comuni-siti.json`; se manca prova gli indirizzi tipici `comune.<nome>.<sigla>.it`);
2. cerca nella pagina iniziale il link «Eventi/Agenda/Manifestazioni»;
3. legge quella pagina e fino a 10 schede di dettaglio, poi segue la stessa procedura dell'altra Action (citazioni controllate, importazione con controlli, build, salvataggio);
4. segna il comune come `eventi`, `nessun-evento` o `fonti-illeggibili` (sito non trovato, pagina vuota o bloccata).
Prima prova reale (8/11/2026, 10 comuni): 5 con eventi, 1 senza, 5 illeggibili; i siti che caricano gli eventi con JavaScript restano il limite principale. Per fermare tutto: Actions → la Action → menu «…» → Disable workflow.
