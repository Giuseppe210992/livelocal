# Fonti consultate

File generato da `scripts/fonti.mjs`: non modificarlo a mano. I dati grezzi sono in `ricerca/fonti.json` (una riga per pagina) e `ricerca/fonti-consultate.json` (pagine aperte e ricerche fatte).

Aggiornato il 2026-11-04. **446 pagine di 311 siti** hanno dato eventi; 61 fonti sono post di Instagram o Facebook; 44 pagine non si sono lette (bloccate, vuote o errore); 366 ricerche già fatte.

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
| Diocesi di Torino (calendario) | stampa | 4 | https://www.diocesi.torino.it/site/wd-appuntamenti/alpignano-cera-una-svolta-festival-sulle-svolte-storiche-dellumanita-7 (+1 altre pagine) | 2026-11-04 |
| Gallerie d'Italia Torino | ufficiale | 2 | https://www.gallerieditalia.com/it/torino/mostre-e-iniziative | 2026-11-03 |
| Teatro Magnetto - Camaleontika 2026 | organizzatore | 2 | https://www.teatromagnetto.it/event/camaleontika-2026/2026-05-23 | 2026-11-04 |

### Vercelli (VC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ATL Terre dell'Alto Piemonte - Eventi Valsesia e Vercellese | ufficiale | 6 | https://visitvalsesiavercelli.it/partecipa/eventi-e-news/i-prossimi-eventi | 2026-11-03 |

### Novara (NO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ARONAnelWEB | stampa | 7 | https://www.aronanelweb.it/evento/rassegna-cai-arona-i-ritmi-della-montagna-con-max-cassani (+2 altre pagine) | 2026-11-04 |
| ATL Novara - Calendario eventi | ufficiale | 4 | https://www.turismonovara.it/it/eventimanifestazioni | 2026-11-03 |

### Cuneo (CN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Cuneo Cultura (portale del Comune di Cuneo) | ufficiale | 4 | https://www.cuneocultura.it/eventi/calendario | 2026-11-03 |
| Comune di Cuneo - Eventi | ufficiale | 1 | https://www.comune.cuneo.it/vivere-il-comune/eventi | 2026-11-03 |
| Fiera Internazionale del Tartufo Bianco d'Alba - Altri eventi | organizzatore | 1 | https://www.fieradeltartufo.org/categorie-eventi/altri-eventi | 2026-11-03 |
| Langhe.net | aggregatore | 1 | https://langhe.net/evento/mercato-mondiale-tartufo-bianco-alba-15-11-26 | 2026-11-04 |
| Visit Piemonte | ufficiale | 1 | https://www.visitpiemonte.com/en/events/fiera-internazionale-del-tartufo-bianco-dalba-96th-edition | 2026-11-03 |

### Asti (AT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Alfieri Asti | ufficiale | 5 | https://www.teatroalfieriasti.it/events/elenco | 2026-11-04 |
| La Nuova Provincia | stampa | 1 | https://www.lanuovaprovincia.it/news/cultura-e-spettacoli/505561/palazzo-mazzetti-alla-scoperta-dell-art-nouveau-con-alphonse-mucha.html | 2026-11-04 |
| Il Magico Paese di Natale | organizzatore | 1 | https://www.magicopaesedinatale.com/mercatino-di-asti | 2026-11-04 |
| Paesaggi Vitivinicoli UNESCO Piemonte | aggregatore | 1 | https://www.paesaggivitivinicoliunesco.it/it/eventi/il-natale-in-via-principe-agliano-terme | 2026-11-04 |
| Visit Langhe Monferrato Roero | ufficiale | 1 | https://www.visitlmr.it/it/eventi/calendario-eventi/generici/monferrato/mostra-alphonse-mucha-palazzo-mazzetti-asti | 2026-11-04 |

### Alessandria (AL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Alessandrino | ufficiale | 7 | https://www.teatroalessandrino.it/eventi-ospiti | 2026-11-04 |
| Radio Gold | stampa | 2 | https://radiogold.it/news-alessandria/eventi/450222-fiera-san-baudolino-2026-programma-alessandria-cibo-vino-tartufi-gusto | 2026-11-04 |
| Visit Alessandria | ufficiale | 2 | https://visitalessandria.it/eventi-alessandria | 2026-11-04 |
| Alexala | ufficiale | 1 | https://www.alexala.it/it/eventi/fiera-di-san-martino/f52cbbb5c006ea6612aa2d41e2b5bca1?idb=04bacino213dc8760b2e84fef4 | 2026-11-04 |

### Biella (BI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ATL Biella - Eventi nel Biellese | ufficiale | 5 | https://www.atl.biella.it/stampa-eventi?p_p_id=mkspconfigurable_WAR_suggestomkspportlet&p_p_lifecycle=2&p_p_resource_id=html | 2026-11-03 |

### Verbano-Cusio-Ossola (VB)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Stresa Turismo (Pro Loco / Comune di Stresa) | ufficiale | 3 | https://www.stresaturismo.it/it/eventi | 2026-11-04 |
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
| in-Lombardia (Regione Lombardia) | ufficiale | 2 | https://www.in-lombardia.it/evento/novembre-2026-i-principali-eventi-provincia-di-varese | 2026-11-04 |
| Museo MA*GA | ufficiale | 2 | https://www.museomaga.it/ | 2026-11-03 |
| Fondazione Marcello Morandini | organizzatore | 1 | https://www.fondazionemarcellomorandini.com/fondazione-marcello-morandini-eventi/sintonie-stagione-concertistica-2026 | 2026-11-04 |
| Frontaliere Ticino | stampa | 1 | https://frontaliereticino.ch/articoli-frontaliere/mostre-maga-gallarate-2026 | 2026-11-03 |
| Teatro di Varese | organizzatore | 1 | https://www.teatrodivarese.com/ | 2026-11-04 |
| VareseNews | stampa | 1 | https://www.varesenews.it/2026/11/musica-memoria-e-solidarieta-ad-albizzate-il-concerto-note-di-angelo/2727334 | 2026-11-04 |

### Como (CO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Sociale di Como | ufficiale | 8 | https://teatrosocialecomo.it/calendario | 2026-11-04 |
| Città dei Balocchi Lake Como | organizzatore | 2 | https://www.cittadeibalocchi.it/ | 2026-11-04 |
| Comune di Como | ufficiale | 2 | https://www.comune.como.it/vivere-il-comune/eventi/Morazzone-a-Como-00001 (+1 altre pagine) | 2026-11-04 |
| Visit Alta Valle Intelvi | ufficiale | 1 | https://www.visitaltavalleintelvi.com/eventi-alta-valle-intelvi | 2026-11-04 |

### Sondrio (SO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Consorzio Turistico Sondrio e Valmalenco | ufficiale | 6 | https://eventi.sondrioevalmalenco.it/ (+5 altre pagine) | 2026-11-04 |

