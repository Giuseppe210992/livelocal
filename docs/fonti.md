# Fonti consultate

File generato da `scripts/fonti.mjs`: non modificarlo a mano. I dati grezzi sono in `ricerca/fonti.json` (una riga per pagina) e `ricerca/fonti-consultate.json` (pagine aperte e ricerche fatte).

Aggiornato il 2026-11-06. **987 pagine di 676 siti** hanno dato eventi; 169 fonti sono post di Instagram o Facebook; 42 pagine non si sono lette (bloccate, vuote o errore); 366 ricerche già fatte.

## Come usarlo per aggiornare senza ricominciare

1. Scegli la zona (regione o provincia) nelle sezioni sotto e riapri con `fetch_content` le pagine indicate in «Pagina da riaprire», **prima quelle con l'ultima lettura più vecchia**. Sono i calendari e le agende che hanno già dato eventi: non serve cercarli di nuovo.
2. Confronta con `src/data/eventi.json` (stesso titolo e stessa data = già presente) e aggiungi solo gli eventi nuovi o i cambi di data, annullamenti e rinvii.
3. Aggiorna `consultata` nelle fonti degli eventi toccati, poi lancia `node scripts/fonti.mjs`.
4. Se una pagina non si apre più o è cambiata, scrivila in `ricerca/fonti-consultate.json` (campo `pagine`: `url`, `esito`, `data`) e cerca un'alternativa, senza rifare le ricerche dell'intera zona. Le ricerche già fatte sono in quel file, campo `ricerche`.
5. Per Instagram non serve nulla: il controllo automatico legge ogni ora gli account di `ricerca/instagram-account.json`.

Regole che valgono sempre: mai copiare il testo delle pagine, mai contatti privati, data di inizio e luogo precisi scritti nella pagina letta (non nelle anteprime di ricerca).

## Fonti che hanno dato eventi, per zona

## Piemonte

