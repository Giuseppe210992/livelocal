# Modulo per segnalare un evento (Google Moduli)

Questo modulo lo crea Giuseppe da telefono (app o browser, account Google di consultec2192@gmail.com). Qui ci sono domande e testi da copiare. Il link del modulo va poi scritto in `src/data/impostazioni.json` (campo `moduloUrl`): da quel momento il pulsante "Compila il modulo" compare su `/segnala/`.

## 1. Crea il modulo

Titolo: **Segnala un evento – LiveLocal**

Descrizione (copia):
> Segnala gratis un evento pubblico nel Lazio o in Campania. Bastano due minuti. Prima di pubblicarlo ti chiameremo per verificare che sei una persona vera e che l'evento esiste. Nome, cognome e cellulare non verranno mai pubblicati: servono solo per la telefonata.

### Sezione 1: «Chi sei» (tutte obbligatorie)
| Domanda | Tipo | Note |
|---|---|---|
| Nome | Risposta breve | |
| Cognome | Risposta breve | |
| Cellulare | Risposta breve | Convalida → Espressione regolare → Corrisponde a: `^(\+39)? ?3[0-9]{8,9}$` · Messaggio: «Scrivi un cellulare italiano, per esempio 3331234567» |
| Chi organizza (nome che comparirà sul sito) | Risposta breve | Descrizione: «Per esempio: Pro Loco di Scauri, Parrocchia San Pietro, oppure il tuo nome» |

### Sezione 2: «L'evento»
| Domanda | Tipo | Obbligatoria |
|---|---|---|
| Titolo dell'evento | Risposta breve | sì |
| Che tipo di evento è? | Menu a discesa: Mostra · Visita guidata · Apertura straordinaria · Concerto · Teatro · Sagra e gusto · Festa religiosa · Mercatino · Conferenza · Sport e camminate · Per bambini | sì |
| Comune (e frazione, se c'è) | Risposta breve | sì |
| Nome del posto | Risposta breve (es. «Palazzo Ducale») | sì |
| Indirizzo | Risposta breve | sì |
| Data di inizio | Data | sì |
| Ora di inizio | Ora | no |
| Data di fine (se dura più giorni) | Data | no |
| Ora di fine | Ora | no |
| Descrizione | Paragrafo · Descrizione: «2-5 righe, scritte con parole tue» | sì |
| Ingresso | Scelta multipla: Gratuito · A pagamento · A offerta libera | sì |
| Se è a pagamento, quanto? | Risposta breve | no |
| Link alla pagina o alla locandina dell'evento (sito, Facebook, Instagram) | Risposta breve | no, ma aiuta la verifica |

### Sezione 3: «Ultimi controlli» (obbligatorie)
| Domanda | Tipo | Note |
|---|---|---|
| Ho letto l'informativa privacy (https://giuseppe210992.github.io/livelocal/privacy/) e accetto di essere chiamato per la verifica | Caselle di controllo (una sola) | |
| Controllo anti-spam: quanto fa 3 + 4? | Risposta breve | Convalida → Espressione regolare → Corrisponde a: `^7$` |

Messaggio di conferma (Impostazioni → Presentazione):
> Grazie! Ti chiameremo presto per la verifica. Dopo la telefonata pubblichiamo l'evento.

### Impostazioni
- **Non** raccogliere indirizzi email (non serve) e non chiedere l'accesso a Google: deve poter rispondere chiunque, senza account.
- Risposte: un modulo, nessun limite di risposte.

## 2. Notifica sul telefono
1. Nel modulo apri **Risposte** → tre puntini → **Ricevi notifiche via email per le nuove risposte**.
2. Opzionale ma consigliato: **Risposte → Collega a Fogli**, così hai nome, cognome e cellulare in una tabella. Aggiungi due colonne a mano: **Verificato** (sì/no) e **Chiamato il**.

La notifica arriva a consultec2192@gmail.com e ti suona sul telefono. Dal Foglio tocchi il numero per chiamare.

## 3. Come si verifica (promemoria per Giuseppe)
1. Chiama il numero. Chiedi: sei tu che organizzi? Che evento è? Dove e quando?
2. Se torna tutto → scrivi **sì** in «Verificato». Se non risponde dopo due tentativi in giorni diversi, o le risposte non tornano → **no**.
3. Cancella nome, cognome e cellulare **dopo la verifica**, e comunque entro 90 giorni (lo promette l'informativa privacy).

## 4. Dal modulo al sito
Per ora un evento verificato lo scrivi tu a Claude (o lo incolli in chat) e finisce online. Passo successivo, da fare dopo il collaudo: un secondo foglio con solo gli eventi verificati e **senza** nome e cellulare, pubblicato come CSV, che il sito legge ogni ora.