### Milano (MI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Museo del Novecento - Comune di Milano | ufficiale | 13 | https://www.museodelnovecento.org/it/eventi | 2026-11-04 |
| Piccolo Teatro di Milano - Prossimi spettacoli | ufficiale | 11 | https://www.piccoloteatro.org/it/pages/prossimi-spettacoli | 2026-11-04 |
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Triennale Milano - Voce Triennale | ufficiale | 7 | https://triennale.org/voce-triennale | 2026-11-04 |
| Palazzo Reale Milano - Mostre 2026 | ufficiale | 5 | https://www.palazzorealemilano.it/mostre-in-programma/mostre-2026 | 2026-11-04 |
| MUDEC - Mostre in corso | ufficiale | 3 | https://www.mudec.it/mostre-in-corso-2 (+1 altre pagine) | 2026-11-04 |
| Comune di Baranzate | ufficiale | 1 | https://www.comune.baranzate.mi.it/it/news/celebrazione-giorno-dell-unita-nazionale-e-giornata-delle-forze-armate-domenica-8-novembre-2026 | 2026-11-04 |
| EventiDiZona | aggregatore | 1 | https://www.eventidizona.it/cosa-fare/arese | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/antica-fiera-di-san-martino-2026-0 | 2026-11-03 |
| Mercati di Milano | aggregatore | 1 | https://mercatidimilano.com/mercatini-di-natale/oh-bej-oh-bej | 2026-11-04 |
| Palazzo Arese Borromeo | organizzatore | 1 | https://palazzoareseborromeo.it/evento | 2026-11-04 |

### Bergamo (BG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Donizetti Opera Festival - Calendario | ufficiale | 12 | https://www.donizettiopera.org/it | 2026-11-04 |
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| SanMartinoEvents Festa 2026 | organizzatore | 6 | https://www.sanmartinoevents.it/ | 2026-11-04 |
| Comune di Albino | ufficiale | 5 | https://www.comune.albino.bg.it/it/eventi/romanzo-di-dio (+4 altre pagine) | 2026-11-04 |
| Fondazione Bernareggi - Eventi e mostre | organizzatore | 5 | https://fondazionebernareggi.it/eventi-mostre | 2026-11-04 |
| BergamoNews - Fiera di San Martino | stampa | 2 | https://www.bergamonews.it/evento/fiera-di-san-martino-ad-alzano-le-date-delledizione-2026 | 2026-11-04 |
| Eco di Bergamo - Eventi | stampa | 2 | https://www.ecodibergamo.it/eventi/eppen/dettaglio/manifestazioni/almenno-san-bartolomeo/almenno-divino_306356 | 2026-11-04 |
| Comune di Almenno San Bartolomeo | ufficiale | 1 | https://www.comune.almennosanbartolomeo.bergamo.it/eventi-data?data=11-11-2026 | 2026-11-04 |
| Comune di Alzano Lombardo - Eventi | ufficiale | 1 | https://www.comune.alzano.bg.it/vivere-il-comune/eventi | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/festival-donizetti-opera-2026 | 2026-11-03 |
| Oriente Day - Programma Alzano Lombardo | organizzatore | 1 | https://orienteday.com/programma-bergamo-alzano-lombardo-28-29-novembre-2026 | 2026-11-04 |

### Brescia (BS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Grande di Brescia - Calendario | ufficiale | 14 | https://teatrogrande.it/it/calendario | 2026-11-04 |
| Comune di Adro | ufficiale | 4 | https://www.comune.adro.bs.it/vivere-il-comune/eventi/calici-di-poesia (+3 altre pagine) | 2026-11-04 |
| Comune di Bedizzole - Eventi | ufficiale | 4 | https://www.comune.bedizzole.bs.it/area_letturaEvento/11510/pagsistema.html (+3 altre pagine) | 2026-11-04 |
| Dovesagrare (dati Regione Lombardia, sagre e fiere su area pubblica) | aggregatore | 1 | https://www.dovesagrare.it/evento/alfianello/aspettando-il-natale-2026-alfianello-2026-12-08-open-lombardia-sagre-26449 | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/24a-rassegna-della-microeditoria-italiana | 2026-11-03 |

### Pavia (PV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| in-Lombardia / VisitPavia (Regione Lombardia) | ufficiale | 4 | https://www.in-lombardia.it/evento/pavia-festival-2026 | 2026-11-04 |

### Cremona (CR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 1 | https://www.in-lombardia.it/evento/festa-del-torrone-2026 | 2026-11-03 |
| Cremona Musei - Mostre ed eventi | ufficiale | 1 | https://musei.comune.cremona.it/it/mostre-ed-eventi | 2026-11-03 |
| Teatro Ponchielli - Calendario | ufficiale | 1 | https://www.teatroponchielli.it/calendario-eventi | 2026-11-04 |

### Mantova (MN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Sociale di Mantova - Spettacoli | ufficiale | 15 | https://www.teatrosocialemantova.it/it-it/spettacoli.aspx | 2026-11-04 |
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Comune di Asola - Eventi | ufficiale | 5 | https://www.comune.asola.mn.it/vivere-il-comune/eventi/san-francesco-800-anni-dalla-morte-1226-2026 (+3 altre pagine) | 2026-11-04 |
| in-Lombardia (turismo della Regione Lombardia) | ufficiale | 2 | https://www.in-lombardia.it/evento/mantova-jazz-2026 (+1 altre pagine) | 2026-11-03 |
| Centro Palazzo Te | organizzatore | 1 | https://www.centropalazzote.it/inventare-la-natura-leonardo-arcimboldo-caravaggio | 2026-11-03 |

### Lecco (LC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| LeccoToday | stampa | 4 | https://www.leccotoday.it/attualita/novembre-mostre-musei-2026.html | 2026-11-04 |
| SiMUL - Sistema museale urbano lecchese | ufficiale | 1 | https://simulecco.it/iniziative-culturali | 2026-11-03 |

### Lodi (LO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Lodi | ufficiale | 2 | https://www.comune.lodi.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/1080 | 2026-11-04 |
| VisitLodi (Regione Lombardia) | ufficiale | 1 | https://www.visitlodi.it/it/evento/fiera-di-codogno-2026 | 2026-11-04 |

### Monza e della Brianza (MB)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MilanoToday | stampa | 9 | https://www.milanotoday.it/social/segnalazioni/mercatini-natale-lombardia-calendario-novembre-2026.html | 2026-11-04 |
| Comune di Arcore | ufficiale | 8 | https://comune.arcore.mb.it/vivere-il-comune/evento/cera-una-volta-pinocchio (+3 altre pagine) | 2026-11-04 |
| Comune di Bernareggio - Eventi | ufficiale | 4 | https://www.comune.bernareggio.mb.it/it/events/alpini-15-anniversario-gruppo-alpini-bernareggio (+1 altre pagine) | 2026-11-04 |
| Reggia di Monza | organizzatore | 3 | https://reggiadimonza.it/cosa-accade | 2026-11-04 |
| Comune di Monza | ufficiale | 2 | https://www.comune.monza.it/it/categorie-eventi/79791 | 2026-11-04 |

