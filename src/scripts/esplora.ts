// Mappa interattiva degli eventi (gira nel browser).
// - scelta del giorno: tutti, weekend, i prossimi 14 giorni o una data qualsiasi
// - posizione del telefono (solo se l'utente acconsente) oppure un luogo scelto dall'elenco
// - raggio 10, 25, 50 o 100 km
// La posizione non lascia mai il telefono: le distanze si calcolano qui.
// Mappa: Leaflet + OpenStreetMap (nessuna chiave a pagamento).

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EventoMappa {
  titolo: string;
  url: string;
  categoria: string;
  giornoInizio: string; // AAAA-MM-GG
  giornoFine: string;
  fineMs: number;
  quando: string;
  luogo: string;
  localita: string;
  lat: number;
  lon: number;
  approssimata: boolean;
  stato: string;
  nuoveDate: boolean;
  data: { giorno: string; mese: string; settimana: string };
}
interface Centro { slug: string; nome: string; lat: number; lon: number } // slug = codice ISTAT (o codice-frazione)
interface Dati { eventi: EventoMappa[] }

// Riquadro che contiene Lazio e Campania: la mappa parte da qui se non ci sono eventi da inquadrare.
const RIQUADRO_INIZIALE: L.LatLngBoundsExpression = [[39.98, 11.45], [42.84, 15.81]];

type Giorno = 'tutti' | 'weekend' | string; // oppure AAAA-MM-GG
interface Partenza { lat: number; lon: number; nome: string; daGps: boolean; slug?: string; precisione?: number }

const GIORNI_VISIBILI = 14;
const RAGGI = [10, 25, 50, 100];

// ---------- date (fuso italiano) ----------
const oggiRoma = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

function piuGiorni(iso: string, n: number): string {
  const [a, m, g] = iso.split('-').map(Number);
  return new Date(Date.UTC(a, m - 1, g + n)).toISOString().slice(0, 10);
}
const giornoSettimana = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay(); // 0 = domenica
const formato = (iso: string, opzioni: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('it-IT', { timeZone: 'UTC', ...opzioni }).format(new Date(`${iso}T12:00:00Z`));

/** Sabato e domenica di questo fine settimana (se oggi è domenica: solo oggi). */
function weekend(oggi: string): [string, string] {
  const g = giornoSettimana(oggi);
  if (g === 0) return [oggi, oggi];
  if (g === 6) return [oggi, piuGiorni(oggi, 1)];
  const sabato = piuGiorni(oggi, 6 - g);
  return [sabato, piuGiorni(sabato, 1)];
}

// ---------- distanze ----------
function distanzaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const rad = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lon - a.lon) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
const testoKm = (km: number) => (km < 1 ? `${Math.max(10, Math.round(km * 100) * 10)} m` : `${km.toLocaleString('it-IT', { maximumFractionDigits: 1 })} km`);

