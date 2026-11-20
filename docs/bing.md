# Bing e indicizzazione (16/11/2026)

Diagnosi fatta con l'API di Bing Webmaster Tools (chiave data da Giuseppe in chat, solo letture e invii; **va rigenerata**: Bing Webmaster Tools → Impostazioni → Accesso API → Chiave API → Genera). La chiave non è in nessun file del repository.

**Cosa risultava il 16/11/2026**
- Sito verificato (`IsVerified: true`), tag `msvalidate.01` presente; robots.txt ammette Bingbot; file chiave IndexNow raggiungibile.
- Sitemap: Bing l'aveva letta una sola volta, il 3/11, con 112 indirizzi (oggi circa 8.100).
- Analisi: 141 pagine in 10 giorni (da 0 a 47 al giorno), 3 risposte 4xx e 11 errori in tutto (senza dettaglio); **pagine in indice: 0**, impressioni 0, clic 0; la home risultava «mai analizzata» nell'info indirizzi.
- Causa probabile: sottodominio nuovo con migliaia di pagine generate in automatico e senza collegamenti da altri siti; sitemap ferma a 112 indirizzi.

**Cosa è stato fatto**
1. Inviati a Bing 100 indirizzi importanti con l'API (home, pagine fisse, 20 regioni, 110 province, 25 zone dei luoghi, comuni); quota giornaliera 100, mensile 1.500: si possono inviarne altri ogni giorno.
2. `/sitemap.xml` ora è un **indice** con quattro mappe: `sitemap-principali.xml`, `sitemap-territorio.xml`, `sitemap-eventi.xml`, `sitemap-luoghi.xml` (`src/lib/sitemap.ts`); `scripts/controlla.mjs` le legge tutte. Da reinviare a Bing e a Google Search Console.
3. IndexNow (`scripts/indexnow.mjs`): prima avvisava solo per gli eventi nuovi o cambiati; ora avvisa anche per i luoghi cambiati, le pagine fisse (home, oggi, domani, weekend, mappe, luoghi) e le mappe del sito quando cambiano codice o dati. Lancio a mano di «Pubblica il sito»: invia tutto una volta (circa 6.900 indirizzi).

**Cosa può fare solo Giuseppe**: collegamenti da altri siti (roomandrelax.it, Comuni, Pro Loco, social) e pazienza: per un sottodominio nuovo l'indicizzazione di Bing può richiedere settimane.

## 19/11/2026 — solo gli eventi in programma in mappa e in IndexNow

Gli eventi si aggiornano ogni giorno e quasi la metà (2.958 su 6.872) era già conclusa: Bing spendeva le visite su pagine che non servono a chi cerca. Ora `sitemap-eventi.xml` contiene solo gli eventi in programma o in corso (3.701 al 19/11) e IndexNow non invia più quelli conclusi. Le pagine dei conclusi restano online come archivio. Le date `lastmod` non cambiano a ogni pubblicazione (vengono dalla data di inserimento), quindi la mappa non segnala falsi cambiamenti.

## 20/11/2026 — Google ha tolto le pagine dall'indice: «noindex» sugli eventi lontani

Search Console (letta via API) mostra 171 clic/giorno tra 5 e 11 novembre e poi quasi zero dal 12: le pagine risultano «scansionate, ma attualmente non indicizzate». Robots, canonical e indicizzazione erano a posto. Ipotesi: filtro di qualità dopo la crescita da 2.160 a 8.050 eventi in due settimane. Risposta: le pagine evento si fanno indicizzare solo se l'evento è in corso o inizia entro 21 giorni (`GIORNI_INDICE` in `src/lib/eventi.ts`), le altre restano online con `noindex, follow` e fuori mappa del sito e da IndexNow. Si ricalcola a ogni pubblicazione oraria. Da controllare ogni settimana: pagine indicizzate e clic.