## Trentino-Alto Adige

### Bolzano (BZ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Associazione Turistica Appiano | ufficiale | 3 | https://www.eppan.com/it/eventi/feste-ad-appiano/appuntamenti-ad-appiano/kulturkontakt-eppan | 2026-11-04 |
| Museion, sito ufficiale | ufficiale | 2 | https://www.museion.it/it | 2026-11-04 |
| alto-adige.com | aggregatore | 1 | https://www.alto-adige.com/evento/581/mercatino-di-natale-a-san-michele-appiano | 2026-11-04 |
| Italia.it (portale ufficiale ENIT) | ufficiale | 1 | https://www.italia.it/en/south-tyrol/bressanone/things-to-do/event-christmas-markets-bressanone | 2026-11-03 |
| Merano - Alto Adige (portale turistico ufficiale) | ufficiale | 1 | https://www.merano-suedtirol.it/it/merano/informazioni-servizi/eventi/mercatini-di-natale-merano.html | 2026-11-03 |
| Mercatini di Natale Alto Adige | aggregatore | 1 | https://www.mercatini-di-natale.bz.it/alto-adige/merano | 2026-11-03 |
| Mercatino di Natale Bolzano (sito ufficiale) | organizzatore | 1 | https://www.mercatinodinatalebz.it/ | 2026-11-03 |
| suedtirol.info | ufficiale | 1 | https://www.suedtirol.info/it/it/esperienze-eventi/eventi-alto-adige/pdp-evento.C381A455A8694108B060F9D33E469DBD.sagra-di-san-martino.appiano-sulla-strada-del-vino | 2026-11-04 |

### Trento (TN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Mart, mostre ed eventi | ufficiale | 7 | https://www.mart.tn.it/mostre-eventi | 2026-11-04 |
| Comune di Aldeno | ufficiale | 2 | https://www.comune.aldeno.tn.it/Vivere-il-comune/Eventi/Festa-del-Ringraziamento-Aldeno (+1 altre pagine) | 2026-11-04 |
| Mercatino di Natale di Arco | organizzatore | 1 | https://www.mercatininatalearco.com/it | 2026-11-04 |
| Trento Città del Natale | ufficiale | 1 | https://natale.visittrento.it/mercatino | 2026-11-03 |
| Visit Rovereto e Vallagarina | ufficiale | 1 | https://www.visitrovereto.it/vivi/eventi/mercatino-di-natale-ala | 2026-11-04 |

## Veneto

### Verona (VR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Fondazione Arena di Verona - Teatro Filarmonico | organizzatore | 2 | https://www.arena.it/teatro-filarmonico-verona/spettacoli | 2026-11-03 |
| Arte.it - Calendario mostre Verona | aggregatore | 1 | https://arte.it/calendario-arte/verona/2026/11/12 | 2026-11-03 |
| Verona Run Marathon (sito ufficiale) | organizzatore | 1 | https://www.veronarunmarathon.it/ | 2026-11-03 |

### Vicenza (VI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Comunale Città di Vicenza, calendario | ufficiale | 15 | https://www.tcvi.it/it/eventi/calendario-eventi | 2026-11-04 |
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| InArzignano (portale del Comune) | ufficiale | 4 | https://www.inarzignano.it/2026/11/mondovisioni2026 (+1 altre pagine) | 2026-11-04 |
| Comune di Altavilla Vicentina | ufficiale | 1 | https://comune.altavillavicentina.vi.it/novita/cerimonia-4-novembre-2026-festa-dellunita-nazionale-110-anniversario-della-vittoria-della-guerra | 2026-11-04 |
| VIVA - Eventi Vicenza (Comune di Vicenza) | ufficiale | 1 | https://eventi.comune.vicenza.it/Eventi/Mostra-Italia-Germania.-Pittura-e-scultura-tra-Ottocento-e-Novecento.-Da-Canova-a-Kiefer | 2026-11-03 |
| Musei Biblioteca Archivio di Bassano del Grappa | ufficiale | 1 | https://www.museibassano.it/it/eventi | 2026-11-04 |

### Belluno (BL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Feltre | ufficiale | 3 | https://visitfeltre.info/categoriaevento/programma-eventi-estivi-a-feltre | 2026-11-04 |
| Comune di Alpago | ufficiale | 1 | https://www.comune.alpago.bl.it/ | 2026-11-04 |
| Visit Dolomiti Bellunesi - Calendario eventi | aggregatore | 1 | https://www.visitdolomitibellunesi.com/it/eventi/concerto-omaggioa-dino-buzzati | 2026-11-04 |

### Treviso (TV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Musei Civici Treviso | ufficiale | 1 | https://www.museicivicitreviso.it/mostre-ed-eventi/la-materia-dei-sogni-radici-dellarte-africana-contemporanea | 2026-11-03 |

### Venezia (VE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro La Fenice, calendario | ufficiale | 9 | https://www.teatrolafenice.it/en/whats-on | 2026-11-04 |
| Arte Laguna Prize (organizzatore) | organizzatore | 1 | https://artelagunaprize.com/exhibition-2026 | 2026-11-03 |
| MUVE, Agenda Contemporanea 2026 | ufficiale | 1 | https://www.visitmuve.it/evento/agenda-contemporanea | 2026-11-04 |

### Padova (PD)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Tecnogas Auditorium Albignasego | organizzatore | 7 | https://www.auditoriumalbignasego.it/eventi | 2026-11-04 |
| Casa al Carmine - Mostre in Veneto 2026-2027 | aggregatore | 5 | https://www.casaalcarmine.it/it/2026/09/29/mostre-veneto-autunno-inverno-2026-2027 | 2026-11-03 |
| Museo Villa Bassi Rathgeb | organizzatore | 5 | https://www.museovillabassiabano.it/eventi-in-corso (+1 altre pagine) | 2026-11-04 |
| Teatro Pietro d'Abano | organizzatore | 5 | https://teatropietrodabano.it/en/eventi-teatro | 2026-11-04 |
| Arte.it - Mostre Padova novembre 2026 | aggregatore | 1 | https://www.arte.it/calendario-arte/padova/2026/11 | 2026-11-03 |
| Palazzo Zabarella | organizzatore | 1 | https://www.zabarella.it/ | 2026-11-03 |

### Rovigo (RO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Badia Polesine | ufficiale | 5 | https://www.comune.badiapolesine.ro.it/eventi | 2026-11-04 |
| Palazzo Roverella | organizzatore | 1 | https://www.palazzoroverella.com/man-ray-il-maestro-del-surrealismo | 2026-11-03 |

## Friuli-Venezia Giulia