### Torino (TO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fiera Nazionale di San Martino Chieri - Programma | organizzatore | 11 | https://www.fierasanmartinochieri.it/programma | 2026-11-04 |
| Turismo Torino e Provincia | aggregatore | 5 | https://turismotorino.org/it/visita/eventi/teatro-superga-di-nichelino-stagione-2026-27 | 2026-11-06 |
| Comune di Chieri - Eventi | ufficiale | 4 | https://www.comune.chieri.to.it/it/eventi | 2026-11-04 |
| Diocesi di Torino (calendario) | stampa | 4 | https://www.diocesi.torino.it/site/wd-appuntamenti/alpignano-cera-una-svolta-festival-sulle-svolte-storiche-dellumanita-7 (+1 altre pagine) | 2026-11-04 |
| FITA Piemonte - comunicato stampa | organizzatore | 3 | https://www.fitanazionale.eu/comunicati/orbassanoinscena2026 | 2026-11-06 |
| ZAC! - Programmazione | organizzatore | 3 | https://www.lozac.it/programmazione | 2026-11-05 |
| La Ghironda Carmagnola - profilo su Agenda Trad | organizzatore | 2 | https://agendatrad.org/orga/la-ghironda-carmagnola.tpwkqjrj?lang=it | 2026-11-04 |
| Comune di Cirié - Notizie | ufficiale | 2 | https://www.comune.cirie.to.it/it/news/cirieauditorium-al-via-le-iniziative-per-linaugurazione-il-3-novembre-la-cerimonia-istituzionale-e-il-9-novembre-lopening-show | 2026-11-04 |
| Comune di Ivrea - Eventi | ufficiale | 2 | https://www.comune.ivrea.to.it/it/argomenti/eventi | 2026-11-05 |
| Gallerie d'Italia Torino | ufficiale | 2 | https://www.gallerieditalia.com/it/torino/mostre-e-iniziative | 2026-11-03 |
| Go Grugliasco Oratorio - Eventi | organizzatore | 2 | https://www.grugliascooratorio.it/events | 2026-11-05 |
| Teatro Magnetto - Camaleontika 2026 | organizzatore | 2 | https://www.teatromagnetto.it/event/camaleontika-2026/2026-05-23 | 2026-11-04 |
| Visit Giaveno - Eventi in programmazione | ufficiale | 2 | https://www.visitgiaveno.it/eventi-programmazione | 2026-11-05 |
| Natale è Reale (sito dell'evento) | organizzatore | 1 | https://www.natalereale.it/ | 2026-11-06 |
| Fondazione Ordine Mauriziano | ufficiale | 1 | https://www.ordinemauriziano.it/palazzina-stupinigi/eventi/natale-reale-2026 | 2026-11-06 |

### Vercelli (VC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ATL Terre dell'Alto Piemonte - Eventi Valsesia e Vercellese | ufficiale | 6 | https://visitvalsesiavercelli.it/partecipa/eventi-e-news/i-prossimi-eventi | 2026-11-03 |

### Novara (NO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Circolo dei lettori di Novara - calendario eventi | organizzatore | 8 | https://novara.circololettori.it/eventi | 2026-11-06 |
| ARONAnelWEB | stampa | 7 | https://www.aronanelweb.it/evento/rassegna-cai-arona-i-ritmi-della-montagna-con-max-cassani (+2 altre pagine) | 2026-11-04 |
| ATL Novara - Calendario eventi | ufficiale | 4 | https://www.turismonovara.it/it/eventimanifestazioni | 2026-11-03 |
| Comune di Castelletto Sopra Ticino - Eventi | ufficiale | 3 | https://www.comune.castellettosopraticino.no.it/it-it/vivere-il-comune/eventi/sotto-i-veli-del-tempo-132894-1-9f06e9ee956f1f1c5d42ac283c0ce14a (+2 altre pagine) | 2026-11-04 |
| Buongiorno Novara | stampa | 1 | https://www.buongiornonovara.com/avventure-di-carta-2026-a-galliate-no-la-xxxiv-edizione-della-festa-della-letteratura-per-linfanzia-e-ladolescenza | 2026-11-05 |
| Clappit (biglietteria) | aggregatore | 1 | https://www.clappit.com/biglietti/taxi-a-due-piazze-07-novembre-2026-teatro-comunale-oleggio-43053.html | 2026-11-06 |
| Comune di Cameri - Eventi | ufficiale | 1 | https://comune.cameri.no.it/vivere-il-comune/eventi | 2026-11-04 |
| Comune di Galliate - Homepage | ufficiale | 1 | https://comune.galliate.no.it/ | 2026-11-05 |
| Comune di Oleggio - Patrimonio culturale (novità) | ufficiale | 1 | https://comune.oleggio.no.it/argomenti/argomento-dettaglio/2402264 | 2026-11-06 |

### Cuneo (CN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Cuneo Cultura - Calendario eventi | ufficiale | 14 | https://www.cuneocultura.it/eventi/calendario | 2026-11-04 |
| Comune di Cuneo - Eventi | ufficiale | 1 | https://www.comune.cuneo.it/vivere-il-comune/eventi | 2026-11-03 |
| Comune di Mondovì - Eventi | ufficiale | 1 | https://comune.mondovi.cn.it/eventi | 2026-11-05 |
| Fiera Internazionale del Tartufo Bianco d'Alba - Altri eventi | organizzatore | 1 | https://www.fieradeltartufo.org/categorie-eventi/altri-eventi | 2026-11-03 |
| Langhe.net | aggregatore | 1 | https://langhe.net/evento/mercato-mondiale-tartufo-bianco-alba-15-11-26 | 2026-11-04 |
| Turismo Busca, Luce d'Alabastro | ufficiale | 1 | https://www.turismobusca.it/luce-dalabastro | 2026-11-04 |
| Visit Cuneese, Winter Outdoor Weekend 2026 | ufficiale | 1 | https://www.visitcuneese.it/dettaglio-evento/-/d/winter-outdoor-weekend-2026 | 2026-11-04 |
| Visit Piemonte | ufficiale | 1 | https://www.visitpiemonte.com/en/events/fiera-internazionale-del-tartufo-bianco-dalba-96th-edition | 2026-11-03 |

### Asti (AT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Alfieri Asti | ufficiale | 5 | https://www.teatroalfieriasti.it/events/elenco | 2026-11-04 |
| Canelli Eventi - Fiera del Tartufo | organizzatore | 1 | https://www.canellieventi.it/eventi/fiera-del-tartufo | 2026-11-04 |
| La Nuova Provincia | stampa | 1 | https://www.lanuovaprovincia.it/news/cultura-e-spettacoli/505561/palazzo-mazzetti-alla-scoperta-dell-art-nouveau-con-alphonse-mucha.html | 2026-11-04 |
| Il Magico Paese di Natale | organizzatore | 1 | https://www.magicopaesedinatale.com/mercatino-di-asti | 2026-11-04 |
| Paesaggi Vitivinicoli UNESCO Piemonte | aggregatore | 1 | https://www.paesaggivitivinicoliunesco.it/it/eventi/il-natale-in-via-principe-agliano-terme | 2026-11-04 |
| Visit Langhe Monferrato Roero | ufficiale | 1 | https://www.visitlmr.it/it/eventi/calendario-eventi/generici/monferrato/mostra-alphonse-mucha-palazzo-mazzetti-asti | 2026-11-04 |

### Alessandria (AL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Novi Ligure - Eventi | ufficiale | 12 | https://www.comune.noviligure.al.it/it/eventi | 2026-11-06 |
| Casale News - stagione 2026/27 Teatro Municipale | stampa | 10 | https://www.casalenews.it/spettacoli/teatro-municipale-presentata-la-stagione-202627-56219.html | 2026-11-04 |
| Teatro Alessandrino | ufficiale | 7 | https://www.teatroalessandrino.it/eventi-ospiti | 2026-11-04 |
| Radio Gold | stampa | 2 | https://radiogold.it/news-alessandria/eventi/450222-fiera-san-baudolino-2026-programma-alessandria-cibo-vino-tartufi-gusto | 2026-11-04 |
| Rural Pop-Up (Ovada, feste ed eventi) | aggregatore | 2 | https://rural-pop-up.com/it/comuni/ovada-360/eventi | 2026-11-06 |
| Visit Alessandria | ufficiale | 2 | https://visitalessandria.it/eventi-alessandria | 2026-11-04 |
| Alexala | ufficiale | 1 | https://www.alexala.it/it/eventi/fiera-di-san-martino/f52cbbb5c006ea6612aa2d41e2b5bca1?idb=04bacino213dc8760b2e84fef4 | 2026-11-04 |
| il Tacco di Bacco - Teatro Municipale Casale Monferrato | aggregatore | 1 | https://iltaccodibacco.it/casale-monferrato/teatro-municipale | 2026-11-04 |
| Procom - Fiera di Sant'Andrea 2026 | aggregatore | 1 | https://www.procom-on-line.it/fiere/fiera-di-sant-andrea.html | 2026-11-06 |

### Biella (BI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ATL Biella - Eventi nel Biellese | ufficiale | 5 | https://www.atl.biella.it/stampa-eventi?p_p_id=mkspconfigurable_WAR_suggestomkspportlet&p_p_lifecycle=2&p_p_resource_id=html | 2026-11-03 |
| Comune di Biella - Stagione teatrale Biella in scena 2026/2027 (libretto) | ufficiale | 5 | https://comune.biella.it/wp-content/uploads/sites/150/2026/10/Libretto-Biella-26-27-def-1.pdf | 2026-11-04 |

### Verbano-Cusio-Ossola (VB)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Stresa Turismo (Pro Loco / Comune di Stresa) | ufficiale | 3 | https://www.stresaturismo.it/it/eventi | 2026-11-04 |
| VisitOmegna - Eventi | ufficiale | 2 | https://www.visitomegna.it/it/news | 2026-11-06 |
| BLS - Mercatino di Natale di Domodossola | aggregatore | 1 | https://www.bls.ch/it/freizeit-und-ferien/events/domodossola-weihnachtsmarkt | 2026-11-05 |
| Comune di Verbania - Eventi | ufficiale | 1 | https://eventi.comune.verbania.it/Eventi/XX-MOSTRA-DELLA-CAMELIA-INVERNALE-2026 | 2026-11-03 |
| Il Lago Maggiore - Portale ufficiale del turismo | ufficiale | 1 | https://www.illagomaggiore.it/eventi/mostra-della-camelia-invernale-2026 | 2026-11-03 |

## Valle d'Aosta

### Valle d'Aosta (AO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Gazzetta Matin | stampa | 6 | https://www.gazzettamatin.com/2026/11/03/saison-culturelle-dal-4-novembre-biglietti-per-gli-spettacoli-di-dicembre | 2026-11-04 |
| Saison Culturelle Valle d'Aosta | organizzatore | 5 | https://saisonculturellevda.it/spettacoli (+4 altre pagine) | 2026-11-04 |
| Forte di Bard - Eventi in programma | ufficiale | 3 | https://www.fortedibard.it/eventi (+2 altre pagine) | 2026-11-03 |
| Regione Autonoma Valle d'Aosta - Mostre in evidenza | ufficiale | 3 | https://www.regione.vda.it/cultura/mostre_musei/mostre_in_evidenza_i.aspx | 2026-11-03 |
| Marché Vert Noël Aosta | organizzatore | 1 | https://www.mercatinodinataleaosta.it/ | 2026-11-04 |
| Valle d'Aosta Heritage - What's on | ufficiale | 1 | https://valledaostaheritage.com/whats-on | 2026-11-03 |

## Lombardia

### Varese (VA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| VareseNews | stampa | 14 | https://www.varesenews.it/2026/11/novembre-ricco-di-appuntamenti-a-olgiate-olona-cultura-teatro-solidarieta-e-iniziative-per-tutte-le-eta/2727616 (+2 altre pagine) | 2026-11-06 |
| Comune di Induno Olona - Eventi | ufficiale | 7 | https://comune.induno-olona.va.it/argomenti/argomento-dettaglio/3106388 | 2026-11-05 |
| Teatro Sociale di Busto Arsizio, Accabadora | ufficiale | 6 | https://www.teatrosociale.it/spettacoli/frankenstein (+5 altre pagine) | 2026-11-04 |
| Comune di Gerenzano - Eventi | ufficiale | 5 | https://www.comune.gerenzano.va.it/it/eventi/musical-the-crazy-show (+4 altre pagine) | 2026-11-05 |
| Comune di Cardano al Campo - Eventi | ufficiale | 4 | https://comune.cardanoalcampo.va.it/vivere-il-comune/evento/cardano-al-cinema-cineforum-2026-2027 (+3 altre pagine) | 2026-11-04 |
| Comune di Olgiate Olona - Eventi | ufficiale | 4 | https://comune.olgiateolona.va.it/eventi | 2026-11-06 |
| Comune di Castellanza - Tempo libero | ufficiale | 2 | https://www.comune.castellanza.va.it/argomenti/dettaglio/index.html?page=0&categorie=argomento/tempo-libero | 2026-11-04 |
| in-Lombardia (Regione Lombardia) | ufficiale | 2 | https://www.in-lombardia.it/evento/novembre-2026-i-principali-eventi-provincia-di-varese | 2026-11-04 |
| Museo MA*GA | ufficiale | 2 | https://www.museomaga.it/ | 2026-11-03 |
| Cinema Teatro Auditorio - Cassano Magnago | organizzatore | 1 | https://www.auditoriocassano.it/ | 2026-11-04 |
| Comune di Busto Arsizio, eventi | ufficiale | 1 | https://www.comune.bustoarsizio.va.it/it/eventi | 2026-11-04 |
| Fondazione Marcello Morandini | organizzatore | 1 | https://www.fondazionemarcellomorandini.com/fondazione-marcello-morandini-eventi/sintonie-stagione-concertistica-2026 | 2026-11-04 |
| Frontaliere Ticino | stampa | 1 | https://frontaliereticino.ch/articoli-frontaliere/mostre-maga-gallarate-2026 | 2026-11-03 |
| Luinonotizie | stampa | 1 | https://www.luinonotizie.it/2026/11/05/luino-un-libro-in-mano-per-dire-no-alla-violenza-sabato-un-raduno-a-palazzo-verbania/588033 | 2026-11-05 |
| Teatro di Varese | organizzatore | 1 | https://www.teatrodivarese.com/ | 2026-11-04 |

### Como (CO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Sociale di Como | ufficiale | 8 | https://teatrosocialecomo.it/calendario | 2026-11-04 |
| Comune di Erba - Eventi | ufficiale | 5 | https://www.comune.erba.co.it/it/eventi/lentamente-ci-uccidono (+4 altre pagine) | 2026-11-05 |
| Teatro comunale San Teodoro - Stagione 2026/27 | ufficiale | 4 | https://www.teatrosanteodoro.it/ | 2026-11-04 |
| Città dei Balocchi Lake Como | organizzatore | 2 | https://www.cittadeibalocchi.it/ | 2026-11-04 |
| Comune di Como | ufficiale | 2 | https://www.comune.como.it/vivere-il-comune/eventi/Morazzone-a-Como-00001 (+1 altre pagine) | 2026-11-04 |
| Pro Loco Mariano - Calendario | organizzatore | 1 | https://www.prolocomariano.it/iniziativa/il-mercato-in-piazza-2 | 2026-11-05 |
| Visit Alta Valle Intelvi | ufficiale | 1 | https://www.visitaltavalleintelvi.com/eventi-alta-valle-intelvi | 2026-11-04 |

### Sondrio (SO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 8 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Consorzio Turistico Sondrio e Valmalenco | ufficiale | 6 | https://eventi.sondrioevalmalenco.it/ (+5 altre pagine) | 2026-11-04 |
| Porte di Valtellina - Eventi | aggregatore | 3 | https://portedivaltellina.it/eventi | 2026-11-05 |

### Milano (MI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Cinisello Balsamo - Eventi | ufficiale | 18 | https://www.comune.cinisello-balsamo.mi.it/spip.php?article40683 | 2026-11-04 |
| Museo del Novecento - Comune di Milano | ufficiale | 13 | https://www.museodelnovecento.org/it/eventi | 2026-11-04 |
| Comune di Cologno Monzese - eventi sociali | ufficiale | 12 | https://www.comune.colognomonzese.mi.it/it/categorie-eventi/75781 | 2026-11-04 |
| Comune di Lainate - Eventi | ufficiale | 12 | https://comune.lainate.mi.it/vivere-il-comune/evento/laboratorio-in-biblioteca (+4 altre pagine) | 2026-11-05 |
| Piccolo Teatro di Milano - Prossimi spettacoli | ufficiale | 11 | https://www.piccoloteatro.org/it/pages/prossimi-spettacoli | 2026-11-04 |
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html (+1 altre pagine) | 2026-11-05 |
| Comune di Cernusco sul Naviglio - Intelligenza Artificiale | ufficiale | 8 | https://comune.cernuscosulnaviglio.mi.it/novita/notizia/intelligenza-artificiale (+2 altre pagine) | 2026-11-04 |
| Comune di Gorgonzola - Eventi | ufficiale | 8 | https://comune.gorgonzola.mi.it/vivere-il-comune/eventi (+5 altre pagine) | 2026-11-05 |
| Comune di Cesate - Eventi (Uncinetto) | ufficiale | 7 | https://comune.cesate.mi.it/vivere-il-comune/evento/uncinetto-per-giovani-creativi (+1 altre pagine) | 2026-11-04 |
| Triennale Milano - Voce Triennale | ufficiale | 7 | https://triennale.org/voce-triennale | 2026-11-04 |
| Comune di Melzo - Eventi | ufficiale | 6 | https://www.comune.melzo.mi.it/it/eventi/63396/quando-la-vita-cambia-incontro-in-biblioteca (+5 altre pagine) | 2026-11-05 |
| Comune di Cassano d'Adda - Eventi | ufficiale | 5 | https://www.comune.cassanodadda.mi.it/it/eventi | 2026-11-04 |
| Palazzo Reale Milano - Mostre 2026 | ufficiale | 5 | https://www.palazzorealemilano.it/mostre-in-programma/mostre-2026 | 2026-11-04 |
| Comune di Cerro Maggiore - Tempo libero | ufficiale | 4 | https://www.comune.cerromaggiore.mi.it/novita/notizie/novita_772.html (+1 altre pagine) | 2026-11-04 |
| Comune di Magenta - iniziative patrocinate 2026 | ufficiale | 4 | https://comune.magenta.mi.it/amministrazione/associazioni-cittadine/iniziative-patrocinate/iniziative-patrocinate-anno-2026 | 2026-11-05 |
| MUDEC - Mostre in corso | ufficiale | 3 | https://www.mudec.it/mostre-in-corso-2 (+1 altre pagine) | 2026-11-04 |
| Comune di Canegrate - Eventi | ufficiale | 2 | https://comune.canegrate.mi.it/vivere-il-comune/eventi | 2026-11-04 |
| Comune di Cusano Milanino - Agenda eventi | ufficiale | 2 | https://www.comune.cusano-milanino.mi.it/agenda/categoria/eventi | 2026-11-05 |
| LaBolla, Bollate | organizzatore | 2 | https://labollateatro.it/ | 2026-11-04 |
| LegnanoEvents - Home | aggregatore | 2 | https://www.legnanoevents.it/ | 2026-11-05 |
| Comune di Baranzate | ufficiale | 1 | https://www.comune.baranzate.mi.it/it/news/celebrazione-giorno-dell-unita-nazionale-e-giornata-delle-forze-armate-domenica-8-novembre-2026 | 2026-11-04 |
| Comune di Bresso - scheda evento Clown spaventati panettieri | ufficiale | 1 | https://www.comune.bresso.mi.it/it/eventi/spettacolo-teatrale-732630 | 2026-11-04 |
| Comune di Buccinasco - scheda evento Dettagli d'autore | ufficiale | 1 | https://www.comune.buccinasco.mi.it/it/eventi/tributo-a-franco-battiato-726147 | 2026-11-04 |
| Comune di Paderno Dugnano - Eventi | ufficiale | 1 | https://www.comune.paderno-dugnano.mi.it/vivere-il-comune/eventi | 2026-11-06 |
| Comune di Pero – Eventi | ufficiale | 1 | https://www.comune.pero.mi.it/it | 2026-11-06 |
| EventiDiZona | aggregatore | 1 | https://www.eventidizona.it/cosa-fare/arese | 2026-11-04 |
| Giraitalia, Fiera Autunnale 2026 | aggregatore | 1 | https://www.giraitalia.com/fiera/lombardia/fiera-autunnale-2026 | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/antica-fiera-di-san-martino-2026-0 | 2026-11-03 |
| La Cascina Cornaredo - Eventi | organizzatore | 1 | https://lacascinacornaredo.it/eventi | 2026-11-04 |
| Mercati di Milano | aggregatore | 1 | https://mercatidimilano.com/mercatini-di-natale/oh-bej-oh-bej | 2026-11-04 |
| Palazzo Arese Borromeo | organizzatore | 1 | https://palazzoareseborromeo.it/evento | 2026-11-04 |
| Paullo Cultura (sito della Città di Paullo) | ufficiale | 1 | https://www.paullocultura.it/ | 2026-11-06 |
| Fondazione Ema PesciolinoRosso ETS - scheda evento | organizzatore | 1 | https://www.pesciolinorosso.org/it-it/incontro-con-gianpietro-ghidini-a-paderno-dugnano.aspx | 2026-11-06 |

### Bergamo (BG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Donizetti Opera Festival - Calendario | ufficiale | 12 | https://www.donizettiopera.org/it | 2026-11-04 |
| Comune di Martinengo - Filandone in Giallo | ufficiale | 8 | https://www.comune.martinengo.bg.it/it/eventi/filandone-in-giallo (+1 altre pagine) | 2026-11-05 |
| MilanoToday | stampa | 8 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| SanMartinoEvents Festa 2026 | organizzatore | 6 | https://www.sanmartinoevents.it/ | 2026-11-04 |
| Comune di Albino | ufficiale | 5 | https://www.comune.albino.bg.it/it/eventi/romanzo-di-dio (+4 altre pagine) | 2026-11-04 |
| Fondazione Bernareggi - Eventi e mostre | organizzatore | 5 | https://fondazionebernareggi.it/eventi-mostre | 2026-11-04 |
| Comune di Caravaggio - Eventi | ufficiale | 4 | https://www.comune.caravaggio.bg.it/it/eventi/domenica-in-scena-728698 (+2 altre pagine) | 2026-11-04 |
| Comune di Cologno al Serio, Nati per leggere in festa 2026 | ufficiale | 4 | https://www.comune.colognoalserio.bg.it/vivere-il-comune/eventi/tisana-dautore-0 (+3 altre pagine) | 2026-11-04 |
| BergamoNews - Fiera di San Martino | stampa | 2 | https://www.bergamonews.it/evento/fiera-di-san-martino-ad-alzano-le-date-delledizione-2026 | 2026-11-04 |
| Comune di Osio Sotto - Ruralia racconta | ufficiale | 2 | https://www.comune.osiosotto.bg.it/it/eventi/ruralia-racconta-728873 | 2026-11-06 |
| Eco di Bergamo - Eventi | stampa | 2 | https://www.ecodibergamo.it/eventi/eppen/dettaglio/manifestazioni/almenno-san-bartolomeo/almenno-divino_306356 | 2026-11-04 |
| Comune di Almenno San Bartolomeo | ufficiale | 1 | https://www.comune.almennosanbartolomeo.bergamo.it/eventi-data?data=11-11-2026 | 2026-11-04 |
| Comune di Alzano Lombardo - Eventi | ufficiale | 1 | https://www.comune.alzano.bg.it/vivere-il-comune/eventi | 2026-11-04 |
| Comune di Dalmine - Eventi | ufficiale | 1 | https://www.comune.dalmine.bg.it/it/categorie-eventi/72766 | 2026-11-05 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/festival-donizetti-opera-2026 | 2026-11-03 |
| Oriente Day - Programma Alzano Lombardo | organizzatore | 1 | https://orienteday.com/programma-bergamo-alzano-lombardo-28-29-novembre-2026 | 2026-11-04 |
| Teatro Prova - Stagione 2026-2027 Dalmine (pieghevole) | organizzatore | 1 | https://www.teatroprova.com/wp-content/uploads/2026/10/pieghevole-2026-27-dalmine.pdf | 2026-11-05 |

### Brescia (BS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Grande di Brescia - Calendario | ufficiale | 14 | https://teatrogrande.it/it/calendario | 2026-11-04 |
| Comune di Adro | ufficiale | 4 | https://www.comune.adro.bs.it/vivere-il-comune/eventi/calici-di-poesia (+3 altre pagine) | 2026-11-04 |
| Comune di Bedizzole - Eventi | ufficiale | 4 | https://www.comune.bedizzole.bs.it/area_letturaEvento/11510/pagsistema.html (+3 altre pagine) | 2026-11-04 |
| Giornale di Brescia (aBrescia), agenda | stampa | 3 | https://abrescia.giornaledibrescia.it/ricerca?category=4 | 2026-11-05 |
| Centro Fiera Montichiari | organizzatore | 3 | https://www.centrofiera.it/ | 2026-11-05 |
| Comune di Cazzago San Martino - Eventi | ufficiale | 3 | https://comune.cazzago.bs.it/vivere-il-comune/eventi | 2026-11-04 |
| Vivaticket - Teatro Sociale (Palazzolo sull'Oglio) | aggregatore | 3 | https://www.vivaticket.com/it/venue/teatro-sociale/8096050 | 2026-11-06 |
| Comune di Brescia - Eventi | ufficiale | 2 | https://www.comune.brescia.it/it/eventi | 2026-11-04 |
| Comune di Carpenedolo - avvisi (home) | ufficiale | 2 | https://www.comune.carpenedolo.bs.it/ | 2026-11-04 |
| Comune di Concesio - eventi | ufficiale | 2 | https://www.comune.concesio.bs.it/it/events/alienando-lab-di-art-connecting-people (+1 altre pagine) | 2026-11-04 |
| Comune di Montichiari - Eventi | ufficiale | 2 | https://www.montichiari.it/it/categorie-eventi/61667 | 2026-11-05 |
| Comune di Botticino - Eventi | ufficiale | 1 | https://www.comune.botticino.bs.it/pagina133703_eventi.html | 2026-11-04 |
| Comune di Castel Mella - news | ufficiale | 1 | https://www.comune.castelmella.bs.it/it/news/un-libro-per-piacere | 2026-11-04 |
| Comune di Gussago - Eventi | ufficiale | 1 | https://www.comune.gussago.bs.it/EG0/EGSCHTST38.HBL?en=egt61&MESSA=PUBBLICA | 2026-11-05 |
| Dovesagrare (dati Regione Lombardia, sagre e fiere su area pubblica) | aggregatore | 1 | https://www.dovesagrare.it/evento/alfianello/aspettando-il-natale-2026-alfianello-2026-12-08-open-lombardia-sagre-26449 | 2026-11-04 |
| GardaDay - Handel's Messiah concerto 2026 | aggregatore | 1 | https://www.gardaday.com/en/events/desenzano-del-garda/2026-11-07-handel-s-messiah-concerto | 2026-11-05 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/24a-rassegna-della-microeditoria-italiana | 2026-11-03 |
| Teatro Politeama Manerbio - programma | ufficiale | 1 | https://politeamamanerbio.it/ | 2026-11-05 |
| Pro Loco Botticino - Eventi | organizzatore | 1 | https://prolocobotticino.it/eventi | 2026-11-04 |
| Visit Brescia - Manerbio Jazz Festival 2026 | ufficiale | 1 | https://www.visitbrescia.it/eventi/manerbio-jazz-festival | 2026-11-05 |

### Pavia (PV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 8 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| pavia.app (agenda eventi) | aggregatore | 6 | https://pavia.app/eventi | 2026-11-06 |
| in-Lombardia / VisitPavia (Regione Lombardia) | ufficiale | 4 | https://www.in-lombardia.it/evento/pavia-festival-2026 | 2026-11-04 |
| Comune di Mortara - Stagione Teatrale Auditorium Città di Mortara | ufficiale | 2 | https://www.comune.mortara.pv.it/vivere_il_comune/eventi/evento_57.html (+1 altre pagine) | 2026-11-05 |

### Cremona (CR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Crema News - Appuntamenti | stampa | 2 | https://crema-news.it/appuntamenti/gli-appuntamenti-da-oggi-a-mercoled- | 2026-11-04 |
| Teatro Comunale di Casalmaggiore - calendario | ufficiale | 2 | https://www.teatrocasalmaggiore.it/it/calendario | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/festa-del-torrone-2026 | 2026-11-03 |
| Cremona Musei - Mostre ed eventi | ufficiale | 1 | https://musei.comune.cremona.it/it/mostre-ed-eventi | 2026-11-03 |
| Teatro Ponchielli - Calendario | ufficiale | 1 | https://www.teatroponchielli.it/calendario-eventi | 2026-11-04 |

### Mantova (MN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Sociale di Mantova - Spettacoli | ufficiale | 15 | https://www.teatrosocialemantova.it/it-it/spettacoli.aspx | 2026-11-04 |
| Comune di Asola - Eventi | ufficiale | 5 | https://www.comune.asola.mn.it/vivere-il-comune/eventi/san-francesco-800-anni-dalla-morte-1226-2026 (+3 altre pagine) | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 2 | https://www.in-lombardia.it/evento/mantova-jazz-2026 (+1 altre pagine) | 2026-11-03 |
| Centro Palazzo Te | organizzatore | 1 | https://www.centropalazzote.it/inventare-la-natura-leonardo-arcimboldo-caravaggio | 2026-11-03 |
| Comune di Castel Goffredo - eventi | ufficiale | 1 | https://www.comune.castelgoffredo.mn.it/it/events/anselmo-e-giacomo-due-voci-per-la-costituzione-8-11-26 | 2026-11-04 |
| Comune di Mantova - Mercatini di Natale | ufficiale | 1 | https://www.comune.mantova.it/it/eventi/mercatini-di-natale-dal-7-novembre-al-27-dicembre | 2026-11-05 |
| Mantova24 - Cultura | stampa | 1 | https://mantova24.net/cultura | 2026-11-04 |
| Valore Castiglione (sito promozionale del Comune) | ufficiale | 1 | https://www.valorecastiglione.it/ | 2026-11-04 |

### Lecco (LC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 8 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| LeccoToday | stampa | 4 | https://www.leccotoday.it/attualita/novembre-mostre-musei-2026.html | 2026-11-04 |
| Comune di Merate - Eventi | ufficiale | 2 | https://www.comune.merate.lc.it/vivere_il_comune/eventi/evento_504.html | 2026-11-05 |
| Visit Mandello - appuntamenti | ufficiale | 2 | https://www.visitmandello.it/en-us/vivi/appuntamenti (+1 altre pagine) | 2026-11-05 |
| Comune di Calolziocorte - Avvisi | ufficiale | 1 | https://www.comune.calolziocorte.lc.it/Novita/Avvisi | 2026-11-04 |
| Comune di Casatenovo - Homepage (lista eventi) | ufficiale | 1 | https://www.comune.casatenovo.lc.it/ | 2026-11-04 |

### Lodi (LO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Lodi - Eventi | ufficiale | 5 | https://www.comune.lodi.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/1080 | 2026-11-05 |
| Teatro alle Vigne - Lodi | ufficiale | 5 | https://www.teatroallevigne.com/ | 2026-11-05 |
| Comune di Codogno, pagina Sulla Strada – Mostra | ufficiale | 3 | https://comune.codogno.lo.it/vivere-il-comune/eventi/sulla-strada-mostra (+1 altre pagine) | 2026-11-04 |
| VisitLodi (Regione Lombardia) | ufficiale | 1 | https://www.visitlodi.it/it/evento/fiera-di-codogno-2026 | 2026-11-04 |

### Monza e della Brianza (MB)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Monza - Eventi (Musique Royale) | ufficiale | 17 | https://www.comune.monza.it/it/eventi/musique-royale-2519768 (+3 altre pagine) | 2026-11-05 |
| Comune di Giussano - Eventi | ufficiale | 10 | https://www.comune.giussano.mb.it/it/eventi | 2026-11-05 |
| Comune di Arcore | ufficiale | 8 | https://comune.arcore.mb.it/vivere-il-comune/evento/cera-una-volta-pinocchio (+3 altre pagine) | 2026-11-04 |
| Comune di Brugherio - Eventi, categoria Evento culturale | ufficiale | 8 | https://www.comune.brugherio.mb.it/it/categorie-eventi/85684 | 2026-11-04 |
| Comune di Limbiate | ufficiale | 8 | https://comune.limbiate.mb.it/vivere-il-comune/eventi (+7 altre pagine) | 2026-11-05 |
| MilanoToday | stampa | 8 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Comune di Besana in Brianza - Eventi | ufficiale | 6 | https://www.comune.besanainbrianza.mb.it/it/categorie-eventi/78080 | 2026-11-04 |
| Comune di Bernareggio - Eventi | ufficiale | 4 | https://www.comune.bernareggio.mb.it/it/events/alpini-15-anniversario-gruppo-alpini-bernareggio (+1 altre pagine) | 2026-11-04 |
| Reggia di Monza | organizzatore | 3 | https://reggiadimonza.it/cosa-accade | 2026-11-04 |
| Comune di Biassono - Fiera di San Martino 2026 | ufficiale | 1 | https://www.biassono.org/servizi/notizie/notizie_fase02.aspx?ID=38025&categoriaVisualizzata=19 | 2026-11-04 |
| Comune di Carate Brianza - News | ufficiale | 1 | https://www.comune.caratebrianza.mb.it/it/news/radici-e-futuro-incontri-pubblici-di-varia-cultura-coordina-maria-grazia-fornaroli | 2026-11-04 |
| Comune di Desio - Guardando il cielo / Festival delle Storie | ufficiale | 1 | https://www.comune.desio.mb.it/it/eventi/guardando-il-cielo-festival-delle-storie | 2026-11-05 |
| Piazza in Festa (Lombardia) | aggregatore | 1 | https://lombardia.piazzainfesta.it/concorezzo/feel-the-bass-line-112748 | 2026-11-04 |

## Trentino-Alto Adige

### Bolzano (BZ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Brunico - eventi (bruneck.com, turismo locale) | ufficiale | 5 | https://www.bruneck.com/it/scoprire/eventi | 2026-11-04 |
| Laives - Appuntamenti da non perdere | ufficiale | 4 | https://www.laives-leifers.it/it/laives/info-servizi/eventi/grandi-eventi.html | 2026-11-05 |
| Associazione Turistica Appiano | ufficiale | 3 | https://www.eppan.com/it/eventi/feste-ad-appiano/appuntamenti-ad-appiano/kulturkontakt-eppan | 2026-11-04 |
| Museion, sito ufficiale | ufficiale | 2 | https://www.museion.it/it | 2026-11-04 |
| alto-adige.com | aggregatore | 1 | https://www.alto-adige.com/evento/581/mercatino-di-natale-a-san-michele-appiano | 2026-11-04 |
| Italia.it (portale ufficiale ENIT) | ufficiale | 1 | https://www.italia.it/en/south-tyrol/bressanone/things-to-do/event-christmas-markets-bressanone | 2026-11-03 |
| Merano - Alto Adige (portale turistico ufficiale) | ufficiale | 1 | https://www.merano-suedtirol.it/it/merano/informazioni-servizi/eventi/mercatini-di-natale-merano.html | 2026-11-03 |
| Mercatini di Natale Alto Adige | aggregatore | 1 | https://www.mercatini-di-natale.bz.it/alto-adige/merano | 2026-11-03 |
| Mercatino di Natale Bolzano (sito ufficiale) | organizzatore | 1 | https://www.mercatinodinatalebz.it/ | 2026-11-03 |
| suedtirol.info | ufficiale | 1 | https://www.suedtirol.info/it/it/esperienze-eventi/eventi-alto-adige/pdp-evento.C381A455A8694108B060F9D33E469DBD.sagra-di-san-martino.appiano-sulla-strada-del-vino | 2026-11-04 |
| Turismo.it | stampa | 1 | https://www.turismo.it/eventi-festival/fiere-enogastronomiche/merano-winefestival-2026-programma-date | 2026-11-05 |

### Trento (TN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Mart, mostre ed eventi | ufficiale | 7 | https://www.mart.tn.it/mostre-eventi | 2026-11-04 |
| Comune di Aldeno | ufficiale | 2 | https://www.comune.aldeno.tn.it/Vivere-il-comune/Eventi/Festa-del-Ringraziamento-Aldeno (+1 altre pagine) | 2026-11-04 |
| Comune di Pergine Valsugana – Natale a Pergine | ufficiale | 1 | https://www.comune.pergine.tn.it/Vivere-il-Comune/Eventi/Natale-a-Pergine | 2026-11-06 |
| Mercatino di Natale di Arco | organizzatore | 1 | https://www.mercatininatalearco.com/it | 2026-11-04 |
| Trento Città del Natale | ufficiale | 1 | https://natale.visittrento.it/mercatino | 2026-11-03 |
| Visit Rovereto e Vallagarina | ufficiale | 1 | https://www.visitrovereto.it/vivi/eventi/mercatino-di-natale-ala | 2026-11-04 |

## Veneto

### Verona (VR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Piazza in Festa - scheda evento | aggregatore | 3 | https://veneto.piazzainfesta.it/bovolone/villaggio-di-natale-a-bovolone-125618 | 2026-11-04 |
| Fondazione Arena di Verona - Teatro Filarmonico | organizzatore | 2 | https://www.arena.it/teatro-filarmonico-verona/spettacoli | 2026-11-03 |
| Comune di Grezzana - La Gabriella e le ragazze | ufficiale | 2 | https://www.comune.grezzana.vr.it/it/eventi/un-cuore-di-donna (+1 altre pagine) | 2026-11-05 |
| Arte.it - Calendario mostre Verona | aggregatore | 1 | https://arte.it/calendario-arte/verona/2026/11/12 | 2026-11-03 |
| Fiera del Bollito (sito della fiera; pagina letta: home del sito dedicato) | organizzatore | 1 | https://www.fieradelbollito.it/ | 2026-11-05 |
| Garda Outdoors | aggregatore | 1 | https://www.garda-outdoors.com/le-storie-di-pallalunga-al-teatro-comunale-dim-di-castelnuovo-del-garda | 2026-11-04 |
| Verona Run Marathon (sito ufficiale) | organizzatore | 1 | https://www.veronarunmarathon.it/ | 2026-11-03 |

### Vicenza (VI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Comunale Città di Vicenza, calendario | ufficiale | 15 | https://www.tcvi.it/it/eventi/calendario-eventi | 2026-11-04 |
| Comune di Montecchio Maggiore - Eventi | ufficiale | 11 | https://www.comune.montecchio-maggiore.vi.it/it/eventi/ora-ti-racconto-701703-727246-727248 (+9 altre pagine) | 2026-11-05 |
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| InArzignano (portale del Comune) | ufficiale | 4 | https://www.inarzignano.it/2026/11/mondovisioni2026 (+1 altre pagine) | 2026-11-04 |
| Occhi Eventi - Eventi a Cassola | aggregatore | 4 | https://www.occhi.it/eventi/cassola/intrattenimento?srsltid=AYCX9vKdPi8EHyTz9t4YftJOjax4YiIiBnP4EsiL0W5lsWK8cYBBBz6O | 2026-11-04 |
| cheventi.it - Eventi a Dueville (VI) | aggregatore | 3 | https://www.cheventi.it/regioni/veneto/vicenza/dueville | 2026-11-05 |
| Fondazione Aida - Auditorium Vivaldi Cassola | organizzatore | 2 | https://www.fondazioneaida.it/auditorium-a-vivaldi-di-cassola | 2026-11-04 |
| Piazza in Festa - Natale a Malo 2026 | aggregatore | 2 | https://veneto.piazzainfesta.it/malo/natale-a-malo-2026-118367 | 2026-11-05 |
| Comune di Altavilla Vicentina | ufficiale | 1 | https://comune.altavillavicentina.vi.it/novita/cerimonia-4-novembre-2026-festa-dellunita-nazionale-110-anniversario-della-vittoria-della-guerra | 2026-11-04 |
| VIVA - Eventi Vicenza (Comune di Vicenza) | ufficiale | 1 | https://eventi.comune.vicenza.it/Eventi/Mostra-Italia-Germania.-Pittura-e-scultura-tra-Ottocento-e-Novecento.-Da-Canova-a-Kiefer | 2026-11-03 |
| Musei Biblioteca Archivio di Bassano del Grappa | ufficiale | 1 | https://www.museibassano.it/it/eventi | 2026-11-04 |

### Belluno (BL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Feltre | ufficiale | 3 | https://visitfeltre.info/categoriaevento/programma-eventi-estivi-a-feltre | 2026-11-04 |
| Comune di Alpago | ufficiale | 1 | https://www.comune.alpago.bl.it/ | 2026-11-04 |
| Evients, Sherwood Christmas Festival a Zumelle | aggregatore | 1 | https://www.evients.com/events/babbo-natale-allo-sherwood-christmas-festival/d5e3f9798b3c40d298d0de478b7e50c0 | 2026-11-04 |
| Visit Dolomiti Bellunesi - Calendario eventi | aggregatore | 1 | https://www.visitdolomitibellunesi.com/it/eventi/concerto-omaggioa-dino-buzzati | 2026-11-04 |

### Treviso (TV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Montebelluna - I prossimi eventi in Citta | ufficiale | 6 | https://www.comune.montebelluna.tv.it/c026046/po/mostra_news.php?id=3391&area=H | 2026-11-05 |
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Veneto Today - San Martin a Mojan 2026 | stampa | 4 | https://venetotoday.it/san-martin-a-mojan-2026-quattro-scelte-per-famiglie-a-mogliano-veneto-copia | 2026-11-05 |
| Teatro Accademia di Conegliano - stagione 2026/27 | ufficiale | 3 | https://teatroaccademia.it/ | 2026-11-04 |
| Musei Civici Treviso | ufficiale | 1 | https://www.museicivicitreviso.it/mostre-ed-eventi/la-materia-dei-sogni-radici-dellarte-africana-contemporanea | 2026-11-03 |
| Vivaticket | aggregatore | 1 | https://www.vivaticket.com/it/ticket/oderzo-suona-battisti/306484 | 2026-11-06 |

### Venezia (VE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Mirano - calendario manifestazioni novembre 2026 | ufficiale | 18 | https://www.comune.mirano.ve.it/it/news/calendario-manifestazioni-novembre-2026-a-mirano | 2026-11-05 |
| Teatro La Fenice, calendario | ufficiale | 9 | https://www.teatrolafenice.it/en/whats-on | 2026-11-04 |
| Arteven - stagione 2026/2027 del Teatro Dario Fo | ufficiale | 2 | https://www.arteven.it/camponogara-in-partenza-la-stagione-2026-2027-del-teatro-comunale-dario | 2026-11-04 |
| Cultura Veneto (Regione Veneto) | ufficiale | 2 | https://www.culturaveneto.it/cultura-tradizione/feste-popolari-rievocazioni/73832d16-81ac-49ae-9063-77375f1e6023 | 2026-11-04 |
| Caorle Christmas Time - Tourist Office App (Regione del Veneto) | ufficiale | 2 | https://touristofficeapp.com/it/dolo/eventi/i-do-love-teatro?id=877dd44e-db6a-423b-6e89-08df370be25f (+1 altre pagine) | 2026-11-05 |
| Arte Laguna Prize (organizzatore) | organizzatore | 1 | https://artelagunaprize.com/exhibition-2026 | 2026-11-03 |
| Caorle.com - Paolo Ruffini Din Don Down | aggregatore | 1 | https://www.caorle.com/en/news-events/paolo-ruffini-din-don-down-at-palaexpomar-in-caorle | 2026-11-04 |
| Comune di Campolongo Maggiore - Novità | ufficiale | 1 | https://www.comune.campolongo.ve.it/novita/15-novembre-camminata-azzurra-insieme-per-la-prevenzione | 2026-11-04 |
| Comune di Musile di Piave - Eventi | ufficiale | 1 | https://www.comune.musile.ve.it/vivere-il-comune/eventi/i-colori-dello-spirito-viaggio-nel-mondo-dellicona-2 | 2026-11-05 |
| Comune di Jesolo - Eventi | ufficiale | 1 | https://jesolo.it/events-1/categoria/eventi | 2026-11-05 |
| MUVE, Agenda Contemporanea 2026 | ufficiale | 1 | https://www.visitmuve.it/evento/agenda-contemporanea | 2026-11-04 |

### Padova (PD)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Padova Cultura - Eventi culturali | ufficiale | 10 | https://padovacultura.padovanet.it/it/eventi-culturali | 2026-11-06 |
| Tecnogas Auditorium Albignasego | organizzatore | 7 | https://www.auditoriumalbignasego.it/eventi | 2026-11-04 |
| Comune di Camposampiero - Il teatro per tutti 2026/27 | ufficiale | 6 | https://www.comune.camposampiero.pd.it/novita/il-teatro-per-tutti-al-ferrari-un-nuovo-ricchissimo-programma | 2026-11-04 |
| PadovaOggi - Tutti gli eventi di novembre a Cittadella | stampa | 6 | https://www.padovaoggi.it/eventi/eventi-cittadella-novembre-2026.html (+1 altre pagine) | 2026-11-04 |
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Museo Villa Bassi Rathgeb | organizzatore | 5 | https://www.museovillabassiabano.it/eventi-in-corso (+1 altre pagine) | 2026-11-04 |
| Teatro Pietro d'Abano | organizzatore | 5 | https://teatropietrodabano.it/en/eventi-teatro | 2026-11-04 |
| Padova24Ore - Teatro a Monselice | aggregatore | 3 | https://www.padova24ore.it/teatro-a-monselice-scene-este-2026 | 2026-11-05 |
| Arte.it - Mostre Padova novembre 2026 | aggregatore | 1 | https://www.arte.it/calendario-arte/padova/2026/11 | 2026-11-03 |
| Comune di Montegrotto Terme - Eventi | ufficiale | 1 | https://www.comune.montegrottoterme.pd.it/eventi | 2026-11-05 |
| Palazzo Zabarella | organizzatore | 1 | https://www.zabarella.it/ | 2026-11-03 |

### Rovigo (RO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Badia Polesine | ufficiale | 5 | https://www.comune.badiapolesine.ro.it/eventi | 2026-11-04 |
| Comune di Occhiobello - Home (novità) | ufficiale | 1 | https://www.comune.occhiobello.ro.it/ | 2026-11-06 |
| Palazzo Roverella | organizzatore | 1 | https://www.palazzoroverella.com/man-ray-il-maestro-del-surrealismo | 2026-11-03 |
| La Voce di Rovigo (Polesine24) | stampa | 1 | https://www.polesine24.it/cultura/2026/10/28/news/il-delta-del-po-in-un-grande-battito-dali-406798 | 2026-11-06 |
| touristofficeapp - Regione del Veneto | ufficiale | 1 | https://touristofficeapp.com/it/occhiobello/eventi/battito-dali?id=1d866bee-4c69-4f66-648a-08df34b0608b | 2026-11-06 |

## Friuli-Venezia Giulia

### Udine (UD)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Nuovo Giovanni da Udine | organizzatore | 3 | https://www.teatroudine.it/ | 2026-11-04 |
| Comune di Cividale del Friuli - La Stagione Teatrale 2026-2027 | ufficiale | 2 | https://www.cividale.com/it/la_stagione_teatrale | 2026-11-04 |
| PromoTurismoFVG (elenco eventi nei borghi) | ufficiale | 2 | https://www.turismofvg.it/it/borghi-storici/eventi-nei-borghi | 2026-11-04 |
| VisitGemona - Eventi a Gemona | aggregatore | 2 | https://visitgemona.com/feel/eventi-a-gemona | 2026-11-05 |
| GiroFVG - Feste e fiere di San Martino 2026 | aggregatore | 1 | https://www.girofvg.com/feste-fiere-san-martino-2026 | 2026-11-04 |
| Grado.it - Eventi ed escursioni (Consorzio Grado Turismo) | aggregatore | 1 | https://grado.it/it/eventi-ed-escursioni | 2026-11-04 |
| Italia.it - Gemona, formaggio... e dintorni | ufficiale | 1 | https://www.italia.it/it/friuli-venezia-giulia/udine/cosa-fare/evento-formaggio-gemona | 2026-11-05 |
| SiViaggia | stampa | 1 | https://siviaggia.it/notizie/sagre-feste-friuli-venezia-giulia-novembre-2026/606010 | 2026-11-03 |

### Gorizia (GO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Let's Go Gorizia (Comune di Gorizia) | ufficiale | 1 | https://letsgo.gorizia.it/eventi | 2026-11-04 |
| Scopri Gorizia - Italia Settanta, eventi di novembre | ufficiale | 1 | https://www.scopri.gorizia.it/eventi/italia-settanta-eventi-di-novembre | 2026-11-05 |
| Teatro Comunale di Monfalcone | ufficiale | 1 | https://www.teatromonfalcone.it/al-via-la-stagione-2026-2027 | 2026-11-04 |
| Turismo FVG - Stagione Teatrale 2026/2027 | ufficiale | 1 | https://www.turismofvg.it/eventi/stagione-teatrale-2026-2027 | 2026-11-05 |

### Trieste (TS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Verdi di Trieste, sito ufficiale | ufficiale | 9 | https://www.teatroverdi-trieste.com/it | 2026-11-04 |
| Turismo FVG - Eventi | ufficiale | 3 | https://www.turismofvg.it/it/mare/eventi | 2026-11-03 |
| Castello di Miramare, eventi | ufficiale | 2 | https://miramare.cultura.gov.it/eventi | 2026-11-04 |
| Discover Trieste - Trieste Now | aggregatore | 1 | https://www.discover-trieste.it/vivi/trieste-now/san-martino-a-muggia | 2026-11-05 |

### Pordenone (PN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Verdi Pordenone - biglietteria online | organizzatore | 6 | https://teatroverdipordenone.ticka.it/ | 2026-11-04 |
| Instart - programmazione 2026/27 del Teatro Verdi | stampa | 5 | https://www.instart.info/teatro-verdi-di-pordenone-presenta-la-programmazione-2026-2027 | 2026-11-04 |
| SagraMap | aggregatore | 2 | https://sagramap.com/friuli-venezia-giulia/pordenone (+1 altre pagine) | 2026-11-04 |
| PromoTurismoFVG (elenco eventi nei borghi) | ufficiale | 2 | https://www.turismofvg.it/it/borghi-storici/eventi-nei-borghi | 2026-11-04 |
| ERT FVG - Teatro di Cordenons | ufficiale | 1 | https://ertfvg.it/teatri/cordenons | 2026-11-04 |

## Liguria

### Imperia (IM)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Sanremonews | stampa | 11 | https://www.sanremonews.it/2026/11/02/leggi-notizia/argomenti/agenda-manifestazioni/articolo/tutti-gli-appuntamenti-e-manifestazioni-da-lunedi-2-a-domenica-8-novembre-2026-in-riviera-e-cote.html | 2026-11-04 |
| Imperia Musei - Planetario di Imperia | ufficiale | 2 | https://planetario.imperiamusei.it/programmazione-degli-spettacoli-al-planetario | 2026-11-05 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 1 | https://lamialiguria.it/eventi/olioliva-imperia | 2026-11-03 |

### Savona (SV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Scopri Albenga - calendario eventi | aggregatore | 26 | https://www.scoprialbenga.it/eventi.htm | 2026-11-04 |
| Visit Finale Ligure - calendario eventi | aggregatore | 14 | https://visitfinaleligure.it/eventi | 2026-11-05 |
| Teatro Chiabrera | ufficiale | 6 | https://teatrochiabrera.it/artistica-2026-27 | 2026-11-03 |
| Visit Savona - Il Teatro Chiabrera dà il via alla Stagione 2026/27 | ufficiale | 6 | https://www.visitsavona.com/it/il-teatro-chiabrera-da-il-via-alla-stagione-2026-27 | 2026-11-03 |
| Museo dell'Arte Vetraria Altarese | organizzatore | 1 | https://www.museodelvetro.org/ | 2026-11-04 |

### Genova (GE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Palazzo Ducale Genova - Calendario mostre e eventi | ufficiale | 14 | https://palazzoducale.genova.it/calendario-eventi | 2026-11-05 |
| Comune di Chiavari - Eventi (MORE JAZZ) | ufficiale | 8 | https://www.comune.chiavari.ge.it/it/events/more-jazz-experience-ii-edizione-2026 (+2 altre pagine) | 2026-11-04 |
| Ambienti culturali genovesi - Stagione concertistica Auditorium Campodonico | aggregatore | 2 | https://ambienticulturaligenovesi.it/event/stagione-concertistica-auditorium-campodonico-rassegna-musicale-a-cura-del-corpo-bandistico-citta-di-lavagna | 2026-11-05 |
| Cronache Ponentine | stampa | 2 | https://www.cronacheponentine.com/calendario-eventi | 2026-11-04 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 2 | https://lamialiguria.it/eventi/tartufando-a-genova (+1 altre pagine) | 2026-11-03 |
| Comune di Lavagna - Novità ed eventi | ufficiale | 1 | https://www.lavagnaturismo.it/novit%C3%A0-ed-eventi | 2026-11-05 |
| Musei di Genova - Mostre ed eventi | ufficiale | 1 | https://www.museidigenova.it/it/mostre-ed-eventi-1 | 2026-11-05 |

### La Spezia (SP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Civico La Spezia | ufficiale | 6 | https://teatrocivico.it/calendario_stagione_teatrale | 2026-11-04 |
| Gazzetta della Spezia (comunicato del Comune di Sarzana) | stampa | 4 | https://gazzettadellaspezia.com/cultura/182740-al-ridotto-del-teatro-impavidi-torna-domeniche-in-musica-quattro-concerti-da-novembre | 2026-11-04 |
| Lerici Coast (sito turistico ufficiale del Comune di Lerici) | ufficiale | 2 | https://lericicoast.it/evento/il-magico-mondo-di-babbo-natale-arriva-a-lerici (+1 altre pagine) | 2026-11-05 |
| SpeziaCultura - I Giovedì in archivio | aggregatore | 2 | https://www.speziacultura.it/evento/i-giovedi-in-archivio | 2026-11-05 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 1 | https://lamialiguria.it/eventi/festa-di-san-martino-a-biassa-della-spezia | 2026-11-03 |

## Emilia-Romagna

### Piacenza (PC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Piacenza - Eventi | ufficiale | 3 | https://www.comune.piacenza.it/it/eventi | 2026-11-03 |
| Visit Piacenza - Natale a Piacenza | ufficiale | 2 | https://visitpiacenza.it/events/natale-a-piacenza | 2026-11-06 |
| Comune di Alta Val Tidone | ufficiale | 1 | https://www.comune.altavaltidone.pc.it/it/eventi/festa-dei-mugnai-mulino-borgo-lentino-edizione-2026 | 2026-11-04 |

### Parma (PR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Parma Welcome (portale turistico di Parma) | aggregatore | 2 | https://parmawelcome.it/mostre-parma (+1 altre pagine) | 2026-11-04 |
| Castelli del Ducato - Festa della Storia 2026 | aggregatore | 1 | https://www.castellidelducato.it/castellidelducato/evento.asp?el=festa-della-storia-2026-a-fidenza-il-tempo-del-mercante-a-borgo-castelli-ducato | 2026-11-05 |
| Palazzo Tarasconi (sede della mostra) | organizzatore | 1 | https://palazzotarasconi.it/mostra/caravaggio-e-la-luce-del-seicento-11-novembre-2026-28-marzo-2027 | 2026-11-04 |
| Turismo Valtaro e Valceno - calendario eventi | aggregatore | 1 | https://www.turismovaltaro.it/calendario-eventi | 2026-11-04 |
| Visit Fidenza - calendario | aggregatore | 1 | https://visitfidenza.it/eventi | 2026-11-05 |

### Reggio nell'Emilia (RE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Reggio Emilia Welcome - Novembre 2026 (IAT-R, Comune) | ufficiale | 7 | https://www.reggioemiliawelcome.it/it/eventi/calendari-mensili/novembre-2026 | 2026-11-03 |
| Teatro De André - Nuovi linguaggi | organizzatore | 5 | https://teatrodeandre.it/category/stagione-26-27/fuori-26-27/nuovi-linguaggi | 2026-11-04 |
| Comune di Castellarano - Eventi | ufficiale | 4 | https://www.comune.castellarano.re.it/it/eventi/alessandro-di-modica-a-on-focus (+3 altre pagine) | 2026-11-04 |
| Unione Tresinaro Secchia - agenda Casalgrande | ufficiale | 1 | https://unionetresinarosecchia.it/eventi?comune=Casalgrande | 2026-11-04 |

### Modena (MO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ModenaToday - Tutti gli eventi a Modena | stampa | 11 | https://www.modenatoday.it/eventi | 2026-11-05 |
| Radio Pico | stampa | 11 | https://www.radiopico.it/torna-il-festival-del-noir-di-finale-emilia-mo-tra-novita-e-grandi-ospiti | 2026-11-05 |
| Oj Eventi – Musica a Palazzo | aggregatore | 7 | https://www.ojeventi.it/eventi/musica-a-palazzo-vii-edizione-a-pavullo-nel-frignano-dal-24-ottobre-2026-al-6-gennaio-2027-mo | 2026-11-06 |
| Teatro Comunale Modena Pavarotti-Freni | ufficiale | 4 | https://www.teatrocomunalemodena.it/danza (+1 altre pagine) | 2026-11-04 |
| Vox Club Nonantola - eventi | organizzatore | 4 | https://www.voxclub.it/ | 2026-11-06 |
| Stagione 2026-2027 Nonantola | ufficiale | 3 | https://www.ater.emr.it/it/teatri-e-stagioni/stagione-2026-2027-nonantola | 2026-11-06 |
| Comune di Maranello - Buon Natale Maranello | ufficiale | 3 | https://www.comune.maranello.mo.it/vivere-maranello/eventi/buon-natale-maranello (+1 altre pagine) | 2026-11-05 |
| Comune di Carpi - Eventi (home) | ufficiale | 2 | https://www.comune.carpi.mo.it/ | 2026-11-04 |
| Gioventù Musicale d'Italia, sede di Modena – calendario concerti | organizzatore | 2 | https://gmimodena.it/calendario-dei-concerti | 2026-11-04 |
| Teatro Comunale di Carpi | ufficiale | 2 | https://teatrocarpi.it/ | 2026-11-04 |
| CheSagra! | aggregatore | 1 | https://www.chesagra.it/emilia-romagna/mo/castelnuovo-rangone/superzampone | 2026-11-04 |
| Comune di Pavullo nel Frignano – Eventi | ufficiale | 1 | https://www.comune.pavullo-nel-frignano.mo.it/evento | 2026-11-06 |
| Ferrari Museums - Calendario eventi | ufficiale | 1 | https://www.ferrari.com/it-IT/museums/events-calendar | 2026-11-05 |
| Comune di Mirandola - Aperitivo in Giallo | ufficiale | 1 | https://mirandola.comune.digital/fb-news/i/ac4a3699c2120435db983d4fb6cf9967/-dopo-il-successo-della-prima-edizione-venerdi-20-novembre-torna-aperitivo-giallo-liniziativa-pro | 2026-11-05 |
| Visit Formigine - Visioni in scena | ufficiale | 1 | https://www.visitformigine.it/category/senza-categoria | 2026-11-05 |

### Bologna (BO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calendario del Comune di Bologna (culturabologna.it) | ufficiale | 33 | https://www.culturabologna.it/agenda (+2 altre pagine) | 2026-11-04 |
| Comune di Castenaso - Eventi | ufficiale | 6 | https://www.comune.castenaso.bo.it/it-it/vivere-il-comune/eventi | 2026-11-04 |
| Bologna Città della Musica (Comune di Bologna) | ufficiale | 5 | https://cittadellamusica.comune.bologna.it/calendario-citta-della-musica | 2026-11-04 |
| Cultura Imola - agenda | ufficiale | 4 | https://www.culturaimola.it/calendar | 2026-11-05 |
| Comune di Ozzano dell'Emilia - Eventi | ufficiale | 3 | https://www.comune.ozzano.bo.it/it-it/vivere-il-comune/eventi | 2026-11-06 |

### Ferrara (FE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Ferrara - Calendario generale eventi 2026 | ufficiale | 16 | https://www.comune.ferrara.it/attachments/file/view?hash=0286b34319693c43a275d33ec9d35609e8ece2adbaa99250634223ce8aea5686&canCache=0 | 2026-11-04 |
| Comune di Codigoro, programma Festa di San Martino 2026 | ufficiale | 10 | https://me.comuni-chiamo.com/@codigoro/c/37f043cf-16e4-4089-b02e-9208bafeed51 | 2026-11-04 |
| InFerrara - Agenda eventi (Comune di Ferrara) | ufficiale | 9 | https://www.inferrara.it/agenda-eventi | 2026-11-04 |
| Comune di Cento - Eventi | ufficiale | 6 | https://www.comune.cento.fe.it/it/eventi (+2 altre pagine) | 2026-11-04 |
| Valli di Argenta - Ecomuseo | organizzatore | 6 | https://www.vallidiargenta.org/eventi | 2026-11-04 |
| Spettacolo in Emilia-Romagna - Teatro Comunale Ferrara, Opera & Danza 2026/27 | ufficiale | 2 | https://spettacolo.emiliaromagnacultura.it/it/rassegna/teatro-comunale-ferrara-opera-danza-2026-2027 | 2026-11-04 |
| Palazzo dei Diamanti - Fondazione Ferrara Arte | organizzatore | 1 | https://www.palazzodiamanti.it/mostre/da-monet-a-van-gogh-a-kandinsky | 2026-11-03 |

### Ravenna (RA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| FAE Faenza Eventi - calendario | aggregatore | 9 | https://faenzaeventi.it/eventi | 2026-11-05 |
| Turismo Cervia - Gli eventi di dicembre | ufficiale | 8 | https://www.turismo.comunecervia.it/it/eventi/manifestazioni-e-iniziative/gli-eventi-di-dicembre (+1 altre pagine) | 2026-11-04 |
| Bagnacavallo Cultura | ufficiale | 4 | https://bagnacavallocultura.it/il-programma | 2026-11-04 |
| Comune di Ravenna - Eventi | ufficiale | 2 | https://comune.ravenna.it/vivere-il-comune/eventi/mostra | 2026-11-03 |
| Vivi Romagna | aggregatore | 2 | https://www.viviromagna.it/bagnacavallo | 2026-11-04 |
| Comune di Massa Lombarda - Eventi | ufficiale | 1 | https://www.comune.massalombarda.ra.it/Vivere-il-comune/Eventi/41-RASSEGNA-CORALE-CITTA-MASSA-LOMBARDA | 2026-11-05 |

### Forlì-Cesena (FC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ERT - Teatro Bonci, stagione 2026/27 | organizzatore | 6 | https://cesena.emiliaromagnateatro.com/la-stagione-2026-2027 | 2026-11-04 |
| Spettacolo in Emilia-Romagna - Teatro Diego Fabbri di Forlì, stagione 2026/27 | ufficiale | 6 | https://spettacolo.emiliaromagnacultura.it/it/rassegna/teatro-diego-fabbri-di-forli-stagione-2026-27 | 2026-11-04 |
| Teatro Comunale di Gambettola | ufficiale | 5 | https://teatrocomunalegambettola.com/ | 2026-11-05 |
| Visit Bertinoro - Festa di Santa Caterina 2026 | ufficiale | 5 | https://www.visitbertinoro.it/it/eventi/festa-di-santa-caterina-2026 | 2026-11-04 |
| Comune di Cesena - Agenda cultura | ufficiale | 4 | https://sititematici.comune.cesena.fc.it/agenda-cultura | 2026-11-04 |
| MAF - Museo Archeologico di Forlimpopoli | ufficiale | 2 | https://www.maforlimpopoli.it/sabati-in-famiglia-mani-nella-storia-sabato-12-settembre-3-ottobre-14-novembre-e-19-dicembre | 2026-11-05 |
| Vivi Cesena - Prossimi eventi | aggregatore | 2 | https://www.vivicesena.it/eventi_prossimi.php | 2026-11-04 |
| Accademia Perduta - Teatro Dragoni | organizzatore | 1 | https://accademiaperduta.it/teatro-dragoni/madre-per-sempre | 2026-11-05 |
| Cartellone Emilia-Romagna - Madre per sempre | ufficiale | 1 | https://cartellone.emiliaromagnacultura.it/it/evento/madre-per-sempre | 2026-11-05 |
| Emilia Romagna Turismo (Regione Emilia-Romagna) | ufficiale | 1 | https://emiliaromagnaturismo.it/it/eventi/civitella-romagna-cusercoli-sagra-tartufo-bianco-pregiato-bidente | 2026-11-03 |
| Ideanet - Mercatini di Natale 2026 a Cesenatico | aggregatore | 1 | https://ideanet.it/mercatini-natale-cesenatico-2026 | 2026-11-04 |
| Visit Cesenatico - I mercatini di Natale | ufficiale | 1 | https://visitcesenatico.it/vivi-cesenatico/eventi/i-mercatini-di-natale | 2026-11-04 |
| Viviromagna - Eventi a Meldola | aggregatore | 1 | https://www.viviromagna.it/meldola | 2026-11-05 |

### Rimini (RN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Vivaticket - 77ª Sagra Musicale Malatestiana | aggregatore | 5 | https://www.vivaticket.com/it/tour/sagra-musicale-malatestiana/4276 | 2026-11-04 |
| Fellini Museum - Eventi e News | organizzatore | 3 | https://fellinimuseum.it/news-eventi | 2026-11-04 |
| Comune di Bellaria Igea Marina - Eventi | ufficiale | 2 | https://www.comune.bellaria-igea-marina.rn.it/it/events/wonder-walks-christmas (+1 altre pagine) | 2026-11-04 |
| Comune di Rimini | ufficiale | 2 | https://www.comune.rimini.it/novita/notizie/dal-2-al-27-novembre-torna-il-festival-del-mondo-antico | 2026-11-03 |
| Gli Eventi di Cattolica (cattolica.info) | aggregatore | 1 | https://www.cattolica.info/eventi | 2026-11-04 |
| RiminiToday - Incontri con l'autore Coriano | stampa | 1 | https://www.riminitoday.it/eventi/incontri-autore-coriano-libri-presentazioni-calendario-2026-2027.html | 2026-11-04 |
| Visit Rimini - Events | ufficiale | 1 | https://www.visitrimini.com/en/events | 2026-11-04 |

## Toscana

### Massa-Carrara (MS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Guglielmi (Comune di Massa) - Spettacoli | ufficiale | 7 | https://www.teatroguglielmi.it/spettacoli | 2026-11-05 |
| Lunigiana World - Calendario eventi | aggregatore | 4 | https://www.lunigianaworld.it/calendario-eventi | 2026-11-04 |
| Visit Riviera Apuana - Eventi | aggregatore | 2 | https://www.visitrivieraapuana.it/eventi | 2026-11-04 |

### Lucca (LU)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Turismo Lucca – Comune di Lucca | ufficiale | 14 | https://turismo.lucca.it/eventi-lucca | 2026-11-03 |
| Comune di Capannori - Eventi | ufficiale | 6 | https://www.comune.capannori.lu.it/vivere-il-comune/eventi | 2026-11-04 |
| LaVersilia.it - Eventi a Camaiore | aggregatore | 5 | https://www.laversilia.it/eventi-camaiore | 2026-11-04 |
| Comune di Massarosa - Notizie | ufficiale | 3 | https://www.comune.massarosa.lu.it/notizie/Mercatini-di-Natale--ecco-le-date--al-via-la-macchina-organizzativa.html | 2026-11-05 |
| Teatro del Giglio Giacomo Puccini, calendario | ufficiale | 3 | https://www.teatrodelgigliogiacomopuccini.it/it/il-calendario | 2026-11-05 |
| Tempo Libero Toscana | aggregatore | 2 | https://www.tempoliberotoscana.it/eventcategory/lucca-versilia | 2026-11-03 |
| dovealucca.it | aggregatore | 1 | https://www.dovealucca.it/eventi-lucca/10170-barga-in-cioccolato-2026 | 2026-11-04 |
| e-borghi.com | aggregatore | 1 | https://www.e-borghi.com/eventi/barga/barga-in-cioccolato-2026 | 2026-11-04 |

### Pistoia (PT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Pistoia - Eventi | ufficiale | 6 | https://www.visitpistoia.eu/eventi | 2026-11-04 |
| Comune di Monsummano Terme - Eventi | ufficiale | 4 | https://www.comune.monsummano-terme.pt.it/node | 2026-11-05 |
| Comune di Pistoia – Eventi | ufficiale | 2 | https://www.comune.pistoia.it/it/eventi/80633/la-periferia-dell-anima-volti-e-ferite (+1 altre pagine) | 2026-11-04 |
| Pro Loco Il Rondò - Blog | organizzatore | 1 | https://www.rondomontevettolini.it/blog | 2026-11-05 |

### Firenze (FI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Fiesole - Fiesole for You, Eventi | ufficiale | 21 | https://www.fiesoleforyou.it/eventi | 2026-11-04 |
| Autumnia 2026 - programma (Comune di Figline e Incisa Valdarno) | ufficiale | 13 | https://www.autumnia.it/services/programma-generale | 2026-11-05 |
| Teatro Garibaldi - Teatro Comunale Figline | ufficiale | 12 | https://www.teatrogaribaldi.org/ | 2026-11-05 |
| Comune di Calenzano - Eventi | ufficiale | 5 | https://www.comune.calenzano.fi.it/it/events/t-immagini-stagione-teatrale-2026-2027-727193 (+4 altre pagine) | 2026-11-04 |
| FirenzeToday - Natale a Castelfiorentino 2026 | stampa | 4 | https://www.firenzetoday.it/eventi/natale-castelfiorentino-eventi-2026.html (+1 altre pagine) | 2026-11-05 |
| Comune di Borgo San Lorenzo, eventi | ufficiale | 2 | https://www.comune.borgo-san-lorenzo.fi.it/it/eventi | 2026-11-04 |
| Comune di Empoli - comunicato stampa | ufficiale | 2 | https://www.comune.empoli.fi.it/Novita/Comunicati/Primo-weekend-d-autunno-e-un-ricco-programma-di-eventi-da-vivere-nel-centro-storico-di-Empoli | 2026-11-05 |
| Comune di Fucecchio - Eventi | ufficiale | 2 | https://www.comune.fucecchio.fi.it/home/vivere/eventi.html | 2026-11-05 |
| Feel Florence - Mercato di Natale Santa Croce | aggregatore | 2 | https://www.feelflorence.it/it/eventi/mercato-di-stabbia-cerreto-guidi (+1 altre pagine) | 2026-11-05 |
| Calendario eventi 2026 del Comune di Campi Bisenzio (allegato 1) | ufficiale | 1 | https://campibisenzio.trasparenza-valutazione-merito.it/web/trasparenza/papca-p?p_p_id=jcitygovalbopubblicazioni_WAR_jcitygovalbiportlet&p_p_lifecycle=2&p_p_state=pop_up&p_p_mode=view&p_p_resource_id=downloadAllegato&p_p_cacheability=cacheLevelPage&_jcitygovalbopubblicazioni_WAR_jcitygovalbiportlet_downloadSigned=true&_jcitygovalbopubblicazioni_WAR_jcitygovalbiportlet_id=2607999&_jcitygovalbopubblicazioni_WAR_jcitygovalbiportlet_action=mostraDettaglio&_jcitygovalbopubblicazioni_WAR_jcitygovalbiportlet_fromAction=recuperaDettaglio | 2026-11-04 |
| Comune di Cerreto Guidi - Eventi | ufficiale | 1 | https://www.comune.cerreto-guidi.fi.it/it/eventi | 2026-11-04 |
| Comune di Firenze - Eventi | ufficiale | 1 | https://www.comune.firenze.it/vivere-il-comune/eventi | 2026-11-05 |
| Comune di Figline e Incisa Valdarno - Autumnia 2026 | ufficiale | 1 | https://www.comunefiv.it/vivere-il-comune/eventi/autumnia-2026-2 | 2026-11-05 |
| Montelupo Eventi - Cèramica 2026 | organizzatore | 1 | https://montelupoeventi.it/ceramica-2026 | 2026-11-05 |
| Fondazione Palazzo Strozzi | ufficiale | 1 | https://www.palazzostrozzi.org/mostre-future | 2026-11-03 |
| VisitCertaldo - News | ufficiale | 1 | https://www.visitcertaldo.com/site/news | 2026-11-04 |

### Livorno (LI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fondazione Teatro Goldoni - Programma 2026/2027 | organizzatore | 6 | https://www.goldoniteatro.it/spettacoli | 2026-11-04 |
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/livorno-grosseto | 2026-11-03 |
| Museo della Città di Livorno - Eventi | ufficiale | 1 | https://www.museodellacittalivorno.it/eventi | 2026-11-05 |
| Sagre Toscane | aggregatore | 1 | https://www.sagretoscane.com/sagre/li/campiglia-marittima/festa-d-autunno-campiglia-marittima.html | 2026-11-04 |

### Pisa (PI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro di Pisa - Teatro Verdi, stagione 2026-2027 | ufficiale | 7 | https://teatrodipisa.it/ | 2026-11-04 |
| Comune di Pisa - Turismo, Eventi | ufficiale | 7 | https://www.turismo.pisa.it/eventi/index.html | 2026-11-04 |
| Pisatoday - Cascina Europa 2026 | stampa | 6 | https://www.pisatoday.it/cronaca/cascina-europa-2026-programma.html | 2026-11-04 |
| Comune di Calcinaia, notizia sulla mostra | ufficiale | 2 | https://www.comune.calcinaia.pi.it/tipi-di-notizia/notizie (+1 altre pagine) | 2026-11-04 |
| Comune di Montopoli in Val d'Arno - Eventi | ufficiale | 1 | https://www.comune.montopoli.pi.it/eventi/La-memoria-che-resta.html | 2026-11-05 |
| Visit Tuscany (portale turistico della Toscana) | ufficiale | 1 | https://www.visittuscany.com/en/events/white-truffle-exhibition-san-miniato | 2026-11-03 |

### Arezzo (AR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/siena-arezzo | 2026-11-03 |
| Mercatini di Natale Arezzo - Villaggio Tirolese | organizzatore | 3 | https://mercatininatalearezzo.it/villaggio-tirolese | 2026-11-04 |
| Comune di Arezzo - Teatro Petrarca, stagione 2026/2027 | ufficiale | 2 | https://www.comune.arezzo.it/novita/teatro-petrarca-stagione-teatrale-20262027 | 2026-11-04 |
| Comune di Cortona - Eventi | ufficiale | 2 | https://www.comune.cortona.ar.it/vivere-il-comune/eventi/evento-culturale/concerto-i-romantici-beethoven-e-schumann (+1 altre pagine) | 2026-11-04 |
| ArezzoInforma | stampa | 1 | https://www.arezzoinforma.it/castiglion-fiorentino-il-14-e-15-novembre-torna-il-weekend-dellolio | 2026-11-04 |
| Discover Arezzo – Stagione Teatro Petrarca | aggregatore | 1 | https://www.discoverarezzo.com/eventi/stagione-teatro-petrarca-26-27 | 2026-11-04 |
| Fondazione Guido d'Arezzo – Stagione di prosa 2026/2027 | organizzatore | 1 | https://www.fondazioneguidodarezzo.com/stagione-di-prosa-2026-2027 | 2026-11-04 |
| Venti Lucenti - Schiaccianoci 2026 | organizzatore | 1 | https://www.ventilucenti.it/evento-spettacolo/schiaccianoci-2026-petrarca | 2026-11-04 |

### Siena (SI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Siena – Siena Incanta | ufficiale | 15 | https://www.comune.siena.it/novita/siena-incanta-si-accende-il-natale-siena-eventi-spettacoli-e-mostre-internazionali-le | 2026-11-03 |
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/siena-arezzo | 2026-11-03 |
| Italia.it | ufficiale | 1 | https://www.italia.it/it/toscana/siena/cosa-fare/evento-fiaccole-di-natale-abbadia-san-salvatore | 2026-11-04 |
| Mercatini di Natale e Castello di Babbo Natale (mercatini-natale.com) | aggregatore | 1 | https://mercatini-natale.com/montepulciano-mercatini-natale | 2026-11-05 |
| Natale a Montepulciano (sito ufficiale) | organizzatore | 1 | https://nataleamontepulciano.it/ | 2026-11-05 |
| Sagre Toscane | aggregatore | 1 | https://www.sagretoscane.com/rassegne/si/montepulciano/festa-d-autunno-montepulciano.html | 2026-11-05 |

### Grosseto (GR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Tuttomaremma - Eventi di novembre | aggregatore | 11 | https://www.tuttomaremma.com/eventinovembre.htm | 2026-11-04 |
| Teatro Fonderia Leopolda - programmazione | organizzatore | 3 | https://leopolda.adarte.18tickets.it/ | 2026-11-05 |
| Monte Argentario - Calendario eventi | aggregatore | 3 | https://www.monteargentario.info/calendario-eventi.htm | 2026-11-05 |
| Orbetello Turismo - calendario eventi | aggregatore | 3 | https://orbetelloturismo.it/events/category/calendario-eventi | 2026-11-06 |
| Parco della Maremma - Parco aperto, gli eventi di novembre | ufficiale | 3 | https://parco-maremma.it/parco-aperto-gli-eventi-di-novembre | 2026-11-04 |
| Comune di Monte Argentario - Eventi | ufficiale | 1 | https://www.comune.monteargentario.gr.it/it-it/vivere-il-comune/eventi | 2026-11-05 |
| Fondazione Grosseto Cultura | ufficiale | 1 | https://www.fondazionegrossetocultura.it/index.php/alle-clarisse-una-mostra-fotografica-per-ricordare-lalluvione-di-grosseto-del-1966 | 2026-11-04 |
| Ufficio Turistico di Massa Marittima | ufficiale | 1 | https://www.turismomassamarittima.it/07-08-11-26-29-edizione-di-sapori-dautunno-tatti | 2026-11-04 |

### Prato (PO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Prato - Cartellone Eventi | ufficiale | 5 | https://tempolibero.comune.prato.it/ (+1 altre pagine) | 2026-11-04 |
| Il Borghista | aggregatore | 1 | https://www.ilborghista.it/events/antica-fiera-di-carmignano-2026-martedi-1-dicembre-pro-loco-carmignano-aps-e-da | 2026-11-04 |

## Umbria

### Perugia (PG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Stabile dell'Umbria - calendario spettacoli | organizzatore | 26 | https://teatrostabile.umbria.it/calendario (+1 altre pagine) | 2026-11-04 |
| Comune di Marsciano - Arte e cultura a novembre | ufficiale | 9 | https://www.comune.marsciano.pg.it/it/news/arte-e-cultura-a-novembre | 2026-11-05 |
| Comune di Gubbio - Gubbio è Natale 2026 | ufficiale | 8 | https://www.comune.gubbio.pg.it/en/news/gubbio-e-natale-2026-la-citta-si-accende-di-magia | 2026-11-05 |
| Assisi Eventi | aggregatore | 4 | https://www.assisieventi.it/ | 2026-11-04 |
| bastia.it (Novembre: un mese di cultura e non solo per Bastia) | stampa | 4 | https://www.bastia.it/novembre-un-mese-di-cultura-e-non-solo-per-bastia | 2026-11-04 |
| Comune di Foligno - Questo mese in città | ufficiale | 2 | https://comune.foligno.pg.it/turismo/questo-mese-in-citta | 2026-11-05 |
| CAI Gualdo Tadino - Eventi | organizzatore | 1 | https://caigualdotadino.it/?post_type=tribe_events&eventDisplay=list | 2026-11-05 |
| Eurochocolate (organizzatore) | organizzatore | 1 | https://www.eurochocolate.com/perugia2026 | 2026-11-03 |
| Lago Trasimeno Consorzio URAT | aggregatore | 1 | https://www.lagotrasimeno.net/it/eventi | 2026-11-04 |
| Umbria24 | stampa | 1 | https://www.umbria24.it/gusto24/ventanni-di-festivol-trevi-ancora-tra-olio-nuovo-arte-musica-e-papille | 2026-11-03 |

### Terni (TR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Stabile dell'Umbria - calendario spettacoli | organizzatore | 25 | https://teatrostabile.umbria.it/calendario | 2026-11-04 |
| Vivi Terni – Comune di Terni | ufficiale | 6 | https://turismo.comune.terni.it/eventi | 2026-11-03 |
| Comune di Orvieto - Eventi | ufficiale | 1 | https://www.comune.orvieto.tr.it/it/eventi | 2026-11-06 |
| Feltrinelli Editore - appuntamenti | organizzatore | 1 | https://www.feltrinellieditore.it/appuntamenti/2026/10/16/le-disavventure-della-verita-incontro-con-umberto-galimberti-a-orvieto | 2026-11-06 |

## Marche

### Pesaro e Urbino (PU)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Programma 61a Fiera del Tartufo Bianco di Acqualagna | organizzatore | 12 | https://acqualagna.com/programma | 2026-11-04 |
| Comune di Pesaro – Calendario eventi | ufficiale | 5 | https://www.comune.pesaro.pu.it/novita-in-comune/eventi/calendario-eventi | 2026-11-06 |
| Turismo Marche (Regione Marche) | ufficiale | 2 | https://letsmarche.it/-/tatuaggi.-storie-dal-mediterraneo (+1 altre pagine) | 2026-11-03 |
| Teatri di Pesaro - prosa 2026.27 | organizzatore | 2 | https://www.teatridipesaro.it/categoria/prosa2026-27 | 2026-11-04 |
| Il Borghista, scheda evento | aggregatore | 1 | https://www.ilborghista.it/events/mercatino-di-natale-2026-12-mercatino-di-natale-2026-metauro-eventi-o-d-v-pro-loco-di-serrungarina | 2026-11-04 |

### Ancona (AN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Ancona - Eventi | ufficiale | 6 | https://www.comune.ancona.it/it/eventi | 2026-11-04 |
| Fondazione Pergolesi Spontini - Calendario | organizzatore | 6 | https://www.fondazionepergolesispontini.com/calendario | 2026-11-05 |
| Marche Teatro - Stagione 2026-27 di Ancona Prosa-Danza | organizzatore | 5 | https://www.marcheteatro.it/stagione-2026-27-di-ancona-prosa-danza | 2026-11-04 |
| Non solo eventi Marche | aggregatore | 5 | https://www.nonsoloeventimarche.it/eventi-per-provincia.php?id=ancona&page=5 | 2026-11-04 |
| Teatro La Nuova Fenice - stagione 2026/27 | organizzatore | 5 | https://teatrolanuovafeniceosimo.it/stagione-26-27 | 2026-11-06 |
| Comune di Castelfidardo - Eventi | ufficiale | 2 | https://www.comune.castelfidardo.an.it/it/eventi | 2026-11-04 |
| Il Borghista - Falò D'Autunno 2026 | aggregatore | 1 | https://www.ilborghista.it/events/falo-dautunno-2026-pro-loco-chiaravallese | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 1 | https://letsmarche.it/-/castelli-di-jesi-nel-bicchiere-1 | 2026-11-03 |

### Macerata (MC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Morrovalle - Eventi (Morrovalle in bianco e nero) | ufficiale | 5 | https://www.comune.morrovalle.mc.it/vivere-il-comune/eventi/morrovalle-in-bianco-e-nero-tre-giorni-di-teatro-voci-e-letture-per-raccontare-il-borgo (+1 altre pagine) | 2026-11-05 |
| Comune di Macerata - Teatro Lauro Rossi, stagione 2026/2027 | ufficiale | 4 | https://www.comune.macerata.it/vivere-il-comune/eventi/teatro-lauro-rossi-stagione-2026-2027 | 2026-11-04 |
| Comune di Matelica - Eventi | ufficiale | 4 | https://www.comune.matelica.mc.it/vivere_il_comune/eventi/evento_121.html (+3 altre pagine) | 2026-11-05 |
| Comune di Recanati - Teatro Persiani, stagione 2026/27 | ufficiale | 3 | https://www.comune.recanati.mc.it/it/news/il-teatro-persiani-presenta-la-stagione-2026-27 | 2026-11-04 |
| AMAT - Platea delle Marche | organizzatore | 2 | https://www.amatmarche.net/ (+1 altre pagine) | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 2 | https://letsmarche.it/-/expositio-mundi-la-mostra-come-medium (+1 altre pagine) | 2026-11-04 |
| Non solo eventi Marche - Civitanova all'Opera | aggregatore | 2 | https://www.nonsoloeventimarche.it/eventi-per-provincia.php?id=macerata (+1 altre pagine) | 2026-11-05 |

### Ascoli Piceno (AP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Ascoli Piceno – Calendario eventi | ufficiale | 6 | https://www.comune.ap.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/151/UT/systemPrint | 2026-11-04 |
| AMAT - Grottammare 2026-2027 | organizzatore | 3 | https://www.amatmarche.net/grottammare-2026-2027 | 2026-11-05 |
| Comune di Monteprandone - Eventi | ufficiale | 1 | https://comune.monteprandone.ap.it/eventi | 2026-11-05 |
| Non solo eventi Marche | aggregatore | 1 | https://www.nonsoloeventimarche.it/eventi-per-provincia.php?id=ascoli-piceno | 2026-11-03 |

### Fermo (FM)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Fermo - Stagione teatrale 2026/27 | ufficiale | 9 | https://www.visitfermo.it/it/stagione-teatrale-2026-27 | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 1 | https://letsmarche.it/-/diamanti-a-tavola-festival-del-tartufo-bianco-pregiato-di-amandola-2026 | 2026-11-03 |
| Non solo eventi Marche - Stagione concertistica Amici della Musica | aggregatore | 1 | https://www.nonsoloeventimarche.it/dettaglio.php?id=stagione-concertistica-amici-della-musica---montegranaro | 2026-11-05 |

## Lazio

### Viterbo (VT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Civitafestival - Genesis Duo Project | organizzatore | 4 | https://www.civitafestival.it/sudditi-digitali (+3 altre pagine) | 2026-11-04 |
| Teatro dell'Unione di Viterbo | organizzatore | 4 | https://www.teatrounioneviterbo.it/la-stagione (+2 altre pagine) | 2026-11-04 |
| Viterbo Christmas Village | organizzatore | 2 | https://www.viterbochristmas.it/ | 2026-11-04 |

### Rieti (RI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| EventiOK | aggregatore | 3 | https://eventiok.it/eventi/reate-festival-rieti | 2026-11-04 |
| Reate Festival (Fondazione Flavio Vespasiano) | organizzatore | 2 | https://www.reatefestival.it/ultima-edizione.html | 2026-11-04 |
| Associazione Pro Canneto | organizzatore | 1 | https://cannetosabino.it/event/29a-festa-dellolio-nuovo | 2026-11-04 |
| Comune di Rieti | ufficiale | 1 | https://comune.rieti.it/novita/reate-festival-presentata-ledizione-2026 | 2026-11-04 |

### Roma (RM)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Culture Roma - Casa del Cinema 2025-2026 | ufficiale | 56 | https://culture.roma.it/manifestazione/casa-del-cinema-2025-2026 (+4 altre pagine) | 2026-11-06 |
| CastellInforma - Frascati | aggregatore | 24 | https://www.castellinforma.it/home/?st=town&ts=Frascati (+2 altre pagine) | 2026-11-05 |
| Teatro Ghione - spettacoli in programmazione | ufficiale | 23 | https://www.teatroghione.it/eventi (+1 altre pagine) | 2026-11-06 |
| Roma Sotterranea (programma visite) | organizzatore | 20 | https://www.visiteromasotterranea.it/tour/programs | 2026-11-06 |
| RomaToday | stampa | 17 | https://www.romatoday.it/eventi/roma-jazz-festival-1-24-novembre-2026.html (+2 altre pagine) | 2026-11-06 |
| Accademia Nazionale di Santa Cecilia – calendario concerti | ufficiale | 14 | https://santacecilia.it/concerti/calendario-concerti | 2026-11-06 |
| Teatro di Roma - Teatro Torlonia | ufficiale | 14 | https://www.teatrodiroma.net/spettacoli/il-teatro-e-vita-la-stagione-2026-2027-del-teatro-di-roma/teatro-torlonia (+3 altre pagine) | 2026-11-06 |
| Teatro Brancaccio - Stagione 2026-2027 | ufficiale | 13 | https://teatrobrancaccio.it/stagione-sezione/stagione-2026-2027 | 2026-12-04 |
| Teatro Ambra Jovinelli - Figli | ufficiale | 12 | https://www.ambrajovinelli.org/figli-dal-9-al-20-dicembre-2026 | 2026-11-06 |
| Roma Jazz Festival (programma) | organizzatore | 11 | https://romajazzfestival.it/programma | 2026-11-06 |
| Eliseo Teatro - Meno di due | ufficiale | 10 | https://eliseoteatro.it/spettacoli/piccolo-eliseo-2026-2027/meno-di-due (+1 altre pagine) | 2026-11-06 |
| Teatro Manzoni - Programma | ufficiale | 10 | https://teatromanzoniroma.it/programma | 2026-11-06 |
| Teatro Petrolini - Prossimi spettacoli | ufficiale | 10 | https://www.teatropetrolini.it/spettacoli | 2026-11-06 |
| Auditorium Parco della Musica – eventi | ufficiale | 9 | https://www.auditorium.com/it/eventi | 2026-11-06 |
| Romaeuropa Festival - programma | organizzatore | 9 | https://romaeuropa.net/programma | 2026-11-06 |
| Teatro Belli - Home | ufficiale | 9 | https://www.teatrobelli.it/ | 2026-11-06 |
| Biblioteche di Roma - Eventi a Casa della Memoria e della Storia | ufficiale | 8 | https://www.bibliotechediroma.it/opac/news/eventi-a-casa-della-memoria-e-della-storia/30410 | 2026-11-06 |
| Roma Tre Orchestra – Concerti 26-27 | organizzatore | 8 | https://r3o.org/stagione-artistica/concerti-26-27 | 2026-11-06 |
| Teatro Verde - Home | ufficiale | 8 | https://www.teatroverde.it/ | 2026-11-06 |
| Alexanderplatz Jazz Club – calendario | organizzatore | 7 | https://www.alexanderplatzjazz.com/tutti-gli-eventi | 2026-11-06 |
| Teatro dell'Opera di Roma – calendario stagione 2026/27 (PDF) | ufficiale | 7 | https://operaroma.b-cdn.net/wp-content/uploads/2026/06/TEATRO-DELLOPERA-DI-ROMA-STAGIONE_26-27_LOW.pdf | 2026-11-06 |
| Teatro Quirino - Stagione 2026-2027 | ufficiale | 7 | https://www.teatroquirino.it/stagione-2026-2027 | 2026-11-06 |
| Teatro Vittoria - Stagione 2026-2027 | ufficiale | 7 | https://www.teatrovittoria.it/ | 2026-11-06 |
| Pro Loco Città di Colleferro, agenda eventi | organizzatore | 6 | https://www.prolococolleferro.it/eventi | 2026-11-04 |
| Sala Umberto - Stagione 2026-2027 | ufficiale | 6 | https://salaumberto.com/stagione-sezione/stagione-2026-2027 | 2026-11-06 |
| Teatro di Roma - biglietteria Vivaticket | ufficiale | 6 | https://teatrodiroma.vivaticket.it/ | 2026-11-06 |
| Teatro Tordinona - Programma | organizzatore | 6 | https://www.tordinonateatro.it/p/programma.html | 2026-11-06 |
| IUC – Stagione completa | organizzatore | 5 | https://www.concertiiuc.it/stagione-completa | 2026-11-06 |
| Teatro Parioli Costanzo - Stagione 2026-27 | ufficiale | 5 | https://www.ilparioli.it/mec-category/stagione-teatrale-2026-27 | 2026-11-06 |
| Roma Unplugged Festival | organizzatore | 5 | https://www.romaunpluggedfestival.it/ | 2026-11-06 |
| Teatro Golden - Stagione 2026-2027 | ufficiale | 5 | https://www.teatrogolden.it/stagione-2026-2027 | 2026-11-06 |
| Teatro Trastevere - La stagione 26/27 | ufficiale | 5 | https://www.teatrotrastevere.it/la-stagione | 2026-11-06 |
| Festival Liszt Albano | organizzatore | 4 | https://festivalisztalbano.it/ | 2026-11-04 |
| Fondazione Pro Musica e Arte Sacra – XXV Festival | organizzatore | 4 | https://www.fondazionepromusicaeartesacra.org/fondazione/xxiv-festival-internazionale | 2026-11-06 |
| Mondoreale | stampa | 4 | https://www.mondoreale.it/2026/10/anzio-nasce-anzio-che-legge-cinque-incontri-con-gli-autori-tra-ottobre-e-dicembre | 2026-11-04 |
| Museo Nazionale Romano | ufficiale | 4 | https://museonazionaleromano.it/evento/il-museo-in-scena (+1 altre pagine) | 2026-11-06 |
| Palazzo Esposizioni Roma | organizzatore | 4 | https://www.palazzoesposizioniroma.it/ | 2026-11-03 |
| Parco Regionale dell'Appia Antica – eventi | ufficiale | 3 | https://eventi.parcoappiaantica.it/ | 2026-11-06 |
| Fondazione Giovanni Pierluigi da Palestrina - Eventi | organizzatore | 3 | https://www.fondazionepierluigipalestrina.it/eventi | 2026-11-06 |
| Musei Capitolini - Calendario | ufficiale | 3 | https://www.museicapitolini.org/it/calendario | 2026-11-06 |
| MAXXI - Gordon Matta-Clark | ufficiale | 2 | https://www.maxxi.art/en/events/gordon-matta-clark (+1 altre pagine) | 2026-11-06 |
| Museo di Roma in Trastevere - The Thin Line | ufficiale | 2 | https://www.museodiromaintrastevere.it/it/cartella-stampa/thin-line (+1 altre pagine) | 2026-11-06 |
| Rome 15K - info gara | organizzatore | 2 | https://www.rome15k.com/15k-info | 2026-11-06 |
| Auditorium Conciliazione – calendario | ufficiale | 1 | https://auditoriumconciliazione.it/ | 2026-11-06 |
| Gallerie Nazionali Barberini Corsini | ufficiale | 1 | https://barberinicorsini.org/evento/barberiniana-ii-tributo-alla-fioritura-delle-arti-romane-nella-prima-meta-del-xvii-secolo | 2026-11-06 |
| Città metropolitana di Roma Capitale - Eventi | ufficiale | 1 | https://www.cittametropolitanaroma.it/events/event/lanuvio-torna-il-festival-della-maza-tra-storia-sapori-e-tradizioni-antiche | 2026-11-05 |
| Parco archeologico del Colosseo | ufficiale | 1 | https://colosseo.it/evento/bill-viola-foro-romano | 2026-11-06 |
| Comune di Fiumicino - Eventi | ufficiale | 1 | https://comune.fiumicino.rm.it/it/eventi/alici-no-strane-a-km-0 | 2026-11-05 |
| Concerto di Natale in Cattedrale – sito ufficiale | organizzatore | 1 | https://www.concertodinataleincattedrale.it/ | 2026-11-06 |
| Galleria Borghese - sito ufficiale | ufficiale | 1 | https://galleriaborghese.cultura.gov.it/ | 2026-11-06 |
| Il Sistina - Mamma Mia 2026 | ufficiale | 1 | https://ilsistina.it/mamma-mia-2026 | 2026-11-06 |
| Il Tacco di Bacco - Guidonia Montecelio | aggregatore | 1 | https://iltaccodibacco.it/guidonia-montecelio | 2026-11-05 |
| MoaCasa | organizzatore | 1 | https://www.moacasa.com/ | 2026-11-06 |
| Palazzo Bonaparte - Mostre | organizzatore | 1 | https://www.mostrepalazzobonaparte.it/mostra-kandinsky.php | 2026-11-06 |
| Musei di Villa Torlonia - Elisa Montessori | ufficiale | 1 | https://www.museivillatorlonia.it/it/mostra-evento/elisa-montessori-nel-corso-del-tempo | 2026-11-06 |
| Museo Carlo Bilotti - Marina Bindella. Cosmografie | ufficiale | 1 | https://www.museocarlobilotti.it/it/mostra-evento/marina-bindella-cosmografie | 2026-11-06 |
| Museo di Roma - Keith Haring | ufficiale | 1 | https://www.museodiroma.it/it/mostra-evento/keith-haring | 2026-11-06 |
| Museo Napoleonico - Il barocco italiano a Dresda | ufficiale | 1 | https://www.museonapoleonico.it/it/mostra-evento/il-barocco-italiano-dresda-0 | 2026-11-06 |
| OggiRoma | aggregatore | 1 | https://www.oggiroma.it/eventi/visite-guidate/la-galleria-doria-pamphilj/94899 | 2026-11-06 |
| Teatro dell'Opera di Roma – stagione 2026/27 | ufficiale | 1 | https://www.operaroma.it/news/il-dolce-suono-mi-colpi-la-stagione-2026-2027-del-teatro-dellopera-di-roma | 2026-11-06 |
| Più libri più liberi | organizzatore | 1 | https://plpl.it/ | 2026-11-06 |
| Roma Arte in Nuvola - Info utili | organizzatore | 1 | https://romaarteinnuvola.eu/informazioni | 2026-11-06 |
| Roma Urbs Mundi - percorso e regolamento | organizzatore | 1 | https://www.romaurbsmundi.it/2023/09/26/ecco-il-nuovo-percorso-della-roma-urbs-mundi | 2026-11-06 |
| Sport e Salute - Corri Libera 2026 | ufficiale | 1 | https://www.sportesalute.eu/primo-piano/corri-libera-2026-roma-corre-contro-la-violenza-sulle-donne-il-15-novembre-torna-la-5-km-dal-colosseo-ai-fori-imperiali-lo-sport-diventa-una-corsa-collettiva-per-la-liberta.html | 2026-11-06 |
| TrovaSagre | aggregatore | 1 | https://trovasagre.com/en/evento/festival-del-gusto-albano-laziale-rm-2026 | 2026-11-04 |
| Turismo Roma - C’era una volta... Scugnizzi | ufficiale | 1 | https://www.turismoroma.it/it/eventi/cera-una-voltascugnizzi | 2026-11-06 |
| Viaggiando Italia | stampa | 1 | https://www.viaggiando-italia.it/villaggio-di-natale-ladispoli-2026-un-mese-di-festa-tra-mercatini-spettacoli-e-mare-dinverno | 2026-11-05 |
| Vivaticket - Christmas Garden | aggregatore | 1 | https://www.vivaticket.com/it/tour/christmas-garden/5108 | 2026-11-06 |

### Latina (LT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ScopriGaeta - Eventi | aggregatore | 7 | https://scoprigaeta.it/eventi | 2026-11-05 |
| Fattivivo | aggregatore | 5 | https://www.fattivivo.com/eventi/liberi-di-scegliere-stagione-teatrale-2026-2027-teatro-dannunzio | 2026-11-03 |
| LatinaToday - Concerti d'Autunno 2026 | stampa | 4 | https://www.latinatoday.it/eventi/concerti-d-autunno-2026-latina.html | 2026-11-05 |
| Telegolfo | stampa | 4 | https://www.telegolfo.com/minturno-camminata-tra-gli-olivi-7-8-novembre-2026 (+2 altre pagine) | 2026-11-02 |
| Ministero della Cultura | ufficiale | 3 | https://cultura.gov.it/evento/4-novembre-2026-giorno-dellunita-nazionale-e-giornata-delle-forze-armate-museo-archeologico-nazionale-di-formia (+2 altre pagine) | 2026-11-03 |
| Lazio Eventi | aggregatore | 2 | https://lazioeventi.com/eventi/calici-a-corte (+1 altre pagine) | 2026-11-03 |
| Scopri Formia | aggregatore | 2 | https://scopriformia.it/en/guide/eventi-formia-2026-11 | 2026-11-03 |
| VisitLazio – Regione Lazio | ufficiale | 2 | https://www.visitlazio.com/eventi-lazio/armonie-in-movimento-a-gaeta | 2026-11-03 |
| Direzione regionale Musei nazionali Lazio | ufficiale | 1 | https://direzioneregionalemuseilazio.cultura.gov.it/eventi/aperture-straordinarie-del-ponte-real-ferdinando | 2026-11-02 |
| Teatro Città di Fondi «Nino Canale» | organizzatore | 1 | https://teatrocittadifondininocanale.it/cera-una-volta-scugnizzi-il-grande-ritorno-2026 | 2026-11-03 |
| Teatro Gabriele D'Annunzio - Trent'anni di luce | ufficiale | 1 | https://www.teatrodannunziolatina.it/programmazione/stagioni/stagione-teatrale-26-27/trentanni-di-luce-speranza-e-solidarieta | 2026-11-05 |

### Frosinone (FR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Ministero della Cultura | ufficiale | 3 | https://cultura.gov.it/evento/4-novembre-2026-alla-torre-di-cicerone (+2 altre pagine) | 2026-11-03 |
| Il Tacco di Bacco - Eventi a Cassino | aggregatore | 3 | https://iltaccodibacco.it/cassino | 2026-11-04 |
| La Provincia Frosinone | stampa | 1 | https://laprovinciafrosinone.it/2026/11/04/creativita-e-territorio-alatri-si-accende-con-larte-di-esprimersi-luce-propria | 2026-11-04 |
| VisitLazio – Regione Lazio | ufficiale | 1 | https://www.visitlazio.com/eventi-lazio/a-campoli-appennino-la-mostra-campora-di-e-lecce | 2026-11-03 |
| Visit Valle di Comino | aggregatore | 1 | https://visitvalledicomino.com/eventi/39a-festa-del-tartufo-di-campoli-appennino-bianco-e-nero-pregiato | 2026-11-03 |

## Abruzzo

### L'Aquila (AQ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| i-ticket (biglietteria) | aggregatore | 5 | https://www.i-ticket.it/location/teatro-dei-marsi-avezzano | 2026-11-04 |
| SiViaggia | stampa | 4 | https://siviaggia.it/notizie/sagre-feste-abruzzo-novembre-2026/606004 | 2026-11-03 |
| Teatro Stabile d'Abruzzo - Crescere a Teatro 2026/2027 | organizzatore | 2 | https://teatrostabile.abruzzo.it/torna-la-rassegna-del-tsa-crescere-a-teatro-2026-2027 | 2026-11-04 |
| Barattelli Concerti | organizzatore | 1 | https://barattelli.it/home_slides/9319 | 2026-11-04 |
| L'Aquila Congressi - La Città torna a Teatro | organizzatore | 1 | https://www.laquilacongressi.it/evento/visita-teatro-comunale-21-novembre | 2026-11-04 |

### Teramo (TE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Regione Abruzzo - Abruzzo Turismo | ufficiale | 3 | https://www.abruzzoturismo.it/it/eventi/dieci-anni-dal-sisma-2016-2026-dentro-il-restauro-teramo-e-provincia-dellaquila (+1 altre pagine) | 2026-11-03 |
| Comune di Atri | ufficiale | 1 | https://www.comune.atri.te.it/it/news/atri-torna-racconti-dinverno-sei-spettacoli-per-vivere-il-teatro-in-famiglia | 2026-11-04 |

### Pescara (PE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Pescara – FLA 2026 | ufficiale | 8 | https://www.comune.pescara.it/novita/dal-5-all8-novembre-gli-eventi-del-fla-2026-quattro-giorni-per-farsi-nuove-domande | 2026-11-06 |
| Il Pescara - Tutti gli eventi a Pescara | aggregatore | 7 | https://www.ilpescara.it/eventi | 2026-11-04 |
| Visit Città Sant'Angelo - Festival Organistico Internazionale | organizzatore | 6 | https://visitcittasantangelo.it/evento/festival-organistico-internazionale-citta-santangelo-14 (+2 altre pagine) | 2026-11-04 |
| SiViaggia | stampa | 4 | https://siviaggia.it/notizie/sagre-feste-abruzzo-novembre-2026/606004 | 2026-11-03 |
| Regione Abruzzo - Abruzzo Turismo | ufficiale | 1 | https://www.abruzzoturismo.it/it/eventi/will-eisner-art-life-life-comics-pescara | 2026-11-03 |
| Fondazione Pescarabruzzo | ufficiale | 1 | https://fondazionepescarabruzzo.it/will-eisner-al-clap-museum-la-mostra-inaugura-sabato-28-novembre | 2026-11-04 |

### Chieti (CH)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Marrucino - Stagione Concertistica 2026 | ufficiale | 9 | https://www.teatromarrucino.eu/stagione-concertistica-2026 (+2 altre pagine) | 2026-11-04 |
| Teatro Fenaroli Lanciano | ufficiale | 5 | https://www.teatrofenaroli.it/ | 2026-11-04 |
| SiViaggia | stampa | 4 | https://siviaggia.it/notizie/sagre-feste-abruzzo-novembre-2026/606004 | 2026-11-03 |
| Chocofestival Chieti (sito ufficiale) | organizzatore | 1 | https://www.chocofestival.it/ | 2026-11-04 |

## Molise

### Campobasso (CB)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Molisenews24 | stampa | 3 | https://www.molisenews24.it/eventi-molise-3-novembre-2026-140315.html | 2026-11-03 |
| EventiMolise | aggregatore | 1 | https://eventimolise.it/event | 2026-11-03 |
| MACTE (Fondazione MACTE) | ufficiale | 1 | https://www.fondazionemacte.com/it/programma/elisa-giardina-papa-blu-a-occhiu-nuru | 2026-11-03 |
| Molise Network | stampa | 1 | https://www.molisenetwork.net/2026/10/08/gildone-giro-di-san-martino-sapori-musica-tradizione | 2026-11-03 |

### Isernia (IS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| isNews Molise - stagione 2026-2027 dell'Auditorium | stampa | 9 | https://www.isnews.it/2026/10/24/isernia-presentata-la-stagione-2026-2027-dellauditorium-10-settembre-1943 | 2026-11-04 |
| Molisenews24 | stampa | 3 | https://www.molisenews24.it/eventi-molise-3-novembre-2026-140315.html | 2026-11-03 |
| La 'Ndocciata di Agnone (Comune, associazione e Pro Loco) | organizzatore | 2 | https://www.ndocciataagnone.it/2026/11/01/torna-il-mese-del-fuoco-di-agnone-svelate-le-date-2026-della-ndocciata-e-della-festa-dei-fuochi-rituali-2 | 2026-11-04 |

## Campania

### Caserta (CE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Napolike | stampa | 5 | https://www.napolike.it/reggia-di-caserta-visite-guidate-e-trekking-fino-a-dicembre-2026 | 2026-11-03 |
| Ministero della Cultura | ufficiale | 4 | https://cultura.gov.it/evento/anfiteatro-campano-aperture-gratuite-il-10-e-il-4-novembre (+3 altre pagine) | 2026-11-03 |
| Pro Loco Aversa Normanna | aggregatore | 3 | https://prolocoaversa.it/evento/capolavori-in-luce-percorsi-tematici-diagnostici-e-digitali (+1 altre pagine) | 2026-11-04 |
| Teatro Pubblico Campano - Teatro Comunale Parravano | organizzatore | 3 | https://www.teatropubblicocampano.com/teatri/programma-teatro-comunale-costantino-parravano-caserta | 2026-11-04 |
| Itinerari nel Gusto | aggregatore | 2 | https://www.itinerarinelgusto.it/eventi/grape-a-riardo-8636 (+1 altre pagine) | 2026-11-03 |
| Reggia di Caserta | ufficiale | 2 | https://reggiadicaserta.cultura.gov.it/torna-maestri-alla-reggia-con-i-protagonisti-del-cinema-italiano | 2026-11-03 |
| il Tacco di Bacco - Aron Quartet | aggregatore | 1 | https://iltaccodibacco.it/en/campania/eventi/333154.html | 2026-11-04 |

### Benevento (BN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Benevento Centro | aggregatore | 1 | https://www.beneventocentro.it/eventi/come-d-incanto-il-natale-al-castello-di-ceppaloni | 2026-11-03 |
| Benevento Turismo – Comune di Benevento | ufficiale | 1 | https://beneventoturismo.it/incanto-di-natale-ecco-il-cartellone-della-rassegna | 2026-11-03 |
| binews.it | stampa | 1 | https://www.binews.it/attualita/ceppaloni-il-natale-torna-come-dincanto-spettacoli-e-mercatini-tra-il-castello-e-il-borgo | 2026-11-03 |
| Ministero della Cultura | ufficiale | 1 | https://cultura.gov.it/evento/teatro-romano-di-benevento-4-novembre-2026 | 2026-11-03 |
| eCampania | stampa | 1 | https://www.ecampania.it/evento/eventi/512859/santagata-de-goti-si-accende-per-il-natale-torna-sotto-una-buona-stella.html | 2026-11-03 |
| Pro Loco Castelvenere | organizzatore | 1 | https://www.prolococastelvenere.it/2026/10/27/festa-del-novello-castagne-e-grottone-7-8-novembre-2026 | 2026-11-03 |

### Napoli (NA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Trianon Viviani – Programmazione | ufficiale | 25 | https://www.teatrotrianon.org/programmazione | 2026-12-02 |
| Comune di Napoli - Giro Giro Napoli 2026 | ufficiale | 16 | https://www.comune.napoli.it/vivere-il-comune/eventi/giro-giro-napoli-2026 | 2026-11-05 |
| Teatro di San Carlo - calendario spettacoli | ufficiale | 16 | https://www.teatrosancarlo.it/spettacoli (+2 altre pagine) | 2026-11-06 |
| ilbotteghino - concerti in Campania | aggregatore | 13 | https://ilbotteghino.com/concerti-in-campania | 2026-11-06 |
| Ministero della Cultura | ufficiale | 10 | https://cultura.gov.it/evento/4-novembre-al-mann-2026 (+9 altre pagine) | 2026-11-03 |
| Museo e Real Bosco di Capodimonte | ufficiale | 9 | https://capodimonte.cultura.gov.it/dal-30-giugno-al-13-dicembre-2026-il-festival-movimentale-al-museo-e-real-bosco-di-capodimonte (+1 altre pagine) | 2026-11-06 |
| Teatro Augusteo - concerti/eventi 2026/27 | ufficiale | 9 | https://www.teatroaugusteo.it/1/concerti_eventi_2026_27_1363682.html | 2026-11-06 |
| Città della Scienza – Calendario eventi | ufficiale | 8 | https://www.cittadellascienza.it/calendario-eventi (+2 altre pagine) | 2026-11-06 |
| Parco Archeologico di Ercolano - Ministero della Cultura | ufficiale | 6 | https://ercolano.cultura.gov.it/ultimi-sabato-disponibili-prenotazioni-ancora-aperte | 2026-11-05 |
| Teatro Elicantropo | ufficiale | 6 | https://www.teatroelicantropo.com/ | 2026-11-06 |
| Teatro Diana Napoli | ufficiale | 4 | https://teatrodiana.it/ | 2026-11-06 |
| Teatro Politeama - Napoli | ufficiale | 4 | https://www.teatropoliteama.it/ | 2026-11-06 |
| Comune di Forio - Eventi | ufficiale | 3 | https://www.comune.forio.na.it/en-us/vivere-il-comune/eventi (+2 altre pagine) | 2026-11-05 |
| Napoli da Vivere - Concerti d'Autunno al Conservatorio | stampa | 3 | https://www.napolidavivere.it/2026/09/24/concerti-conservatorio-san-pietro-a-majella | 2026-11-06 |
| Calendario Eventi isola d'Ischia | aggregatore | 2 | https://eventi.ischia.it/calendario/eventi | 2026-11-05 |
| Il Taccuino di Bacco - Eventi Mugnano di Napoli e dintorni | aggregatore | 2 | https://iltaccodibacco.it/mugnano-di-napoli | 2026-11-05 |
| Museo Madre Napoli - Gli anni. Capitolo 3 | ufficiale | 2 | https://www.madrenapoli.it/mostre/living-collapse (+1 altre pagine) | 2026-11-06 |
| Nuova Orchestra Scarlatti - eventi | organizzatore | 2 | https://www.nuovaorchestrascarlatti.it/eventi | 2026-11-06 |
| Teatro di Napoli - stagione 2026-2027 | ufficiale | 2 | https://www.teatrodinapoli.it/stagione/stagione-2026-2027 | 2026-11-06 |
| Università Federico II - Notizie | ufficiale | 2 | https://www.unina.it/it/w/corpi-spazi-suoni-luce-il-cinema-di-mario-martone (+1 altre pagine) | 2026-11-06 |
| Arte.it - Arte e Resistenza a Napoli | aggregatore | 1 | https://www.arte.it/calendario-arte/napoli/mostra-arte-e-resistenza-a-napoli-il-percorso-creativo-di-marino-mazzacurati-104479 | 2026-11-06 |
| Comune di Melito di Napoli - Eventi | ufficiale | 1 | https://comune.melito.na.it/vivere-il-comune/eventi | 2026-11-05 |
| eCampania | stampa | 1 | https://www.ecampania.it/news/cultura/519039/mostre-in-campania-novembre-2026-gli-appuntamenti-da-non-perdere.html | 2026-11-03 |
| Ocean Film Festival World Tour Italia - date e biglietti | organizzatore | 1 | https://www.oceanfilmfestivalitalia.it/date-e-biglietti.html | 2026-11-06 |
| Palazzo Reale di Napoli | ufficiale | 1 | https://palazzorealedinapoli.org/evento/casa-corriere-festiaval-2026 | 2026-11-06 |
| Spazio Mosaico - scheda evento | organizzatore | 1 | https://www.spaziomosaico.it/evento/oltre-gli-stereotipi-25-novembre-boscotrecase | 2026-11-04 |

### Avellino (AV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Atripalda - Atripalda Letteraria | ufficiale | 7 | https://www.comune.atripalda.av.it/it/eventi/atripalda-letteraria | 2026-11-04 |
| AvellinoToday | stampa | 2 | https://www.avellinotoday.it/eventi/dal/2026-11-01/al/2026-11-01 | 2026-11-04 |
| Sistema Irpinia – Provincia di Avellino | aggregatore | 2 | https://sistemairpinia.provincia.avellino.it/it/eventi/festa-della-castagna-di-montella-igp-2026 (+1 altre pagine) | 2026-11-03 |
| Agendaonline.it | aggregatore | 1 | https://www.agendaonline.it/teatro-carlo-gesualdo-avellino | 2026-11-04 |
| Concerti Italia | aggregatore | 1 | https://www.concerti-italia.it/concerti/sal-da-vinci-in-concerto-a-avellino-07-novembre-2026-biglietti-e-info | 2026-11-04 |

### Salerno (SA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Battipaglia News (calendario del Comune di Battipaglia) | stampa | 7 | https://www.battipaglianews.it/politica/dal-comune/battipaglia-eventi-di-novembre-stasera-tammorre-senza-frontiere-in-via-italia-e-musica-al-salotto-comunale-il-calendario | 2026-11-04 |
| Salerno Cultura – Comune di Salerno | ufficiale | 4 | https://cultura.comune.salerno.it/eventi/la-vedova-allegra-2026 (+3 altre pagine) | 2026-11-03 |
| Il Tacco di Bacco | aggregatore | 4 | https://iltaccodibacco.it/agropoli | 2026-11-04 |
| eCampania | stampa | 1 | https://www.ecampania.it/evento/eventi/517526/salerno-si-accendono-le-luci-dartista-ecco-le-date.html | 2026-11-03 |
| Il Borghista | aggregatore | 1 | https://www.ilborghista.it/events/49-sagra-della-castagna-e-dei-prodotti-del-sottobosco-2026-associazione-pro-loco-acerno | 2026-11-03 |
| Luci d'Artista (lucidartista.it) | stampa | 1 | https://www.lucidartista.it/salerno-mostra-darte-presepiale-dal-07-novembre-2026-al-10-gennaio-2027.html | 2026-11-03 |

## Puglia

### Foggia (FG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Umberto Giordano - Calendario | ufficiale | 11 | https://www.teatrogiordano.it/calendario.html | 2026-11-04 |
| FoggiaToday | stampa | 6 | https://www.foggiatoday.it/eventi/concerti/foggia-musica-festival-2026-bel-canto-trentennale.html (+1 altre pagine) | 2026-11-05 |
| ManfredoniaEventi - Guida autunno 2026 | aggregatore | 3 | https://www.manfredoniaeventi.com/guide/eventi-a-manfredonia-in-autunno-2026-cosa-fare-tra-ottobre-e-novembre (+1 altre pagine) | 2026-11-05 |
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 3 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali | 2026-11-03 |
| LuceraByNight | stampa | 2 | https://lucerabynight.it/artecultura-aps-un-anno-di-eventi-tra-musica-e-solidarieta | 2026-11-05 |
| Teatro Comunale Saverio Mercadante - Stagione 2026/2027 | ufficiale | 2 | https://www.teatromercadantecerignola.it/ | 2026-11-04 |
| VisitManfredonia - Orari e info | aggregatore | 2 | https://www.visitmanfredonia.com/orari-e-info | 2026-11-05 |
| PlayNews24 (comunicato stampa) | stampa | 1 | https://playnews24.com/2026/11/05/orta-nova-sound-lab-domenica-8-novembre-sfilata-e-concerto-con-la-storica-banda-di-rutigliano | 2026-11-06 |
| RutiglianoOnline (comunicato stampa) | stampa | 1 | https://www.rutiglianoonline.it/notizie/attualita/15491-la-storica-banda-di-rutigliano-protagonista-all-orta-nova-sound-lab.html | 2026-11-06 |

### Bari (BA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fondazione Teatro Petruzzelli | ufficiale | 12 | https://www.fondazionepetruzzelli.it/category/eventi | 2026-11-04 |
| Puglia Culture - Stagione Teatrale di Bari 2026/27 | organizzatore | 12 | https://www.pugliaculture.it/rassegna/bari-umano-collettivo-stagione-teatrale-2026-27 (+1 altre pagine) | 2026-11-04 |
| Il Tacco di Bacco | aggregatore | 10 | https://iltaccodibacco.it/altamura (+5 altre pagine) | 2026-11-05 |
| MolfettaLive - Torna a Molfetta il Festival Viator | stampa | 10 | https://molfettalive.it/2026/11/02/torna-a-molfetta-il-festival-viator | 2026-11-05 |
| Teatro Palatour Frecciarossa - Stagione 2026/27 | ufficiale | 6 | https://palatour.it/ | 2026-11-04 |
| Amici della Musica di Monopoli - Stagione concertistica | organizzatore | 4 | https://www.amicimusicamonopoli.com/brochure | 2026-11-05 |
| CoratoLive - Senti che Murgia Memoriae | stampa | 3 | https://coratolive.it/2026/11/02/senti-che-murgia-memoriae-a-corato-prende-il-via-la-rassegna-dedicata-alla-civilta-contadina-e-alle-tradizioni-locali | 2026-11-04 |
| SiViaggia | stampa | 2 | https://siviaggia.it/notizie/sagre-feste-puglia-novembre-2026/606020 | 2026-11-03 |
| Visit Mola di Bari - Festival Internazionale Casa van Westerhout | ufficiale | 2 | https://www.visitmoladibari.it/evento/festival-internazionale-casa-van-westerhout-tour-guidati | 2026-11-05 |
| Comune di Bitonto - Stagione teatrale 2026/2027 | ufficiale | 1 | https://www.comune.bitonto.ba.it/it/eventi/stagione-teatrale-2026-2027-732873 | 2026-11-04 |
| Comune di Casamassima - Homepage | ufficiale | 1 | https://www.comune.casamassima.ba.it/ | 2026-11-04 |
| Palazzo Fontana - Eventi | aggregatore | 1 | https://palazzofontana.it/eventi | 2026-11-05 |
| TEDx - pagina dell'evento | organizzatore | 1 | https://www.ted.com/tedx/events/67474 | 2026-11-04 |
| WeMeet - Sagra del Cardoncello | aggregatore | 1 | https://www.weroad.it/wemeet/eventi/gravina-in-puglia/sagra-del-cardoncello-394d381e-f8c6-4434-8237-156e4023f43b | 2026-11-05 |

### Taranto (TA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Il Tacco di Bacco - Laterza | aggregatore | 5 | https://iltaccodibacco.it/puglia/eventi/333186.html | 2026-11-05 |
| MArTA - Museo Archeologico Nazionale di Taranto | ufficiale | 4 | https://museotaranto.cultura.gov.it/it/eventi/visite-guidate-novembre | 2026-11-04 |
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 4 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali (+1 altre pagine) | 2026-11-05 |
| Comune di Martina Franca - Armonie di Natale 2026 | ufficiale | 3 | https://www.comune.martinafranca.ta.it/Vivere-il-comune/Eventi/ARMONIE-DI-NATALE-2026 | 2026-11-05 |
| DettagliDiGrottaglie | stampa | 1 | https://www.dettaglidigrottaglie.it/blog/2026/08/30/pianofestival | 2026-11-05 |
| Il Ragazzo della Via Gluck - scheda della data di Martina Franca | aggregatore | 1 | https://ilragazzodellaviagluck.com/eventi/martina-franca-teatro-nuovo-2026-11-22.html | 2026-11-05 |

### Brindisi (BR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Brindisi – stagione 2026-27 del Nuovo Teatro Verdi | ufficiale | 5 | https://www.comune.brindisi.it/novita/nuovo-teatro-verdi-presentata-la-stagione-2026-27-una-costellazione-di-storie | 2026-11-04 |
| il Tacco di Bacco | aggregatore | 5 | https://iltaccodibacco.it/ostuni (+1 altre pagine) | 2026-11-06 |
| Fondazione Nuovo Teatro Verdi – programma stagione 2026-2027 | organizzatore | 4 | https://www.nuovoteatroverdi.com/programma-stagione-artistica-2026-2027 | 2026-11-03 |
| Comune di Francavilla Fontana - Stagione teatrale 2026/27 | ufficiale | 2 | https://www.comune.francavillafontana.br.it/Novita/Notizie/Il-programma-della-stagione-teatrale-2026-27-a-Teatro-Italia | 2026-11-05 |
| Comune di Francavilla Fontana - App ufficiale (eventi) | ufficiale | 2 | https://francavillafontana.comune.digital/eventi/c/0 | 2026-11-05 |
| Idea Radio nel Mondo | stampa | 1 | https://www.idearadionelmondo.it/2026/11/04/oria-biblioteca-de-pace-lombardi-eventi-novembre-2026/?amp=1 | 2026-11-06 |
| VisitLatiano - Novembre 2026 | organizzatore | 1 | https://www.visitlatiano.it/2026/11 | 2026-11-05 |

### Lecce (LE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Politeama Greco | ufficiale | 5 | https://www.politeamagreco.it/programmazione.asp | 2026-11-04 |
| Mercatino del Gusto - San Martino e la Luce 2026 | organizzatore | 3 | https://www.mercatinodelgusto.it/ | 2026-11-05 |
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 3 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali | 2026-11-03 |
| SiViaggia | stampa | 2 | https://siviaggia.it/notizie/sagre-feste-puglia-novembre-2026/606020 | 2026-11-03 |
| LeccéSette - Festival di Santa Cecilia | stampa | 1 | https://www.leccesette.it/news/226886061574/festival-di-santa-cecilia-il-22-novembre-2026-a-lecce | 2026-11-05 |
| Provincia di Lecce | ufficiale | 1 | https://www.provincia.le.it/san-martino-in-piazza-a-palazzo-adorno-la-presentazione-della-sagra-culturale-in-programma-a-monteroni-di-lecce | 2026-11-05 |
| Salento Sagre ed Eventi | aggregatore | 1 | https://salentosagreeventi.it/events/san-martino-in-piazza-monteroni-di-lecce-2026 | 2026-11-05 |
| WeMeet - Passeggiata sotto le stelle cadenti (Comune di Nardò) | aggregatore | 1 | https://www.weroad.it/wemeet/eventi/comune-di-nardo/passeggiata-sotto-le-stelle-cadenti-alla-palude-del-capitano-1c60abab-2451-475d-9691-927394a4f90e | 2026-11-05 |

### Barletta-Andria-Trani (BT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| il Tacco di Bacco | aggregatore | 5 | https://iltaccodibacco.it/barletta | 2026-11-04 |
| Festival Pianistico Internazionale del Mediterraneo | organizzatore | 3 | https://www.pianofestivalmediterraneo.com/edizione-2026 | 2026-11-04 |
| Spazio Duende - Eventi | organizzatore | 3 | https://spazioduende.it/eventi/elenco | 2026-11-04 |
| Cultura.gov.it - 4 novembre 2026 al Museo Archeologico di Canosa | ufficiale | 1 | https://cultura.gov.it/evento/4-novembre-2026-al-museo-nazionale-archeologico-di-canosa | 2026-11-04 |

## Basilicata

### Potenza (PZ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Città delle 100 scale festival (programma 2026) | organizzatore | 8 | https://www.cittacentoscale.it/ita/programma-2026 (+1 altre pagine) | 2026-11-03 |
| Clappit (biglietteria) | aggregatore | 1 | https://www.clappit.com/biglietti/massima-potenza-iii-15-novembre-2026-palasport-avigliano-avigliano-40298.html | 2026-11-04 |
| Il Borghista | aggregatore | 1 | https://www.ilborghista.it/events/sagra-della-strazzata-festival-dei-grani-antichi | 2026-11-04 |

### Matera (MT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Arte Basilicata – Eventi in Basilicata (calendario) | aggregatore | 3 | https://artebasilicata.it/eventi | 2026-11-03 |
| Fondazione Matera Basilicata 2019 | organizzatore | 1 | https://www.matera-basilicata2019.it/2026/10/05/matera-2026-weekend-tra-arte-mediterraneo-e-dialogo | 2026-11-04 |
| Presepe Vivente nei Sassi di Matera | organizzatore | 1 | https://www.presepematera.it/ | 2026-11-04 |
| Telenorba - Mediterranean Playground | stampa | 1 | https://telenorba.it/2026/11/05/alla-scoperta-dei-giochi-antichi-con-il-mediterranean-playground-dal-6-all8-novembre-a-matera | 2026-11-05 |

## Calabria

### Cosenza (CS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria - Rassegna L'Altro Teatro | ufficiale | 5 | https://calabriastraordinaria.it/eventi/rassegna-laltro-teatro-teatro-rendano (+2 altre pagine) | 2026-11-04 |
| Comune di Cosenza - Eventi | ufficiale | 5 | https://www.comune.cosenza.it/it/eventi/stagione-concertistica-internazionale-autunno-musicale-6 (+4 altre pagine) | 2026-11-04 |

### Catanzaro (CZ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fondazione Politeama Catanzaro | organizzatore | 6 | https://www.politeamacatanzaro.net/ | 2026-11-04 |
| Calabria Straordinaria (Regione Calabria) | ufficiale | 4 | https://calabriastraordinaria.it/eventi/lardito-rosso (+3 altre pagine) | 2026-11-03 |

### Reggio Calabria (RC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria | ufficiale | 6 | https://calabriastraordinaria.it/eventi/i-treni-del-torrone (+1 altre pagine) | 2026-11-04 |
| CiVediamoInCalabria - Cilea Opera Festival 2026 | aggregatore | 3 | https://www.civediamoincalabria.it/eventi/cilea-opera-festival-2026-a-reggio-calabria-dal-museo-dei-bronzi-al-teatro-cilea | 2026-11-04 |
| Il Calabria Jblasa - Eventi in Calabria | aggregatore | 2 | https://calabria.jblasa.com/calabria/eventi-in-calabria | 2026-11-05 |
| Comune di Locri - Eventi | ufficiale | 2 | https://locri.comune.digital/eventi | 2026-11-05 |
| CityNow - L'eleganza dell'Arte al Teatro Cilea | stampa | 1 | https://www.citynow.it/eleganza-arte-cartellone-teatro-cilea | 2026-11-04 |
| Ministero della Cultura | ufficiale | 1 | https://cultura.gov.it/evento/Mercoled%C3%AC%204%20novembre%20-%20ingresso%20gratuito%20al%20MArRC | 2026-11-03 |

### Crotone (KR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria - Teatro Scaramuzza | ufficiale | 14 | https://calabriastraordinaria.it/eventi/stagione-teatrale-teatro-vincenzo-scaramuzza | 2026-11-04 |

### Vibo Valentia (VV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria - Stagione Teatrale del Teatro Comunale di Vibo Valentia | ufficiale | 10 | https://calabriastraordinaria.it/eventi/stagione-teatrale-vibo-valentia (+1 altre pagine) | 2026-11-04 |

## Sicilia

### Trapani (TP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 59 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 (+2 altre pagine) | 2026-11-04 |
| Comune di Marsala - Eventi | ufficiale | 5 | https://www.comune.marsala.tp.it/it/eventi/fratelli-mancuso (+4 altre pagine) | 2026-11-05 |
| Castellammare del Golfo in vacanza - Eventi a novembre 2026 | aggregatore | 1 | https://castellammaredelgolfoinvacanza.it/blog/eventi-a-castellammare-del-golfo-novembre | 2026-11-04 |
| Prima Pagina Castelvetrano | stampa | 1 | https://www.primapaginacastelvetrano.it/torna-a-castelvetrano-la-celebrazione-della-festa-dellimmacolata | 2026-11-04 |

### Palermo (PA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 55 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 | 2026-11-04 |
| Teatro Massimo di Palermo | ufficiale | 6 | https://www.teatromassimo.it/ | 2026-11-04 |
| Teatro Biondo Palermo | ufficiale | 5 | https://teatrobiondo.it/calendario | 2026-11-04 |
| Portale del Turismo - Comune di Palermo | ufficiale | 3 | https://turismo.comune.palermo.it/palermo-welcome-accade-a-palermo-dettaglio.php?id=2117 (+1 altre pagine) | 2026-11-06 |
| Visit Sicily – Regione Siciliana | ufficiale | 2 | https://www.visitsicily.info/evento-new/sfincione-fest-2026 (+1 altre pagine) | 2026-11-03 |
| Comune di Bagheria | ufficiale | 1 | https://www.comune.bagheria.pa.it/it/eventi | 2026-11-04 |
| Sfincione Fest | organizzatore | 1 | https://sfincionefest.it/ | 2026-11-03 |
| Sherbeth Festival | organizzatore | 1 | https://sherbeth.it/ | 2026-11-03 |

### Messina (ME)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 4 | https://www.balarm.it/tutti-gli-eventi-a-messina-e-provincia-di-novembre-2026 | 2026-11-04 |
| Comune di Milazzo - presentazione della decima edizione | ufficiale | 1 | https://www.milazzoincomune.it/2026/11/04/presentata-la-decima-edizione-della-san-martino-fest-una-festa-di-comunita-nel-segno-della-solidarieta | 2026-11-05 |

### Agrigento (AG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Il Mediterraneo 24 | stampa | 4 | https://www.ilmediterraneo24.it/cultura/sambuca-al-teatro-lidea-la-nuova-stagione-da-fo-e-pirandello-allinclusione-di-educolab | 2026-11-04 |
| AnyTicket - biglietteria del Teatro Pirandello | organizzatore | 2 | https://www.anyticket.it/anyticketprod/Default.aspx?partner=PIRA | 2026-11-04 |
| Canzoni.it - Concerti Canicattì | aggregatore | 1 | https://www.canzoni.it/concerti/italia/agrigento/canicatti | 2026-11-04 |
| Fondazione Teatro Pirandello | ufficiale | 1 | https://fondazioneteatropirandello.it/2026/05/teatro-pirandello-ecco-la-nuova-stagione-2026-2027 | 2026-11-04 |

### Caltanissetta (CL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comunia - Stagione Teatrale 2026-2027 Teatro Antidoto | aggregatore | 2 | https://comuniaitalia.it/event/stagione-teatrale-2026-2027-teatro-antidoto-a-gela | 2026-11-05 |
| Caltanissetta Informa | stampa | 1 | https://www.caltanissettainforma.it/caltanissetta-torna-la-stagione-delle-fiabe-quattro-appuntamenti-a-teatro-per-bambini-e-famiglie | 2026-11-04 |
| Comune di Caltanissetta | ufficiale | 1 | https://www.comune.caltanissetta.it/it/news/teatro-regina-margherita-presentata-la-stagione-teatrale-nazionale-2026-27 | 2026-11-04 |
| DalVivo | aggregatore | 1 | https://www.dalvivo.media/eventi/la-stagione-teatrale-nazionale-2026-2027-caltanissetta | 2026-11-04 |
| Il Borghista - Sagra della Guastedda a Mussomeli | aggregatore | 1 | https://www.ilborghista.it/events/sagra-della-guastedda-mussomeli-cl | 2026-11-05 |

### Enna (EN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| AENNA - portale turistico del Comune di Enna | ufficiale | 3 | https://aenna.it/eventi-in-citta/?lang=it (+1 altre pagine) | 2026-11-04 |
| Balarm - eventi ad Enna dicembre 2026 | aggregatore | 1 | https://www.balarm.it/tutti-gli-eventi-ad-enna-e-provincia-di-dicembre-2026 | 2026-11-05 |
| Hello Agira | aggregatore | 1 | https://helloagira.it/it/sagra-cassatella | 2026-11-04 |
| SagraMap | aggregatore | 1 | https://sagramap.com/sicilia/enna | 2026-11-04 |

### Catania (CT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 55 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 | 2026-11-04 |
| Sposipersempre.it - SposinLove 2026 Misterbianco | aggregatore | 1 | https://www.sposipersempre.it/fiere-sposi/fiere-sposi-sicilia/sposinlove-misterbianco-catania.html | 2026-11-05 |
| Teatro Massimo Bellini di Catania | ufficiale | 1 | https://www.teatromassimobellini.it/eventi/la-bella-addormentata-2026 | 2026-11-04 |
| Visit Sicily (portale regionale di eventi) | aggregatore | 1 | https://www.visitsicily.info/evento-new/magie-barocche-2026 | 2026-11-03 |
| VivaSicilia - Festa dell’Immacolata Grammichele | aggregatore | 1 | https://www.vivasicilia.com/festa-dell-immacolata-grammichele | 2026-11-05 |

### Ragusa (RG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 59 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 (+1 altre pagine) | 2026-11-04 |
| Antica Ibla - Centro commerciale naturale | aggregatore | 1 | https://www.ccnanticaibla.com/eventi/categoria/in-programma | 2026-11-04 |
| Comune di Ragusa | ufficiale | 1 | https://www.comune.ragusa.it/it/eventi | 2026-11-04 |

### Siracusa (SR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| PCM Pubblicità - programma Autunno d'Arte (manifesto del Comune) | stampa | 8 | https://www.pcmpubblicita.com/lavori/autunno-darte-augusta-2026-programma-eventi | 2026-11-04 |
| Teatro Massimo Città di Siracusa | organizzatore | 3 | https://www.teatromassimosiracusa.it/stagione-teatrale-2026-27 | 2026-11-04 |
| Balarm.it | aggregatore | 1 | https://www.balarm.it/tutti-gli-eventi-a-siracusa-e-provincia-di-novembre-2026 | 2026-11-04 |
| Fondazione FS – Treno del Barocco (8 dicembre 2026) | organizzatore | 1 | https://www.fondazionefs.it/en/itineraries/2026/12/8/treno-del-barocco.html | 2026-11-03 |

## Sardegna

### Sassari (SS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Turismo Sassari – Calendario eventi | ufficiale | 4 | https://turismosassari.it/calendario-eventi (+3 altre pagine) | 2026-11-04 |
| Alghero Turismo - calendario eventi | ufficiale | 1 | https://algheroturismo.eu/eventi-alghero | 2026-11-04 |

### Gallura Nord-Est Sardegna (OT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Olbia Città del Natale (Comune di Olbia) | ufficiale | 3 | https://olbiacittadelnatale.it/ | 2026-11-04 |
| Consorzio di Portorotondo | stampa | 2 | https://consorziodiportorotondo.it/evento/natale-ad-olbia | 2026-11-04 |
| Salude & Trigu | aggregatore | 2 | https://saludetrigu.it/ | 2026-11-04 |

### Nuoro (NU)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Sardegna Turismo – Regione Sardegna | ufficiale | 4 | https://www.sardegnaturismo.it/eventi (+2 altre pagine) | 2026-11-04 |
| SiViaggia | stampa | 3 | https://siviaggia.it/notizie/sagre-feste-sardegna-novembre-2026/606022 | 2026-11-03 |

### Oristano (OR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Oristano Turismo - eventi | aggregatore | 3 | https://www.oristanoinfo.it/eventi-oristano | 2026-11-04 |
| SiViaggia | stampa | 3 | https://siviaggia.it/notizie/sagre-feste-sardegna-novembre-2026/606022 | 2026-11-03 |

### Ogliastra (OG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Paradisola | aggregatore | 2 | https://www.paradisola.it/eventi-sardegna/calendario | 2026-11-04 |
| Spettacolisardegna | aggregatore | 1 | https://www.spettacolisardegna.it/events/castagne-e-vino-nuovo-lanusei-6-8-novembre | 2026-11-04 |

### Medio Campidano (VS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Sanluri | ufficiale | 2 | https://www.comune.sanluri.su.it/novita/teatro-akinu-congia-stagione-cedac-2026-27 | 2026-11-04 |
| Paradisola | aggregatore | 2 | https://www.paradisola.it/eventi-sardegna/calendario | 2026-11-04 |

### Cagliari (CA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Lirico di Cagliari - Rigoletto | organizzatore | 7 | https://www.liricocagliari.it/evento/rigoletto | 2026-11-04 |
| Cagliari FestivalScienza – Eventi in programma 2026 | organizzatore | 1 | https://festivalscienzacagliari.it/festivalscienza/2026-eventi-in-programma | 2026-11-03 |

### Sulcis Iglesiente (CI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Carbonia Turismo – Comune di Carbonia | ufficiale | 3 | https://carboniaturismo.it/it/events/mese | 2026-11-04 |
| Sardegna Turismo – Regione Sardegna | ufficiale | 2 | https://www.sardegnaturismo.it/eventi | 2026-11-04 |

## Instagram e Facebook

169 fonti sono post di Instagram o Facebook, letti dal controllo automatico (`ricerca/instagram-account.json`, `scripts/controlla-instagram.mjs`). Si trovano in `ricerca/fonti.json`. Non si riaprono a mano: non accedere mai con l'account personale.

## Pagine che non si sono lette

Provate dagli agenti e non utilizzabili. Non riprovare con gli stessi strumenti: cerca una fonte alternativa (Comune, Pro Loco, teatro, portale turistico) o aspetta che il sito cambi. Gli errori `bot_blocked`, `login_required` e le pagine «vuote» sono quasi sempre siti che caricano il contenuto con JavaScript o bloccano i robot.

### vuota (14)

- https://www.aristongaeta.it/
- https://www.ateneomusicabasilicata.it/
- https://camec.sp.it/mostre-ed-eventi/eventi-al-camec
- https://www.comune.campobellodilicata.ag.it/it/eventi
- https://cultura.comune.parma.it/
- https://fondazionevillanovafranca.it/strade-dello-zafferano-2026-a-villanovafranca-aperte-le-adesioni-per-l8-novembre
- https://www.fuoriquadro.net/
- https://www.indafondazione.org/calendario-2026
- https://www.ragusawelcome.com/it/eventi-ed-esperienze/calendario-eventi
- https://www.siciliaspettacoli.it/eventi-novembre-2026
- https://teatrogalli.it/
- https://www.umbriaeventi.com/
- https://www.visitasondrio.it/eventi
- https://www.visitmolise.eu/eventi

### errore:bot_blocked (11)

- https://www.lanuovariviera.it/category/eventi
- https://www.liveticket.it/teatrolidea
- https://rivieradeifiori.travel/eventi
- https://rivieradeifiori.travel/events
- https://www.sangavinomonreale.net/2026/10/31/loro-rosso-apre-le-porte-di-villanovafranca-l8-novembre-inizia-il-festival-le-strade-dello-zafferano-di-sardegna-dop
- https://www.teatro.it/spettacoli/teramo/comunale/biglietti
- https://www.teatro.it/teatri/carlo-gesualdo-avellino-cartellone
- https://www.teatroallascala.org/it/stagione/2026-2027/calendario.html
- https://www.ticketone.it/event/lettera-ad-eduardo-di-massimiliano-gallo-teatro-carlo-gesualdo-22132246
- https://www.ticketone.it/event/sei-personaggi-in-cerca-dautore-teatro-ariston-21626793
- https://www.visitarezzo.com/it/notizie-eventi-arezzo

### errore:target_http_error (6)

- https://www.comune.grosseto.it/notizia/grosseto-ricorda-lalluvione-del-1966-mostre-fotografie-e-testimonianze-per-il-60-anniversario
- https://comune.minturno.lt.it/novita
- https://www.iblamagiadelnatale.it/
- https://scontent-sjc3-1.cdninstagram.com/placeholder-per-test
- https://www.virgilio.it/italia/potenza/eventi/mese/novembre
- https://www.virgilio.it/italia/teramo/eventi/mese/dicembre

### errore:proxy_error (4)

- https://www.comune.bari.it/-/umano-collettivo-presentata-la-stagione-teatrale-di-bari-2026/27-al-teatro-piccinni-il-nuovo-cartellone-tra-grandi-ritorni-talenti-pugliesi-e-nuove-visioni
- https://www.comune.modena.it/vivere-modena/eventi/2026/stagione-2026-concerti-doggi-e-festival-dautunno
- https://comune.viterbo.it/vivi-viterbo-2026
- https://eventi.comune.torino.it/calendario/?data_da=2026-11-04

### errore:target_unreachable (3)

- https://www.ohbejohbej.it/
- https://orchestrasinfonicasiciliana.it/it/attivita/stagione
- https://www.teatrocurci.it/

### errore:invalid_url (1)

- https://rdap.nic.it/domain/livelocal.it

### errore:page_not_found (1)

- https://rdap.verisign.com/com/v1/domain/livelocal.eu

### errore:empty_content (1)

- https://scontent-sjc3-1.cdninstagram.com/v/t51.82787-15/867127526_18103064687647731_5887217326824062461_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=9QSna3obqIAQ7kNvwEmQL7G&_nc_oc=AdpmhmvZDoGa4kvJy5DixJDn4j6HIsJsJuvG-OTyMlDXyRbTImAaaOssfpTly_lMFhg&_nc_zt=23&_nc_ht=scontent-sjc3-1.cdninstagram.com&edm=AL-3X8kEAAAA&_nc_gid=bc4iPGnAw0YmAQ1-zL_HaA&oh=00_AQTsA73Xi4Wdy5ZnEA0c4UAGqIjihCjvPfouqmGZeJRLEA&oe=6AF00002

### errore:timeout (1)

- https://www.visitbergamo.net/eventi

## Pagine aperte che non hanno dato eventi

132 pagine sono state lette ma non hanno prodotto eventi (data o luogo mancanti, già passati, già presenti, fuori zona). Elenco in `ricerca/fonti.json` (`eventi: 0`, `esito: letta`): utile per non riaprirle inutilmente.