// ---------- testo sicuro dentro l'HTML ----------
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function avviaEsplora(): void {
  const dati: Dati = JSON.parse(document.getElementById('dati-esplora')!.textContent!);
  const el = {
    giorni: document.getElementById('giorni')!,
    altraData: document.getElementById('altra-data') as HTMLInputElement,
    usaPosizione: document.getElementById('usa-posizione') as HTMLButtonElement,
    centro: document.getElementById('centro') as HTMLInputElement,
    elencoLuoghi: document.getElementById('elenco-luoghi') as HTMLDataListElement,
    raggi: document.getElementById('raggi')!,
    statoPosizione: document.getElementById('stato-posizione')!,
    titolo: document.getElementById('titolo-risultati')!,
    risultati: document.getElementById('risultati')!,
    mappa: document.getElementById('mappa')!,
  };

  // ----- stato iniziale, letto dall'indirizzo (così un link si può condividere) -----
  const parametri = new URLSearchParams(location.search);
  let giorno: Giorno = parametri.get('giorno') ?? 'tutti';
  if (giorno !== 'tutti' && giorno !== 'weekend' && !/^\d{4}-\d{2}-\d{2}$/.test(giorno)) giorno = 'tutti';
  let raggio = RAGGI.includes(Number(parametri.get('r'))) ? Number(parametri.get('r')) : 25;
  let partenza: Partenza | null = null;

  // ----- elenco dei luoghi di partenza (comuni e frazioni), scaricato solo quando serve -----
  let luoghi: Centro[] | null = null;
  const etichetta = (c: Centro) => c.nome;
  async function caricaLuoghi(): Promise<Centro[]> {
    if (luoghi) return luoghi;
    const url = (document.querySelector('.esplora') as HTMLElement).dataset.luoghi!;
    const risposta = await fetch(url);
    const { luoghi: righe } = (await risposta.json()) as { luoghi: [string, string, string, number, number][] };
    luoghi = righe.map(([slug, nome, sigla, lat, lon]) => ({ slug, nome: `${nome} (${sigla})`, lat, lon }));
    el.elencoLuoghi.innerHTML = luoghi.map((c) => `<option value="${esc(etichetta(c))}"></option>`).join('');
    return luoghi;
  }

  // ----- mappa -----
  const mappa = L.map(el.mappa, { scrollWheelZoom: false }).fitBounds(RIQUADRO_INIZIALE);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mappa);
  const livelloEventi = L.layerGroup().addTo(mappa);
  const livelloPartenza = L.layerGroup().addTo(mappa);
  const segnaposto = L.divIcon({ className: 'puntina', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });
  const segnapostoConcluso = L.divIcon({ className: 'puntina puntina--concluso', html: '<span></span>', iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -28] });

  // ----- filtro -----
  function eventiFiltrati(): (EventoMappa & { km?: number })[] {
    const adesso = Date.now();
    let lista = dati.eventi.slice();
    if (giorno === 'tutti') lista = lista.filter((e) => e.fineMs >= adesso);
    else if (giorno === 'weekend') {
      const [sab, dom] = weekend(oggiRoma());
      lista = lista.filter((e) => e.giornoInizio <= dom && e.giornoFine >= sab && e.fineMs >= adesso);
    } else lista = lista.filter((e) => e.giornoInizio <= giorno && giorno <= e.giornoFine);

    if (!partenza) return lista;
    const p = partenza;
    return lista
      .map((e) => ({ ...e, km: distanzaKm(p, e) }))
      .filter((e) => e.km <= raggio)
      .sort((a, b) => a.km - b.km);
  }

  function descrizioneGiorno(): string {
    if (giorno === 'tutti') return 'in programma';
    const oggi = oggiRoma();
    if (giorno === 'weekend') {
      const [sab, dom] = weekend(oggi);
      return sab === dom ? 'oggi, domenica' : `nel weekend (${formato(sab, { day: 'numeric' })}-${formato(dom, { day: 'numeric', month: 'long' })})`;
    }
    if (giorno === oggi) return 'oggi';
    if (giorno === piuGiorni(oggi, 1)) return 'domani';
    return formato(giorno, { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // ----- disegno -----
  function disegnaGiorni(): void {
    const oggi = oggiRoma();
    const conta = (g: string) => dati.eventi.filter((e) => e.stato !== 'annullato' && e.giornoInizio <= g && g <= e.giornoFine).length;
    const bottoni: string[] = [
      `<button type="button" class="chip" data-giorno="tutti" aria-pressed="${giorno === 'tutti'}">Tutti</button>`,
      `<button type="button" class="chip" data-giorno="weekend" aria-pressed="${giorno === 'weekend'}">Weekend</button>`,
    ];
    for (let i = 0; i < GIORNI_VISIBILI; i++) {
      const g = piuGiorni(oggi, i);
      const n = conta(g);
      const nome = i === 0 ? 'Oggi' : i === 1 ? 'Domani' : formato(g, { weekday: 'short' });
      bottoni.push(
        `<button type="button" class="giorno${n ? '' : ' giorno--vuoto'}" data-giorno="${g}" aria-pressed="${giorno === g}"
          aria-label="${esc(formato(g, { weekday: 'long', day: 'numeric', month: 'long' }))}: ${n ? `${n} event${n === 1 ? 'o' : 'i'}` : 'nessun evento'}">
          <span class="giorno__nome">${esc(nome)}</span>
          <span class="giorno__num">${formato(g, { day: 'numeric' })}</span>
          <span class="giorno__mese">${esc(formato(g, { month: 'short' }))}</span>
          <span class="giorno__conta">${n || '·'}</span>
        </button>`,
      );
    }
    el.giorni.innerHTML = bottoni.join('');
    el.altraData.value = /^\d{4}-/.test(giorno) ? giorno : '';
    // Porta in vista il giorno scelto nella striscia
    el.giorni.querySelector<HTMLElement>('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  function disegnaRisultati(): void {
    const lista = eventiFiltrati();
    const adesso = Date.now();
    const dove = partenza ? ` entro ${raggio} km da ${partenza.daGps ? 'te' : partenza.nome}` : '';
    const quanti = lista.length === 0 ? 'Nessun evento' : lista.length === 1 ? '1 evento' : `${lista.length} eventi`;
    el.titolo.textContent = `${quanti} ${descrizioneGiorno()}${dove}`;

    // elenco
    if (!lista.length) {
      el.risultati.innerHTML = `<li class="vuoto">Nessun evento ${esc(descrizioneGiorno())}${esc(dove)}. Prova un altro giorno${partenza ? ' o allarga la distanza' : ''}.</li>`;
    } else {
      el.risultati.innerHTML = lista.map((e, i) => {
        const concluso = e.fineMs < adesso;
        const etichetta = e.stato === 'annullato' ? ['Annullato', 'annullato'] : e.stato === 'rinviato' ? ['Rinviato', 'nuove-date'] : concluso ? ['Concluso', 'concluso'] : e.nuoveDate ? ['Nuove date', 'nuove-date'] : null;
        return `<li class="scheda${concluso ? ' scheda--conclusa' : ''}">
          <div class="data" aria-hidden="true"><span class="data__settimana">${esc(e.data.settimana)}</span><span class="data__giorno">${esc(e.data.giorno)}</span><span class="data__mese">${esc(e.data.mese)}</span></div>
          <div>
            <span class="scheda__categoria">${esc(e.categoria)}</span>${etichetta ? ` <span class="stato stato--${etichetta[1]}">${etichetta[0]}</span>` : ''}
            <h3 class="scheda__titolo"><a href="${esc(e.url)}">${esc(e.titolo)}</a></h3>
            <p class="scheda__info">${esc(e.quando)} · ${esc(e.luogo)}, ${esc(e.localita)}</p>
            ${e.km !== undefined ? `<p class="scheda__distanza">a ${testoKm(e.km)}${partenza?.daGps ? ' da te' : ` da ${esc(partenza!.nome)}`}</p>` : ''}
            <button type="button" class="vedi-mappa" data-indice="${i}">Mostra sulla mappa</button>
          </div>
        </li>`;
      }).join('');
    }

    // mappa
    livelloEventi.clearLayers();
    const marcatori = lista.map((e) => {
      const concluso = e.fineMs < adesso;
      const m = L.marker([e.lat, e.lon], { icon: concluso ? segnapostoConcluso : segnaposto, title: e.titolo, alt: e.titolo });
      m.bindPopup(
        `<div class="popup">
          <span class="scheda__categoria">${esc(e.categoria)}</span>
          <a class="popup__titolo" href="${esc(e.url)}">${esc(e.titolo)}</a>
          <span>${esc(e.quando)}</span>
          <span>${esc(e.luogo)}</span>
          ${e.km !== undefined ? `<span>a ${testoKm(e.km)}</span>` : ''}
          ${e.approssimata ? '<small>Posizione indicativa (centro del paese)</small>' : ''}
        </div>`,
      );
      return m.addTo(livelloEventi);
    });

    el.risultati.querySelectorAll<HTMLButtonElement>('.vedi-mappa').forEach((b) =>
      b.addEventListener('click', () => {
        const m = marcatori[Number(b.dataset.indice)];
        el.mappa.scrollIntoView({ behavior: 'smooth', block: 'center' });
        mappa.setView(m.getLatLng(), Math.max(mappa.getZoom(), 15));
        m.openPopup();
      }),
    );

    // partenza e cerchio del raggio
    livelloPartenza.clearLayers();
    if (partenza) {
      const centro = L.latLng(partenza.lat, partenza.lon);
      L.circle(centro, { radius: raggio * 1000, className: 'cerchio-raggio', interactive: false }).addTo(livelloPartenza);
      L.circleMarker(centro, { radius: 8, className: 'punto-partenza', interactive: true })
        .bindTooltip(partenza.daGps ? 'Sei qui' : partenza.nome)
        .addTo(livelloPartenza);
    }

    // inquadratura
    const punti = marcatori.map((m) => m.getLatLng());
    if (partenza) punti.push(L.latLng(partenza.lat, partenza.lon));
    if (punti.length > 1) mappa.fitBounds(L.latLngBounds(punti), { padding: [36, 36], maxZoom: 15 });
    else if (punti.length === 1) mappa.setView(punti[0], 14);
    else if (partenza) mappa.fitBounds(L.latLng(partenza.lat, partenza.lon).toBounds(raggio * 2000));
  }

  function disegnaDove(): void {
    el.raggi.hidden = !partenza;
    el.raggi.querySelectorAll<HTMLButtonElement>('[data-raggio]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.raggio) === raggio)));
    if (document.activeElement !== el.centro) el.centro.value = partenza && !partenza.daGps ? partenza.nome : '';
  }

  function aggiornaIndirizzo(): void {
    const p = new URLSearchParams();
    if (giorno !== 'tutti') p.set('giorno', giorno);
    if (partenza && !partenza.daGps && partenza.slug) p.set('da', partenza.slug); // la posizione GPS non va mai nell'indirizzo
    if (partenza) p.set('r', String(raggio));
    const q = p.toString();
    history.replaceState(null, '', q ? `?${q}` : location.pathname);
  }

  function aggiorna(): void {
    disegnaGiorni();
    disegnaDove();
    disegnaRisultati();
    aggiornaIndirizzo();
  }

  // ----- posizione del telefono -----
  const messaggio = (testo: string, tipo: 'info' | 'ok' | 'errore' = 'info') => {
    el.statoPosizione.textContent = testo;
    el.statoPosizione.dataset.tipo = tipo;
  };

  function chiediPosizione(silenzioso = false): void {
    if (!('geolocation' in navigator)) {
      messaggio('Questo browser non può dare la posizione. Scegli un luogo dall\'elenco.', 'errore');
      return;
    }
    if (!silenzioso) messaggio('Sto cercando la tua posizione…');
    el.usaPosizione.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        el.usaPosizione.disabled = false;
        partenza = { lat: pos.coords.latitude, lon: pos.coords.longitude, nome: 'la tua posizione', daGps: true, precisione: pos.coords.accuracy };
        messaggio(`Posizione trovata (precisione circa ${testoKm(pos.coords.accuracy / 1000)}).`, 'ok');
        aggiorna();
      },
      (errore) => {
        el.usaPosizione.disabled = false;
        if (silenzioso) return;
        if (errore.code === errore.PERMISSION_DENIED)
          messaggio('Non hai dato il permesso per la posizione. Per attivarlo: tocca il lucchetto accanto all\'indirizzo del sito, poi Autorizzazioni → Posizione → Consenti. Oppure scegli un luogo dall\'elenco.', 'errore');
        else if (errore.code === errore.POSITION_UNAVAILABLE)
          messaggio('Il telefono non trova la posizione. Controlla che la localizzazione sia accesa (tendina in alto → Posizione) e riprova.', 'errore');
        else messaggio('Ci sta mettendo troppo. Riprova, oppure scegli un luogo dall\'elenco.', 'errore');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  }

  // ----- eventi dei controlli -----
  el.giorni.addEventListener('click', (ev) => {
    const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-giorno]');
    if (!b) return;
    giorno = b.dataset.giorno!;
    aggiorna();
  });
  el.altraData.addEventListener('change', () => {
    if (el.altraData.value) { giorno = el.altraData.value; aggiorna(); }
  });
  el.usaPosizione.addEventListener('click', () => chiediPosizione());
  el.centro.addEventListener('focus', () => { caricaLuoghi().catch(() => {}); }, { once: true });
  const scegliLuogo = async () => {
    const testo = el.centro.value.trim().toLowerCase();
    if (!testo) {
      if (partenza && !partenza.daGps) { partenza = null; messaggio(''); aggiorna(); }
      return;
    }
    const elenco = await caricaLuoghi();
    // prima il nome esatto con la sigla, poi il solo nome del paese
    const c = elenco.find((x) => x.nome.toLowerCase() === testo)
      ?? elenco.find((x) => x.nome.toLowerCase().replace(/ \([a-z]{2}\)$/, '') === testo);
    if (!c) { messaggio('Non trovo questo paese nel Lazio o in Campania. Scegli uno dei suggerimenti.', 'errore'); return; }
    partenza = { ...c, daGps: false };
    el.centro.value = c.nome;
    el.centro.blur();
    messaggio(`Parti da ${c.nome}.`);
    aggiorna();
  };
  el.centro.addEventListener('change', scegliLuogo);
  el.centro.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); scegliLuogo(); } });
  el.raggi.addEventListener('click', (ev) => {
    const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('[data-raggio]');
    if (!b) return;
    raggio = Number(b.dataset.raggio);
    aggiorna();
  });

  aggiorna();

  // Partenza scritta nell'indirizzo (?da=codice): carica l'elenco e applicala.
  const daParametro = parametri.get('da');
  if (daParametro) {
    caricaLuoghi().then((elenco) => {
      const c = elenco.find((x) => x.slug === daParametro);
      if (c) { partenza = { ...c, daGps: false }; messaggio(`Parti da ${c.nome}.`); aggiorna(); }
    }).catch(() => {});
  }

  // Se il permesso è già stato dato in passato, usa subito la posizione (senza nuove richieste).
  // Se è stato negato, spiega subito come riattivarlo.
  navigator.permissions?.query({ name: 'geolocation' as PermissionName }).then((p) => {
    if (p.state === 'granted' && !partenza) chiediPosizione(true);
    if (p.state === 'denied') messaggio('La posizione è bloccata per questo sito. Per attivarla: lucchetto accanto all\'indirizzo → Autorizzazioni → Posizione → Consenti. Oppure scegli un luogo.', 'errore');
  }).catch(() => {});
}