### Udine (UD)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Nuovo Giovanni da Udine | organizzatore | 4 | https://www.teatroudine.it/ | 2026-11-04 |
| Grado.it - Eventi ed escursioni (Consorzio Grado Turismo) | aggregatore | 1 | https://grado.it/it/eventi-ed-escursioni | 2026-11-04 |
| SiViaggia | stampa | 1 | https://siviaggia.it/notizie/sagre-feste-friuli-venezia-giulia-novembre-2026/606010 | 2026-11-03 |

### Gorizia (GO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Let's Go Gorizia (Comune di Gorizia) | ufficiale | 1 | https://letsgo.gorizia.it/eventi | 2026-11-04 |
| Teatro Comunale di Monfalcone | ufficiale | 1 | https://www.teatromonfalcone.it/al-via-la-stagione-2026-2027 | 2026-11-04 |

### Trieste (TS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Verdi di Trieste, sito ufficiale | ufficiale | 9 | https://www.teatroverdi-trieste.com/it | 2026-11-04 |
| Turismo FVG - Eventi | ufficiale | 3 | https://www.turismofvg.it/it/mare/eventi | 2026-11-03 |
| Castello di Miramare, eventi | ufficiale | 2 | https://miramare.cultura.gov.it/eventi | 2026-11-04 |

### Pordenone (PN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Verdi Pordenone - biglietteria online | organizzatore | 6 | https://teatroverdipordenone.ticka.it/ | 2026-11-04 |
| Instart - programmazione 2026/27 del Teatro Verdi | stampa | 5 | https://www.instart.info/teatro-verdi-di-pordenone-presenta-la-programmazione-2026-2027 | 2026-11-04 |
| SagraMap | aggregatore | 2 | https://sagramap.com/friuli-venezia-giulia/pordenone (+1 altre pagine) | 2026-11-04 |
| PromoTurismoFVG (elenco eventi nei borghi) | ufficiale | 1 | https://www.turismofvg.it/it/borghi-storici/eventi-nei-borghi | 2026-11-04 |

## Liguria

### Imperia (IM)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Sanremonews | stampa | 11 | https://www.sanremonews.it/2026/11/02/leggi-notizia/argomenti/agenda-manifestazioni/articolo/tutti-gli-appuntamenti-e-manifestazioni-da-lunedi-2-a-domenica-8-novembre-2026-in-riviera-e-cote.html | 2026-11-04 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 1 | https://lamialiguria.it/eventi/olioliva-imperia | 2026-11-03 |

### Savona (SV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Scopri Albenga - calendario eventi | aggregatore | 26 | https://www.scoprialbenga.it/eventi.htm | 2026-11-04 |
| Teatro Chiabrera | ufficiale | 6 | https://teatrochiabrera.it/artistica-2026-27 | 2026-11-03 |
| Visit Savona - Il Teatro Chiabrera dà il via alla Stagione 2026/27 | ufficiale | 6 | https://www.visitsavona.com/it/il-teatro-chiabrera-da-il-via-alla-stagione-2026-27 | 2026-11-03 |
| Museo dell'Arte Vetraria Altarese | organizzatore | 1 | https://www.museodelvetro.org/ | 2026-11-04 |

### Genova (GE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Palazzo Ducale Genova - calendario mostre e eventi | organizzatore | 11 | https://palazzoducale.genova.it/calendario-eventi | 2026-11-04 |
| Cronache Ponentine | stampa | 2 | https://www.cronacheponentine.com/calendario-eventi | 2026-11-04 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 2 | https://lamialiguria.it/eventi/tartufando-a-genova (+1 altre pagine) | 2026-11-03 |

### La Spezia (SP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Civico La Spezia | ufficiale | 6 | https://teatrocivico.it/calendario_stagione_teatrale | 2026-11-04 |
| Gazzetta della Spezia (comunicato del Comune di Sarzana) | stampa | 4 | https://gazzettadellaspezia.com/cultura/182740-al-ridotto-del-teatro-impavidi-torna-domeniche-in-musica-quattro-concerti-da-novembre | 2026-11-04 |
| La Mia Liguria (agenzia regionale «in Liguria») | ufficiale | 1 | https://lamialiguria.it/eventi/festa-di-san-martino-a-biassa-della-spezia | 2026-11-03 |

## Emilia-Romagna

### Piacenza (PC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Piacenza - Eventi | ufficiale | 3 | https://www.comune.piacenza.it/it/eventi | 2026-11-03 |
| Comune di Alta Val Tidone | ufficiale | 1 | https://www.comune.altavaltidone.pc.it/it/eventi/festa-dei-mugnai-mulino-borgo-lentino-edizione-2026 | 2026-11-04 |

### Parma (PR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Parma Welcome (portale turistico di Parma) | aggregatore | 2 | https://parmawelcome.it/mostre-parma (+1 altre pagine) | 2026-11-04 |
| Palazzo Tarasconi (sede della mostra) | organizzatore | 1 | https://palazzotarasconi.it/mostra/caravaggio-e-la-luce-del-seicento-11-novembre-2026-28-marzo-2027 | 2026-11-04 |
| Turismo Valtaro e Valceno - calendario eventi | aggregatore | 1 | https://www.turismovaltaro.it/calendario-eventi | 2026-11-04 |

### Reggio nell'Emilia (RE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Reggio Emilia Welcome - Novembre 2026 (IAT-R, Comune) | ufficiale | 7 | https://www.reggioemiliawelcome.it/it/eventi/calendari-mensili/novembre-2026 | 2026-11-03 |

### Modena (MO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Comunale Modena Pavarotti-Freni | ufficiale | 4 | https://www.teatrocomunalemodena.it/danza (+1 altre pagine) | 2026-11-04 |
| Gioventù Musicale d'Italia, sede di Modena – calendario concerti | organizzatore | 2 | https://gmimodena.it/calendario-dei-concerti | 2026-11-04 |

### Bologna (BO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Cultura Bologna - Calendario (Comune di Bologna) | ufficiale | 5 | https://www.culturabologna.it/calendar | 2026-11-03 |

### Ferrara (FE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Valli di Argenta - Ecomuseo | organizzatore | 6 | https://www.vallidiargenta.org/eventi | 2026-11-04 |
| InFerrara - Agenda eventi (Comune di Ferrara) | ufficiale | 5 | https://www.inferrara.it/agenda-eventi | 2026-11-04 |
| Spettacolo in Emilia-Romagna - Teatro Comunale Ferrara, Opera & Danza 2026/27 | ufficiale | 2 | https://spettacolo.emiliaromagnacultura.it/it/rassegna/teatro-comunale-ferrara-opera-danza-2026-2027 | 2026-11-04 |
| Palazzo dei Diamanti - Fondazione Ferrara Arte | organizzatore | 1 | https://www.palazzodiamanti.it/mostre/da-monet-a-van-gogh-a-kandinsky | 2026-11-03 |

