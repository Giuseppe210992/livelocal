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

## Nella chat di giot.ai: connettore

La chat ha la sezione **Impostazioni → Connettori** (servizi MCP, come TinyFish). Lo script ora parla anche questo linguaggio, quindi si può aggiungere come connettore e usare a parole.

1. **Aggiorna lo script**: incolla di nuovo tutto `docs/avvio-da-chat-script.gs` al posto del vecchio codice e salva. Poi **Esegui il deployment → Gestisci i deployment** → matita sul deployment esistente → **Versione: Nuova versione** → **Esegui il deployment**. L'indirizzo `/exec` resta lo stesso.
2. Nella chat: **Impostazioni → Connettori → Aggiungi connettore**. Nome: `LiveLocal avvio`. Indirizzo: `INDIRIZZO/exec?chiave=LA_TUA_FRASE`. Salva e controlla che compaiano **3 strumenti**.
3. Prova a scrivere: «dimmi lo stato delle ricerche di LiveLocal», poi «avvia la ricerca dei comuni, 40». Le operazioni che avviano qualcosa chiedono conferma.

Strumenti: `avvia_ricerca_comuni`, `avvia_lettura_fonti`, `stato_ricerche`.
Se la chat non riesce a collegarsi (Apps Script risponde con un reindirizzamento che alcuni programmi non seguono), usa i tre indirizzi come preferiti: stesso risultato.

## Attenzione

- La frase (`chiave`) sta nell'indirizzo: non condividere i link. Se pensi che sia stata vista, cambia `SEGRETO` nelle Proprietà dello script.
- Il token ha il solo permesso di avviare e leggere le Action di `livelocal`: non può cambiare il codice né i dati. Scade da solo dopo 90 giorni (va rifatto).
