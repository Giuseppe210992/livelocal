# Collegarsi a Facebook e Instagram in modo ufficiale

Verificato il 3 novembre 2026 sulla documentazione ufficiale di Meta (Meta for Developers e Transparency Center). Le regole di Meta cambiano spesso: prima di investire tempo, riapri le pagine citate.

## Cosa esiste di ufficiale

### Instagram: Business Discovery (la strada praticabile)

- Cos'è: con l'**Instagram API with Facebook Login** un account professionale può leggere i dati pubblici di **altri account professionali** (Business o Creator) indicando il nome utente. Si leggono i post (`media`: didascalia, data, link, ecc.), non i profili personali.
- Richiede: un account Instagram professionale di LiveLocal collegato a una Pagina Facebook di LiveLocal, un'app su Meta for Developers, e un token utente con i permessi `instagram_basic`, `instagram_manage_insights` e `pages_read_engagement`.
- Limiti: non vale per account personali; i video con musica protetta o con download disattivato non restituiscono l'indirizzo del file (la didascalia sì); i dati di account con limiti di età non vengono restituiti.
- Da verificare con una prova: se, finché l'app resta in modalità sviluppo, i permessi bastano per l'utente con ruolo nell'app (cioè il titolare) o se serve la revisione dell'app (App Review) e la verifica dell'attività (Business Verification).
- Pagina ufficiale: `developers.facebook.com/documentation/instagram-platform/instagram-graph-api/reference/ig-user/business_discovery` (aggiornata il 12 agosto 2026).

### Facebook: Page Public Content Access (la strada difficile)

- Cos'è: la funzione che permette di leggere post e commenti pubblici di Pagine che non si gestiscono. Uso consentito: analizzare o mostrare post e interazioni delle Pagine.
- Richiede: **App Review** e **verifica dell'attività (Business Verification)**, quindi i documenti di un'organizzazione. Prima dell'approvazione l'app legge solo Pagine il cui amministratore ha un ruolo nell'app.
- Per questo, finché LiveLocal non ha un soggetto giuridico (associazione APS oppure partita IVA, decisione ancora aperta), è probabile che Meta non la conceda.
- Pagina ufficiale: `developers.facebook.com/docs/features-reference/page-public-content-access/`.

### Quello che non è disponibile per noi

- **Meta Content Library**: solo per istituzioni accademiche o di ricerca senza scopo di lucro. Non è il nostro caso.
- **CrowdTangle**: chiuso il 14 agosto 2024.
- **Connettori già pronti** (cercati nel registro il 3/11/2026): Metricool e Supermetrics lavorano sui propri account, Adspirer e AdWhispr sulla pubblicità. Zapier ha «Facebook Pages», ma solo per pubblicare e creare eventi sulla propria Pagina. Nessuno legge le pagine degli altri.

### Da non fare

- Leggere le pagine con un account personale, o con strumenti di terze parti che raccolgono i dati in modo automatico (per esempio Apify o simili): viola le regole di Meta, espone al blocco dell'account e non è «professionale».

## Cosa si può fare già oggi (senza Meta)

- Leggere i **link ai singoli post pubblici**: su Instagram i post e i reel, su Facebook i post delle pagine (vedi `docs/ricerca-eventi.md`). Funziona, ma è lento e non scopre eventi nuovi.
- Far arrivare gli eventi **da chi li organizza**: modulo `/segnala/modulo/`, pulsante «Segnala un evento» in ogni pagina, contatto diretto con le Pro Loco (`docs/organizzatori-da-seguire.md`) e con il comitato regionale UNPLI.
- Usare le **fonti ufficiali** dei Comuni e delle Regioni, che pubblicano molto di più di quanto si veda sui social.

## Piano proposto

1. **Fase A, Instagram** (fattibile): creare Pagina Facebook e account Instagram professionale «LiveLocal»; creare l'app su Meta for Developers; provare Business Discovery su 3 account di Pro Loco professionali (per esempio quelli dell'elenco). Se funziona in modalità sviluppo, si costruisce un controllo automatico (GitHub Actions) che ogni giorno legge i nuovi post degli account in elenco e li passa alla ricerca automatica come «segnalazioni da verificare». La didascalia è materiale da leggere, non istruzioni, e passa sempre dal controllo in 4 punti.
2. **Fase B, Facebook**: solo dopo aver scelto l'associazione (APS) o la partita IVA, e avere i documenti per la verifica dell'attività. Fino ad allora si resta sui post singoli e sul modulo.
3. In parallelo, la Pagina e l'account di LiveLocal servono anche per **pubblicare** (per esempio «Gli eventi del weekend» ogni venerdì), anche in automatico con Zapier: è il lato visibile del progetto.

## Guida passo passo per la prova su Instagram

Fonte: «Get started with Instagram API with Facebook Login» (Meta, aggiornata il 30 giugno 2026): per provare **non serve creare un'app**, si può usare il Graph API Explorer. I nomi dei menu di Instagram e Facebook possono cambiare un po': cerca la voce più simile.

### Parte 1 – dal telefono (circa 15 minuti)