### Ravenna (RA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Bagnacavallo Cultura | ufficiale | 4 | https://bagnacavallocultura.it/il-programma | 2026-11-04 |
| Comune di Ravenna - Eventi | ufficiale | 2 | https://comune.ravenna.it/vivere-il-comune/eventi/mostra | 2026-11-03 |
| Vivi Romagna | aggregatore | 2 | https://www.viviromagna.it/bagnacavallo | 2026-11-04 |

### Forlì-Cesena (FC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| ERT - Teatro Bonci, stagione 2026/27 | organizzatore | 6 | https://cesena.emiliaromagnateatro.com/la-stagione-2026-2027 | 2026-11-04 |
| Spettacolo in Emilia-Romagna - Teatro Diego Fabbri di Forlì, stagione 2026/27 | ufficiale | 6 | https://spettacolo.emiliaromagnacultura.it/it/rassegna/teatro-diego-fabbri-di-forli-stagione-2026-27 | 2026-11-04 |
| Visit Bertinoro - Festa di Santa Caterina 2026 | ufficiale | 5 | https://www.visitbertinoro.it/it/eventi/festa-di-santa-caterina-2026 | 2026-11-04 |
| Emilia Romagna Turismo (Regione Emilia-Romagna) | ufficiale | 1 | https://emiliaromagnaturismo.it/it/eventi/civitella-romagna-cusercoli-sagra-tartufo-bianco-pregiato-bidente | 2026-11-03 |

### Rimini (RN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Vivaticket - 77ª Sagra Musicale Malatestiana | aggregatore | 5 | https://www.vivaticket.com/it/tour/sagra-musicale-malatestiana/4276 | 2026-11-04 |
| Fellini Museum - Eventi e News | organizzatore | 3 | https://fellinimuseum.it/news-eventi | 2026-11-04 |
| Comune di Bellaria Igea Marina - Eventi | ufficiale | 2 | https://www.comune.bellaria-igea-marina.rn.it/it/events/wonder-walks-christmas (+1 altre pagine) | 2026-11-04 |
| Comune di Rimini | ufficiale | 2 | https://www.comune.rimini.it/novita/notizie/dal-2-al-27-novembre-torna-il-festival-del-mondo-antico | 2026-11-03 |
| Visit Rimini - Events | ufficiale | 1 | https://www.visitrimini.com/en/events | 2026-11-04 |

## Toscana

### Massa-Carrara (MS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Lunigiana World - Calendario eventi | aggregatore | 4 | https://www.lunigianaworld.it/calendario-eventi | 2026-11-04 |
| Teatro Guglielmi (Comune di Massa) - Spettacoli | ufficiale | 4 | https://www.teatroguglielmi.it/spettacoli | 2026-11-04 |

### Lucca (LU)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Turismo Lucca – Comune di Lucca | ufficiale | 14 | https://turismo.lucca.it/eventi-lucca | 2026-11-03 |
| Tempo Libero Toscana | aggregatore | 2 | https://www.tempoliberotoscana.it/eventcategory/lucca-versilia | 2026-11-03 |
| dovealucca.it | aggregatore | 1 | https://www.dovealucca.it/eventi-lucca/10170-barga-in-cioccolato-2026 | 2026-11-04 |
| e-borghi.com | aggregatore | 1 | https://www.e-borghi.com/eventi/barga/barga-in-cioccolato-2026 | 2026-11-04 |

### Pistoia (PT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Pistoia - Eventi | ufficiale | 6 | https://www.visitpistoia.eu/eventi | 2026-11-04 |
| Comune di Pistoia – Eventi | ufficiale | 2 | https://www.comune.pistoia.it/it/eventi/80633/la-periferia-dell-anima-volti-e-ferite (+1 altre pagine) | 2026-11-04 |

### Firenze (FI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Fiesole - Fiesole for You, Eventi | ufficiale | 21 | https://www.fiesoleforyou.it/eventi | 2026-11-04 |
| Fondazione Palazzo Strozzi | ufficiale | 1 | https://www.palazzostrozzi.org/mostre-future | 2026-11-03 |

### Livorno (LI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fondazione Teatro Goldoni - Programma 2026/2027 | organizzatore | 6 | https://www.goldoniteatro.it/spettacoli | 2026-11-04 |
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/livorno-grosseto | 2026-11-03 |

### Pisa (PI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro di Pisa - Teatro Verdi, stagione 2026-2027 | ufficiale | 7 | https://teatrodipisa.it/ | 2026-11-04 |
| Comune di Pisa - Turismo, Eventi | ufficiale | 7 | https://www.turismo.pisa.it/eventi/index.html | 2026-11-04 |
| Visit Tuscany (portale turistico della Toscana) | ufficiale | 1 | https://www.visittuscany.com/en/events/white-truffle-exhibition-san-miniato | 2026-11-03 |

### Arezzo (AR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/siena-arezzo | 2026-11-03 |
| Mercatini di Natale Arezzo - Villaggio Tirolese | organizzatore | 3 | https://mercatininatalearezzo.it/villaggio-tirolese | 2026-11-04 |
| Comune di Arezzo - Teatro Petrarca, stagione 2026/2027 | ufficiale | 2 | https://www.comune.arezzo.it/novita/teatro-petrarca-stagione-teatrale-20262027 | 2026-11-04 |
| Discover Arezzo – Stagione Teatro Petrarca | aggregatore | 1 | https://www.discoverarezzo.com/eventi/stagione-teatro-petrarca-26-27 | 2026-11-04 |
| Fondazione Guido d'Arezzo – Stagione di prosa 2026/2027 | organizzatore | 1 | https://www.fondazioneguidodarezzo.com/stagione-di-prosa-2026-2027 | 2026-11-04 |
| Venti Lucenti - Schiaccianoci 2026 | organizzatore | 1 | https://www.ventilucenti.it/evento-spettacolo/schiaccianoci-2026-petrarca | 2026-11-04 |

### Siena (SI)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Siena – Siena Incanta | ufficiale | 15 | https://www.comune.siena.it/novita/siena-incanta-si-accende-il-natale-siena-eventi-spettacoli-e-mostre-internazionali-le | 2026-11-03 |
| Tempo Libero Toscana | aggregatore | 4 | https://www.tempoliberotoscana.it/eventcategory/siena-arezzo | 2026-11-03 |
| Italia.it | ufficiale | 1 | https://www.italia.it/it/toscana/siena/cosa-fare/evento-fiaccole-di-natale-abbadia-san-salvatore | 2026-11-04 |

