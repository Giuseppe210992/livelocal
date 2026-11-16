# Pubblicità e sponsor (16/11/2026)

Decisione di Giuseppe (16/11/2026): offrire a chi vuole la possibilità di **affittare uno spazio pubblicitario contattandolo**. Cambia la regola «nessuna monetizzazione all'inizio» del brief: resta però **nessun sistema di pagamento e nessun ad server** sul sito; si lavora su contatto diretto e preventivo scritto.

- Pagina `/sponsor/` («Pubblicità e sponsor»): cosa c'è sul sito (conteggi calcolati alla costruzione), spazi disponibili (home, luoghi da visitare, territorio: provincia o comune), regole, pulsante «Scrivici per un preventivo» (mailto verso il contatto pubblico in `src/data/impostazioni.json`, con oggetto e testo già scritti). Link «Pubblicità» nel piè di pagina; pagina nella mappa del sito.
- Componente `src/components/SpazioSponsor.astro`: riquadro «Sponsor» con l'invito a contattare; è in home e in `/luoghi/`. Quando c'è uno sponsor se ne cambia il contenuto (testo breve, immagine facoltativa, collegamento), sempre con l'etichetta «Sponsor». Lo spazio «territorio» (pagine di provincia e comune) va creato quando serve.
- Regole pubbliche: etichetta «Sponsor» sempre visibile; nessun tracciamento né cookie di profilazione; gli sponsor non cambiano le informazioni di eventi e luoghi; niente pubblicità ingannevole, illecita o per adulti; nessun numero di visite promesso (il sito non raccoglie statistiche).
- Prezzi: non scritti sul sito, si concordano per iscritto.
- **Da vedere con un commercialista prima di incassare**: sponsor fissi sono un'attività abituale, quindi servirà partita IVA oppure un'associazione/APS (già nel brief, sezione «Contesto fiscale e legale»). Il sito non fattura né incassa: lo fa Giuseppe fuori dal sito.
- Privacy: la pagina non raccoglie dati; le richieste arrivano per email al contatto pubblico.
