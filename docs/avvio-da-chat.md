# Avviare le ricerche da una chat (o da un link)

Le ricerche automatiche (`estrai-comuni.yml` e `estrai-eventi.yml`) si avviano da GitHub. Per avviarle anche dalla chat di giot.ai serve un **ponte** che parli con GitHub al posto tuo senza mostrare il token: un piccolo script gratuito su Google Apps Script (`docs/avvio-da-chat-script.gs`).

Cosa fa la ricerca quando parte (è già così, nessuna modifica): legge le pagine, scarta da sola gli eventi con errori (data o luogo non scritti nella pagina, categoria o comune sbagliati, contatti privati) e i **doppioni**, costruisce il sito e **pubblica solo se tutti i controlli passano**.

## Preparazione (una volta sola, dal telefono)

1. **Token GitHub.** github.com (browser) → foto profilo → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token. Nome: `livelocal-avvio`. Scadenza: 90 giorni. Repository: **solo `livelocal`**. Permessi del repository: **Actions → Read and write** (niente altro). Genera e **copia** il token. Non incollarlo in chat.
2. **Script.** script.google.com → Nuovo progetto → cancella il testo → incolla tutto il contenuto di `docs/avvio-da-chat-script.gs` (aprilo dall'app GitHub, tocca «Copia»).
3. **Chiavi dello script.** Impostazioni progetto (ingranaggio) → Proprietà script → aggiungi due proprietà:
   - `GITHUB_TOKEN` = il token del punto 1
   - `SEGRETO` = una frase lunga inventata da te (es. quattro parole casuali + un numero)
4. **Pubblica.** Distribuisci → Nuova distribuzione → tipo **App web** → Esegui come: **me** → Chi ha accesso: **Chiunque** → Distribuisci → autorizza → copia l'indirizzo che finisce con `/exec`.
5. **Prova.** Apri nel browser: `INDIRIZZO/exec?chiave=LA_TUA_FRASE&cmd=stato`. Deve rispondere con l'esito degli ultimi giri.

## Comandi

| Indirizzo da aprire | Cosa fa |
|---|---|
| `…/exec?chiave=FRASE&cmd=comuni&quanti=40` | cerca gli eventi di 40 comuni da 10.000 abitanti non ancora fatti |
| `…/exec?chiave=FRASE&cmd=fonti&quanti=60` | rilegge fino a 60 pagine fisse (teatri, musei, Comuni) |
| `…/exec?chiave=FRASE&cmd=stato` | dice come sono andati gli ultimi giri |

Un solo avvio ogni 5 minuti. Il numero massimo è 120.

## Nella chat di giot.ai: connettore (versione Cloudflare)

Il server della chat rifiuta gli indirizzi che rispondono con un reindirizzamento, e Google Apps Script risponde sempre così: per il **connettore** non funziona (per il link nel browser sì). Per il connettore si usa `docs/avvio-da-chat-worker.js` su un **Cloudflare Worker** gratuito, che risponde direttamente.

1. dash.cloudflare.com → crea un account gratuito (email + password), conferma l'email.
2. **Workers e Pages** (o *Compute → Workers*) → **Crea** → **Crea Worker** → nome `livelocal-avvio` → **Distribuisci** (con il testo di esempio).
3. **Modifica il codice** → cancella tutto → incolla `docs/avvio-da-chat-worker.js` → **Distribuisci**.
4. Nel Worker: **Impostazioni → Variabili e segreti → Aggiungi**: tipo **Segreto** `GITHUB_TOKEN` (lo stesso token GitHub di prima) e tipo **Segreto** `SEGRETO` (una frase lunga e senza spazi) → **Distribuisci**.
5. Prova nel browser: `https://livelocal-avvio.TUOUTENTE.workers.dev/?chiave=FRASE&cmd=stato`.
6. Nella chat: Impostazioni → Connettori → Aggiungi connettore → nome `LiveLocal avvio`, indirizzo `https://livelocal-avvio.TUOUTENTE.workers.dev/?chiave=FRASE`, autenticazione **Nessuna (chiave già nell'indirizzo)** → Collega. Devono comparire **3 strumenti**.
7. Prova: «dimmi lo stato delle ricerche di LiveLocal», poi «avvia la ricerca dei comuni, 40».

Strumenti: `avvia_ricerca_comuni`, `avvia_lettura_fonti`, `stato_ricerche`. Una ricerca non parte se la stessa è già in coda o in corso.

## Attenzione

- La frase (`chiave`) sta nell'indirizzo: non condividere i link. Se pensi che sia stata vista, cambia `SEGRETO` nelle Proprietà dello script.
- Il token ha il solo permesso di avviare e leggere le Action di `livelocal`: non può cambiare il codice né i dati. Scade da solo dopo 90 giorni (va rifatto).