### Grosseto (GR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Tuttomaremma - Eventi di novembre | aggregatore | 11 | https://www.tuttomaremma.com/eventinovembre.htm | 2026-11-04 |
| Parco della Maremma - Parco aperto, gli eventi di novembre | ufficiale | 3 | https://parco-maremma.it/parco-aperto-gli-eventi-di-novembre | 2026-11-04 |
| Fondazione Grosseto Cultura | ufficiale | 1 | https://www.fondazionegrossetocultura.it/index.php/alle-clarisse-una-mostra-fotografica-per-ricordare-lalluvione-di-grosseto-del-1966 | 2026-11-04 |
| Ufficio Turistico di Massa Marittima | ufficiale | 1 | https://www.turismomassamarittima.it/07-08-11-26-29-edizione-di-sapori-dautunno-tatti | 2026-11-04 |

### Prato (PO)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Prato - Cartellone Eventi | ufficiale | 4 | https://tempolibero.comune.prato.it/ | 2026-11-04 |

## Umbria

### Perugia (PG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Stabile dell'Umbria - calendario spettacoli | organizzatore | 26 | https://teatrostabile.umbria.it/calendario (+1 altre pagine) | 2026-11-04 |
| Assisi Eventi | aggregatore | 4 | https://www.assisieventi.it/ | 2026-11-04 |
| bastia.it (Novembre: un mese di cultura e non solo per Bastia) | stampa | 4 | https://www.bastia.it/novembre-un-mese-di-cultura-e-non-solo-per-bastia | 2026-11-04 |
| Eurochocolate (organizzatore) | organizzatore | 1 | https://www.eurochocolate.com/perugia2026 | 2026-11-03 |
| Umbria24 | stampa | 1 | https://www.umbria24.it/gusto24/ventanni-di-festivol-trevi-ancora-tra-olio-nuovo-arte-musica-e-papille | 2026-11-03 |

### Terni (TR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Stabile dell'Umbria - calendario spettacoli | organizzatore | 25 | https://teatrostabile.umbria.it/calendario | 2026-11-04 |
| Vivi Terni – Comune di Terni | ufficiale | 6 | https://turismo.comune.terni.it/eventi | 2026-11-03 |

## Marche

### Pesaro e Urbino (PU)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Programma 61a Fiera del Tartufo Bianco di Acqualagna | organizzatore | 12 | https://acqualagna.com/programma | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 2 | https://letsmarche.it/-/tatuaggi.-storie-dal-mediterraneo (+1 altre pagine) | 2026-11-03 |
| Teatri di Pesaro - prosa 2026.27 | organizzatore | 2 | https://www.teatridipesaro.it/categoria/prosa2026-27 | 2026-11-04 |

### Ancona (AN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Ancona - Eventi | ufficiale | 6 | https://www.comune.ancona.it/it/eventi | 2026-11-04 |
| Marche Teatro - Stagione 2026-27 di Ancona Prosa-Danza | organizzatore | 5 | https://www.marcheteatro.it/stagione-2026-27-di-ancona-prosa-danza | 2026-11-04 |
| Non solo eventi Marche | aggregatore | 5 | https://www.nonsoloeventimarche.it/eventi-per-provincia.php?id=ancona&page=5 | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 1 | https://letsmarche.it/-/castelli-di-jesi-nel-bicchiere-1 | 2026-11-03 |

### Macerata (MC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Macerata - Teatro Lauro Rossi, stagione 2026/2027 | ufficiale | 4 | https://www.comune.macerata.it/vivere-il-comune/eventi/teatro-lauro-rossi-stagione-2026-2027 | 2026-11-04 |
| Comune di Recanati - Teatro Persiani, stagione 2026/27 | ufficiale | 3 | https://www.comune.recanati.mc.it/it/news/il-teatro-persiani-presenta-la-stagione-2026-27 | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 2 | https://letsmarche.it/-/expositio-mundi-la-mostra-come-medium (+1 altre pagine) | 2026-11-04 |
| AMAT - Platea delle Marche | organizzatore | 1 | https://www.amatmarche.net/ | 2026-11-04 |

### Ascoli Piceno (AP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Ascoli Piceno – Calendario eventi | ufficiale | 6 | https://www.comune.ap.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/151/UT/systemPrint | 2026-11-04 |
| Non solo eventi Marche | aggregatore | 1 | https://www.nonsoloeventimarche.it/eventi-per-provincia.php?id=ascoli-piceno | 2026-11-03 |

### Fermo (FM)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Visit Fermo - Stagione teatrale 2026/27 | ufficiale | 9 | https://www.visitfermo.it/it/stagione-teatrale-2026-27 | 2026-11-04 |
| Turismo Marche (Regione Marche) | ufficiale | 1 | https://letsmarche.it/-/diamanti-a-tavola-festival-del-tartufo-bianco-pregiato-di-amandola-2026 | 2026-11-03 |

## Lazio

### Viterbo (VT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
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
| CastellInforma | aggregatore | 6 | https://www.castellinforma.it/home/?st=town&ts=Ariccia | 2026-11-04 |
| Festival Liszt Albano | organizzatore | 4 | https://festivalisztalbano.it/ | 2026-11-04 |
| Mondoreale | stampa | 4 | https://www.mondoreale.it/2026/10/anzio-nasce-anzio-che-legge-cinque-incontri-con-gli-autori-tra-ottobre-e-dicembre | 2026-11-04 |
| Palazzo Esposizioni Roma | organizzatore | 4 | https://www.palazzoesposizioniroma.it/ | 2026-11-03 |
| TrovaSagre | aggregatore | 1 | https://trovasagre.com/en/evento/festival-del-gusto-albano-laziale-rm-2026 | 2026-11-04 |

### Latina (LT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fattivivo | aggregatore | 5 | https://www.fattivivo.com/eventi/liberi-di-scegliere-stagione-teatrale-2026-2027-teatro-dannunzio | 2026-11-03 |
| Telegolfo | stampa | 4 | https://www.telegolfo.com/minturno-camminata-tra-gli-olivi-7-8-novembre-2026 (+2 altre pagine) | 2026-11-02 |
| Ministero della Cultura | ufficiale | 3 | https://cultura.gov.it/evento/4-novembre-2026-giorno-dellunita-nazionale-e-giornata-delle-forze-armate-museo-archeologico-nazionale-di-formia (+2 altre pagine) | 2026-11-03 |
| Lazio Eventi | aggregatore | 2 | https://lazioeventi.com/eventi/calici-a-corte (+1 altre pagine) | 2026-11-03 |
| Scopri Formia | aggregatore | 2 | https://scopriformia.it/en/guide/eventi-formia-2026-11 | 2026-11-03 |
| VisitLazio – Regione Lazio | ufficiale | 2 | https://www.visitlazio.com/eventi-lazio/armonie-in-movimento-a-gaeta | 2026-11-03 |
| Direzione regionale Musei nazionali Lazio | ufficiale | 1 | https://direzioneregionalemuseilazio.cultura.gov.it/eventi/aperture-straordinarie-del-ponte-real-ferdinando | 2026-11-02 |
| Teatro Città di Fondi «Nino Canale» | organizzatore | 1 | https://teatrocittadifondininocanale.it/cera-una-volta-scugnizzi-il-grande-ritorno-2026 | 2026-11-03 |