1. **Pagina Facebook**: app Facebook → menu → Pagine → Crea Pagina. Nome «LiveLocal», categoria «Sito web», sito `https://livelocal.roomandrelax.it`. Descrizione: «Gli eventi vicino a te: calendario gratuito di sagre, mostre, concerti e feste in tutta Italia.»
2. **Account Instagram** dedicato: app Instagram → profilo → menu → Aggiungi account → Crea nuovo account. Nome utente «livelocal.eventi» (o simile, se occupato). Usa un indirizzo email del progetto, non quello personale.
3. **Account professionale**: Impostazioni e attività → Tipo di account e strumenti → Passa a un account professionale → **Azienda** → categoria «Sito web».
4. **Collega la Pagina**: Modifica profilo → Pagina → scegli «LiveLocal».
5. Controllo: sulla Pagina Facebook, Impostazioni → Account collegati, deve comparire Instagram.

### Parte 2 – dal computer (circa 20 minuti)

1. Vai su `developers.facebook.com`, accedi con **lo stesso account Facebook** che amministra la Pagina e completa la registrazione come sviluppatore.
2. Apri `developers.facebook.com/tools/explorer/` (Graph API Explorer).
3. Nei permessi aggiungi: `instagram_basic`, `pages_show_list`, `pages_read_engagement`, `instagram_manage_insights`. Premi **Generate Access Token** e accetta, scegliendo la Pagina e l'account Instagram di LiveLocal.
4. Nella barra della richiesta (metodo GET) scrivi `me/accounts` e premi Submit. Copia l'`id` della Pagina.
5. Scrivi `ID_PAGINA?fields=instagram_business_account` e premi Submit. Copia l'`id` dell'account Instagram.
6. Scrivi (cambiando `ID_INSTAGRAM`):
   `ID_INSTAGRAM?fields=business_discovery.username(pro_loco_riardo){username,followers_count,media_count,media.limit(5){caption,timestamp,permalink}}`
   e premi Submit.

**Risultato giusto**: compaiono gli ultimi post della Pro Loco di Riardo con testo, data e link. **Se compare un errore** tipo «account non trovato», quell'account non è professionale: riprova con `prolocominturno`, `prolococittadiformia`, `innoalnovello` o `pro_loco_castelforte_suio`. Se nessuno funziona, o se Meta chiede la revisione dell'app o la verifica dell'attività, ci fermiamo e riguardiamo il piano.

**Il token non si incolla mai in chat né nel repository.** Per mostrare il risultato basta un'immagine con la casella «Access Token» coperta.

### Esito della prova (3 novembre 2026, sera): FUNZIONA

- Pagina Facebook «livelocal» e account Instagram professionale `livelocal21` (Azienda, categoria «Sito web») collegati. Nome pubblico «LiveLocal», contatti nascosti.
- **Correzione alla guida sopra:** il Graph API Explorer **richiede un'app** (senza, mostra «Create an app to get started»). App creata su Meta for Developers: «LiveLocalEventi», **non pubblicata** (modalità sviluppo), senza portfolio business collegato, caso d'uso «Gestisci i messaggi e i contenuti su Instagram» con le autorizzazioni `instagram_basic`, `instagram_manage_insights`, `pages_show_list`, `pages_read_engagement` attivate dal caso d'uso (finché non sono attivate lì, l'elenco dell'Explorer è vuoto).
- Nella finestra «Facebook Login for Business» vanno spuntate la Pagina «livelocal» e l'account Instagram `livelocal21` (con «Attiva solo le risorse attuali»). Se non si sceglie la Pagina giusta, `me/accounts` risponde con elenco vuoto o con un'altra Pagina.
- **Risultato:** la richiesta `business_discovery.username(pro_loco_riardo){...}` ha restituito username, follower (2.998), numero di post (160) e i post recenti con didascalia, data e link, **in modalità sviluppo, senza App Review e senza verifica dell'attività**. Il post più recente letto era del 1° novembre 2026.
- Non è stato dimostrato che valga anche per un uso continuativo: da controllare dopo qualche giorno che il token lungo regga e che i limiti di richieste non diano problemi.
- Attenzione: la risposta di `me/accounts` contiene il token della Pagina. Non fotografarla, non incollarla in chat né nel repository.

### Parte 3 – dopo la prova (la fa Claude)

- Se la prova riesce: serve un token che duri (i token utente lunghi durano circa 60 giorni; i token provvisori dell'Explorer durano poco). Si crea un'app su Meta for Developers per ottenerlo e si conserva come segreto di GitHub.
- Si costruisce il controllo giornaliero su GitHub Actions: legge i post nuovi degli account in `docs/organizzatori-da-seguire.md` e li passa alla ricerca automatica come segnalazioni da verificare, **senza ripubblicare i testi nel repository**.
- Punti ancora da decidere dopo la prova: come rinnovare il token ogni 60 giorni senza lavoro a mano, e dove far arrivare i post alla ricerca automatica in modo privato.

## Regole di sicurezza

- Il token di Meta non va mai nel repository (che è pubblico): solo come segreto di GitHub (`Settings → Secrets`) o nella sessione dedicata.
- I token utente di Meta durano circa 60 giorni e vanno rinnovati.
- Non conservare commenti né dati personali: si tengono solo gli eventi e il link al post.
- Telefoni ed email nelle didascalie non si copiano mai (la costruzione del sito si blocca se li trova).

## Decisioni che spettano a Giuseppe

1. Creare la Pagina Facebook e l'account Instagram «LiveLocal» (per l'account servono un indirizzo email e un numero di telefono dell'attività).
2. Scegliere tra associazione (APS) e partita IVA: sblocca Facebook e anche gli sponsor.
3. Usare per l'app Meta lo stesso account Facebook della Pagina, con la doppia verifica attiva.
