# Consegna di eventi da un modello gratuito (FreeLLMAPI)

Serve a **ridurre i token di Claude**: la ricerca la fa un modello gratuito (pagina *Playground* di FreeLLMAPI, con Tavily o Linkup attivi per la ricerca web), il risultato è un file di testo, e uno script lo controlla e lo importa. Claude interviene solo sugli scarti e su un controllo a campione.

## Il giro, passo per passo (dal telefono)

1. **Scegli i comuni.** Chiedi a Claude «dammi i prossimi 10 comuni» oppure prendi quelli di `docs/copertura.md`.
2. **Apri la pagina Playground di FreeLLMAPI**, attiva la ricerca web se c'è l'opzione, incolla il *testo da incollare* qui sotto e, in fondo, scrivi i comuni.
3. **Copia la risposta** (solo i blocchi, senza commenti).
4. **Salvala come file di testo in GitHub**: dal browser, repository `livelocal` → cartella `ricerca/consegne/` → *Add file* → *Create new file* → nome `AAAA-MM-GG-nome.txt` (es. `2026-11-07-piacenza.txt`) → incolla → *Commit changes*.
5. **Scrivi a Claude «importa la consegna»**. Claude lancia `node scripts/importa-consegna.mjs ricerca/consegne/<file>.txt`, ti mostra solo gli scarti, controlla a campione alcune fonti e pubblica.

## Formato del file

Un blocco per evento, blocchi separati da una riga vuota. Una riga per campo, `chiave: valore`.

```
titolo: Nome dell'evento
categoria: mostra | visita-guidata | apertura-straordinaria | concerto | teatro | sagra | festa-religiosa | mercatino | conferenza | sport | bambini | cerimonia
comune: Piacenza
provincia: PC
luogo: Nome del posto (es. Palazzo Ducale; «Centro storico» è valido)
indirizzo: Via Roma 1 (se non c'è, lascia vuoto)
inizio: 2026-11-28            oppure   2026-11-28 21:00
fine: 2026-11-29              (facoltativa; stesso formato dell'inizio: o tutti e due con l'ora o tutti e due senza)
descrizione: 2-3 frasi con parole proprie, 100-300 caratteri
prezzo: gratuito | 12 euro | a offerta | non indicato
organizzatore: Nome pubblico di chi organizza
prenotazione: solo un link (facoltativo)
fonte_url: https://… (la pagina da cui hai letto data e luogo)
fonte_nome: Nome del sito
fonte_tipo: ufficiale | organizzatore | stampa | aggregatore
```

Lo script scarta l'evento (e dice perché) se manca un campo obbligatorio, la categoria o il comune non esistono, la data è passata, la descrizione è corta o contiene telefoni/email, la fonte non è un link, o l'evento c'è già.

## Testo da incollare nel Playground

```
Sei un ricercatore di eventi pubblici in Italia. Cerco eventi reali, aperti al pubblico, in luogo fisico, con inizio tra oggi e fine gennaio 2027.

Per ognuno dei comuni che ti do in fondo:
1. Cerca SOLO su fonti ufficiali: sito del Comune, Pro Loco, teatri, musei, parrocchie, organizzatori, portali turistici. Ignora social, schede di aziende, annunci di lavoro, siti stranieri.
2. Apri la pagina dell'evento e copia da lì titolo, data, ora e luogo ESATTI. Non usare mai le anteprime dei risultati di ricerca. Non dedurre date (niente «ogni sabato» o mesi indovinati). Se manca la data di inizio, il luogo preciso o la pagina non si legge, SALTA l'evento.
3. Non inventare nulla: se non sai un campo, lascialo vuoto.
4. Descrizione con parole tue, 100-300 caratteri, mai copiata. Mai telefoni, email o contatti privati in nessun campo.
5. Scrivi UN blocco per evento, separati da una riga vuota, esattamente in questo formato (una riga per campo):
titolo:
categoria: (una sola tra mostra, visita-guidata, apertura-straordinaria, concerto, teatro, sagra, festa-religiosa, mercatino, conferenza, sport, bambini, cerimonia)
comune:
provincia: (sigla, es. PC)
luogo:
indirizzo:
inizio: (AAAA-MM-GG oppure AAAA-MM-GG HH:MM)
fine: (facoltativa, stesso formato dell'inizio)
descrizione:
prezzo: (gratuito, «12 euro», a offerta, oppure non indicato)
organizzatore:
fonte_url: (la pagina da cui hai letto i dati)
fonte_nome:
fonte_tipo: (ufficiale, organizzatore, stampa o aggregatore)
6. Nessun commento, nessun elenco, nessun titolo: solo i blocchi. Al massimo 8 eventi per comune. Se un comune non ha eventi leggibili, scrivi una riga «# nessun evento: NomeComune (SIGLA)».

Comuni: 
```

## Regole che restano

- Data di inizio e luogo devono essere scritti nella pagina letta, non dedotti.
- Mai contatti privati. Mai testi copiati: descrizioni riscritte.
- Gli eventi da sola stampa o aggregatori si pubblicano con l'avviso «Possono esserci errori» già presente sul sito.
- I modelli gratuiti sbagliano più dei modelli grandi: Claude controlla a campione (circa un evento su cinque, aprendo la fonte). Se gli errori sono molti, scarta tutto il lotto e si riduce il numero di comuni per volta.
- Le chiavi di FreeLLMAPI, Tavily e Linkup non vanno mai in chat né nel repository.
