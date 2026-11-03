# Modulo per segnalare un evento

Il modulo è una pagina del sito: `/segnala/modulo/` (codice in `src/pages/segnala/modulo/index.astro` e `src/scripts/modulo.ts`). Chi lo compila preme **Invia per revisione** e i dati arrivano **per email** a chi gestisce il sito, tramite il servizio gratuito [Web3Forms](https://web3forms.com). Non passano dal repository e non vengono salvati sul sito.

## Attivarlo (fatto il 3/11/2026: la chiave è già in `impostazioni.json`, qui resta per riferimento)
1. Apri **web3forms.com**, tocca *Create your Access Key*, scrivi l'email che deve ricevere le segnalazioni (consultec2192@gmail.com) e conferma.
2. Ti arriva una email con la **chiave** (una sequenza di lettere e numeri). Copiala.
3. Scrivi la chiave in `src/data/impostazioni.json`, campo `formKey` (o mandala a Claude, che la inserisce). La chiave è fatta per stare in chiaro nella pagina: serve solo a far arrivare le email a te.
4. Dopo la pubblicazione (pochi minuti) il pulsante diventa attivo. Prova con una segnalazione finta e controlla che l'email arrivi (guarda anche in *Spam*).

Piano gratuito: circa 250 segnalazioni al mese. Se un giorno servisse di più, si passa a un piano a pagamento o a un altro servizio.

## Cosa trovi nell'email
Oggetto «LiveLocal – evento da verificare: <titolo>». Nel testo: **CHIAMA** con il numero pronto da toccare, nome, cognome, cellulare, chi organizza, titolo, tipo, comune, **codice luogo**, posto, indirizzo, date (anche in formato per il sito), descrizione, ingresso, link, consenso privacy.

## Protezioni anti-spam
- campo nascosto (trappola per i programmi) e tempo minimo di compilazione di 4 secondi: in questi casi il modulo finge di aver inviato ma non manda nulla;
- controlli sul cellulare, sul comune (solo Lazio e Campania, scelto dall'elenco), sulle date e sulla lunghezza della descrizione;
- Web3Forms filtra a sua volta lo spam. Se arrivasse comunque spam, si può aggiungere hCaptcha dal pannello di Web3Forms.

## Come si verifica (promemoria)
1. Tocca CHIAMA. Chiedi: sei tu che organizzi? Che evento è? Dove e quando?
2. Se torna tutto: inoltra l'email a Claude (o incolla i dati in chat) e l'evento viene pubblicato con fonte «organizzatore». Se non risponde dopo due tentativi in giorni diversi, o le risposte non tornano: non si pubblica.
3. **Cancella l'email dopo la verifica**, e comunque entro 90 giorni: lo promette l'informativa privacy.

## Dal modulo al sito (passo successivo)
Per ora l'evento verificato lo pubblica Claude su tua indicazione. Più avanti si può automatizzare: la sessione di ricerca legge le email "evento da verificare" e, quando rispondi "verificato 1", pubblica l'evento.