### Frosinone (FR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Ministero della Cultura | ufficiale | 3 | https://cultura.gov.it/evento/4-novembre-2026-alla-torre-di-cicerone (+2 altre pagine) | 2026-11-03 |
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
| Il Pescara - Tutti gli eventi a Pescara | aggregatore | 7 | https://www.ilpescara.it/eventi | 2026-11-04 |
| SiViaggia | stampa | 4 | https://siviaggia.it/notizie/sagre-feste-abruzzo-novembre-2026/606004 | 2026-11-03 |
| Regione Abruzzo - Abruzzo Turismo | ufficiale | 1 | https://www.abruzzoturismo.it/it/eventi/will-eisner-art-life-life-comics-pescara | 2026-11-03 |
| Fondazione Pescarabruzzo | ufficiale | 1 | https://fondazionepescarabruzzo.it/will-eisner-al-clap-museum-la-mostra-inaugura-sabato-28-novembre | 2026-11-04 |

### Chieti (CH)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Marrucino - Stagione Concertistica 2026 | ufficiale | 7 | https://www.teatromarrucino.eu/stagione-concertistica-2026 (+1 altre pagine) | 2026-11-04 |
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
| Itinerari nel Gusto | aggregatore | 2 | https://www.itinerarinelgusto.it/eventi/grape-a-riardo-8636 (+1 altre pagine) | 2026-11-03 |
| Reggia di Caserta | ufficiale | 2 | https://reggiadicaserta.cultura.gov.it/torna-maestri-alla-reggia-con-i-protagonisti-del-cinema-italiano | 2026-11-03 |

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
| Ministero della Cultura | ufficiale | 10 | https://cultura.gov.it/evento/4-novembre-al-mann-2026 (+9 altre pagine) | 2026-11-03 |
| eCampania | stampa | 1 | https://www.ecampania.it/news/cultura/519039/mostre-in-campania-novembre-2026-gli-appuntamenti-da-non-perdere.html | 2026-11-03 |

### Avellino (AV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Atripalda - Atripalda Letteraria | ufficiale | 7 | https://www.comune.atripalda.av.it/it/eventi/atripalda-letteraria | 2026-11-04 |
| Agendaonline.it | aggregatore | 2 | https://www.agendaonline.it/teatro-carlo-gesualdo-avellino | 2026-11-04 |
| AvellinoToday | stampa | 2 | https://www.avellinotoday.it/eventi/dal/2026-11-01/al/2026-11-01 | 2026-11-04 |
| Sistema Irpinia – Provincia di Avellino | aggregatore | 2 | https://sistemairpinia.provincia.avellino.it/it/eventi/festa-della-castagna-di-montella-igp-2026 (+1 altre pagine) | 2026-11-03 |
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
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 3 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali | 2026-11-03 |
| Teatro Comunale Saverio Mercadante - Stagione 2026/2027 | ufficiale | 2 | https://www.teatromercadantecerignola.it/ | 2026-11-04 |

### Bari (BA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Fondazione Teatro Petruzzelli | ufficiale | 12 | https://www.fondazionepetruzzelli.it/category/eventi | 2026-11-04 |
| Puglia Culture - Stagione Teatrale di Bari 2026/27 | organizzatore | 9 | https://www.pugliaculture.it/rassegna/bari-umano-collettivo-stagione-teatrale-2026-27 | 2026-11-04 |
| Il Tacco di Bacco | aggregatore | 5 | https://iltaccodibacco.it/altamura (+1 altre pagine) | 2026-11-04 |
| SiViaggia | stampa | 3 | https://siviaggia.it/notizie/sagre-feste-puglia-novembre-2026/606020 | 2026-11-03 |
| TEDx - pagina dell'evento | organizzatore | 1 | https://www.ted.com/tedx/events/67474 | 2026-11-04 |

### Taranto (TA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| MArTA - Museo Archeologico Nazionale di Taranto | ufficiale | 4 | https://museotaranto.cultura.gov.it/it/eventi/visite-guidate-novembre | 2026-11-04 |
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 3 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali | 2026-11-03 |

### Brindisi (BR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Brindisi – stagione 2026-27 del Nuovo Teatro Verdi | ufficiale | 4 | https://www.comune.brindisi.it/novita/nuovo-teatro-verdi-presentata-la-stagione-2026-27-una-costellazione-di-storie | 2026-11-03 |
| Fondazione Nuovo Teatro Verdi – programma stagione 2026-2027 | organizzatore | 4 | https://www.nuovoteatroverdi.com/programma-stagione-artistica-2026-2027 | 2026-11-03 |

### Lecce (LE)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Teatro Politeama Greco | ufficiale | 5 | https://www.politeamagreco.it/programmazione.asp | 2026-11-04 |
| Puglia Culture – Foggia, Taranto e Lecce: al via tre nuove stagioni teatrali comunali | organizzatore | 3 | https://www.pugliaculture.it/aree-di-intervento/circuito-e-stagioni-teatrali/foggia-taranto-e-lecce-al-via-tre-nuove-stagioni-teatrali-comunali | 2026-11-03 |
| SiViaggia | stampa | 3 | https://siviaggia.it/notizie/sagre-feste-puglia-novembre-2026/606020 | 2026-11-03 |

### Barletta-Andria-Trani (BT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| il Tacco di Bacco | aggregatore | 5 | https://iltaccodibacco.it/barletta | 2026-11-04 |
| Festival Pianistico Internazionale del Mediterraneo | organizzatore | 3 | https://www.pianofestivalmediterraneo.com/edizione-2026 | 2026-11-04 |
| Spazio Duende - Eventi | organizzatore | 3 | https://spazioduende.it/eventi/elenco | 2026-11-04 |

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

## Calabria

### Cosenza (CS)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria - Rassegna L'Altro Teatro | ufficiale | 5 | https://calabriastraordinaria.it/eventi/rassegna-laltro-teatro-teatro-rendano (+2 altre pagine) | 2026-11-04 |
| Comune di Cosenza - nuova stagione del Teatro Rendano | ufficiale | 1 | https://www.comune.cosenza.it/it/novita/page/teatro-rendano-presentata-la-nuova-stagione-2026-2027 | 2026-11-04 |

### Catanzaro (CZ)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria (Regione Calabria) | ufficiale | 4 | https://calabriastraordinaria.it/eventi/lardito-rosso (+3 altre pagine) | 2026-11-03 |

### Reggio Calabria (RC)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria | ufficiale | 6 | https://calabriastraordinaria.it/eventi/i-treni-del-torrone (+1 altre pagine) | 2026-11-04 |
| CiVediamoInCalabria - Cilea Opera Festival 2026 | aggregatore | 3 | https://www.civediamoincalabria.it/eventi/cilea-opera-festival-2026-a-reggio-calabria-dal-museo-dei-bronzi-al-teatro-cilea | 2026-11-04 |
| CityNow - L'eleganza dell'Arte al Teatro Cilea | stampa | 1 | https://www.citynow.it/eleganza-arte-cartellone-teatro-cilea | 2026-11-04 |
| Ministero della Cultura | ufficiale | 1 | https://cultura.gov.it/evento/Mercoled%C3%AC%204%20novembre%20-%20ingresso%20gratuito%20al%20MArRC | 2026-11-03 |

### Crotone (KR)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria (Regione Calabria) | ufficiale | 6 | https://calabriastraordinaria.it/eventi/stagione-teatrale-teatro-vincenzo-scaramuzza | 2026-11-04 |

### Vibo Valentia (VV)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Calabria Straordinaria - Stagione Teatrale del Teatro Comunale di Vibo Valentia | ufficiale | 10 | https://calabriastraordinaria.it/eventi/stagione-teatrale-vibo-valentia (+1 altre pagine) | 2026-11-04 |

## Sicilia

### Trapani (TP)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 56 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 (+1 altre pagine) | 2026-11-04 |
| Comune di Marsala | ufficiale | 1 | https://www.comune.marsala.tp.it/it/eventi/fratelli-mancuso | 2026-11-04 |

### Palermo (PA)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 55 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 | 2026-11-04 |
| Teatro Massimo di Palermo | ufficiale | 6 | https://www.teatromassimo.it/ | 2026-11-04 |
| Teatro Biondo Palermo | ufficiale | 5 | https://teatrobiondo.it/calendario | 2026-11-04 |
| Portale del Turismo - Comune di Palermo | ufficiale | 2 | https://turismo.comune.palermo.it/palermo-welcome-accade-a-palermo-dettaglio.php?id=2117 | 2026-11-04 |
| Visit Sicily – Regione Siciliana | ufficiale | 2 | https://www.visitsicily.info/evento-new/sfincione-fest-2026 (+1 altre pagine) | 2026-11-03 |
| Comune di Bagheria | ufficiale | 1 | https://www.comune.bagheria.pa.it/it/eventi | 2026-11-04 |
| Sfincione Fest | organizzatore | 1 | https://sfincionefest.it/ | 2026-11-03 |
| Sherbeth Festival | organizzatore | 1 | https://sherbeth.it/ | 2026-11-03 |

### Messina (ME)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 4 | https://www.balarm.it/tutti-gli-eventi-a-messina-e-provincia-di-novembre-2026 | 2026-11-04 |

### Agrigento (AG)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Il Mediterraneo 24 | stampa | 4 | https://www.ilmediterraneo24.it/cultura/sambuca-al-teatro-lidea-la-nuova-stagione-da-fo-e-pirandello-allinclusione-di-educolab | 2026-11-04 |
| AnyTicket - biglietteria del Teatro Pirandello | organizzatore | 2 | https://www.anyticket.it/anyticketprod/Default.aspx?partner=PIRA | 2026-11-04 |
| Fondazione Teatro Pirandello | ufficiale | 1 | https://fondazioneteatropirandello.it/2026/05/teatro-pirandello-ecco-la-nuova-stagione-2026-2027 | 2026-11-04 |

### Caltanissetta (CL)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Comune di Caltanissetta | ufficiale | 1 | https://www.comune.caltanissetta.it/it/news/teatro-regina-margherita-presentata-la-stagione-teatrale-nazionale-2026-27 | 2026-11-04 |
| DalVivo | aggregatore | 1 | https://www.dalvivo.media/eventi/la-stagione-teatrale-nazionale-2026-2027-caltanissetta | 2026-11-04 |

### Enna (EN)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| AENNA - portale turistico del Comune di Enna | ufficiale | 3 | https://aenna.it/eventi-in-citta/?lang=it (+1 altre pagine) | 2026-11-04 |
| Hello Agira | aggregatore | 1 | https://helloagira.it/it/sagra-cassatella | 2026-11-04 |
| SagraMap | aggregatore | 1 | https://sagramap.com/sicilia/enna | 2026-11-04 |

### Catania (CT)

| Fonte | Tipo | Eventi | Pagina da riaprire | Ultima lettura |
|---|---|---:|---|---|
| Balarm.it | aggregatore | 55 | http://www.balarm.it/tutti-gli-eventi-in-sicilia-di-novembre-2026 | 2026-11-04 |
| Teatro Massimo Bellini di Catania | ufficiale | 1 | https://www.teatromassimobellini.it/eventi/la-bella-addormentata-2026 | 2026-11-04 |
| Visit Sicily (portale regionale di eventi) | aggregatore | 1 | https://www.visitsicily.info/evento-new/magie-barocche-2026 | 2026-11-03 |

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

61 fonti sono post di Instagram o Facebook, letti dal controllo automatico (`ricerca/instagram-account.json`, `scripts/controlla-instagram.mjs`). Si trovano in `ricerca/fonti.json`. Non si riaprono a mano: non accedere mai con l'account personale.

## Pagine che non si sono lette

Provate dagli agenti e non utilizzabili. Non riprovare con gli stessi strumenti: cerca una fonte alternativa (Comune, Pro Loco, teatro, portale turistico) o aspetta che il sito cambi. Gli errori `bot_blocked`, `login_required` e le pagine «vuote» sono quasi sempre siti che caricano il contenuto con JavaScript o bloccano i robot.

### vuota (15)

- https://accademiaperduta.it/teatro-diego-fabbri-forli
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

### errore:page_not_found (2)

- https://rdap.verisign.com/com/v1/domain/livelocal.eu
- https://www.sagretoscane.com/eventi/maremma/sapori-d-autunno

### errore:invalid_url (1)

- https://rdap.nic.it/domain/livelocal.it

### errore:empty_content (1)

- https://scontent-sjc3-1.cdninstagram.com/v/t51.82787-15/867127526_18103064687647731_5887217326824062461_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=9QSna3obqIAQ7kNvwEmQL7G&_nc_oc=AdpmhmvZDoGa4kvJy5DixJDn4j6HIsJsJuvG-OTyMlDXyRbTImAaaOssfpTly_lMFhg&_nc_zt=23&_nc_ht=scontent-sjc3-1.cdninstagram.com&edm=AL-3X8kEAAAA&_nc_gid=bc4iPGnAw0YmAQ1-zL_HaA&oh=00_AQTsA73Xi4Wdy5ZnEA0c4UAGqIjihCjvPfouqmGZeJRLEA&oe=6AF00002

### errore:timeout (1)

- https://www.visitbergamo.net/eventi

## Pagine aperte che non hanno dato eventi

135 pagine sono state lette ma non hanno prodotto eventi (data o luogo mancanti, già passati, già presenti, fuori zona). Elenco in `ricerca/fonti.json` (`eventi: 0`, `esito: letta`): utile per non riaprirle inutilmente.
