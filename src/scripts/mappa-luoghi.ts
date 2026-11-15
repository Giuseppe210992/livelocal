// Mappa interattiva dei luoghi da visitare (gira nel browser). Leaflet + OpenStreetMap, nessuna chiave.
// - punti colorati per tipo (museo, area archeologica, castello…); tocca un punto per orari e scheda
// - filtro per tipo, ricerca per nome o comune (i comuni si possono anche scegliere dall'elenco), «Vicino a me» solo al tocco
// - sotto la mappa l'elenco dei luoghi in vista (i più vicini al centro), comodo da telefono
// La posizione non lascia mai il telefono. Con migliaia di luoghi si usano punti disegnati su canvas (veloci, senza raggruppamenti).

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Riga = [string, string, string, string, string, number, number, number, string]; // slug, nome, tipo, comune, sigla, lat, lon, indicativa, orari
const COLORI: Record<string, string> = {
  'Museo': '#1a6fb5', 'Museo e area archeologica': '#1a6fb5', 'Area archeologica': '#c85d1e', 'Castello': '#7b3fa0', 'Palazzo e villa': '#2e8b57',
  'Chiesa e abbazia': '#b8860b', 'Reggia e parco': '#c2185b', 'Parco e giardino': '#00897b', 'Monumento': '#5f6b7a', 'Palazzo': '#2e8b57', 'Chiesa e cattedrale': '#b8860b', 'Luogo': '#5f6b7a',
};
const colore = (t: string) => COLORI[t] ?? '#5f6b7a';
const RIQUADRO_ITALIA: L.LatLngBoundsExpression = [[35.45, 6.6], [47.15, 18.6]];

const radice = document.querySelector<HTMLElement>('[data-mappa-luoghi]');
if (radice) avvia(radice);

async function avvia(radice: HTMLElement) {
  const q = <T extends HTMLElement>(s: string) => radice.querySelector<T>(s)!;
  const base = radice.dataset.base ?? '/';
  const stato = q('[data-stato]'), lista = q<HTMLUListElement>('[data-lista]'), titoloLista = q('[data-titolo-lista]');
  const campo = q<HTMLInputElement>('[data-testo]'), datalist = q<HTMLDataListElement>('[data-comuni-lista]'), azzera = q<HTMLButtonElement>('[data-azzera]');
  const html = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const km = (a: number, b: number, c: number, d: number) => { const r = Math.PI / 180, dx = (d - b) * r * Math.cos(((a + c) / 2) * r), dy = (c - a) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };

  let dati: Riga[] = [];
  try { dati = (await (await fetch(radice.dataset.dati!)).json()).l; } catch { stato.textContent = 'Non riesco a caricare i luoghi: riprova tra poco.'; return; }

  const mappa = L.map(q('[data-mappa]'), { scrollWheelZoom: false, preferCanvas: true }).fitBounds(RIQUADRO_ITALIA);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(mappa);
  const livello = L.layerGroup().addTo(mappa), livelloAqui = L.layerGroup().addTo(mappa);

  // ---------- stato dei filtri ----------
  const S = { testo: '', tipo: '', aqui: null as { lat: number; lon: number } | null };
  const tipi = [...new Set(dati.map((r) => r[2]))].sort((a, b) => a.localeCompare(b, 'it'));
  const contenitoreTipi = q('[data-tipi]');
  contenitoreTipi.innerHTML = [`<button type="button" class="chip" data-tipo="" aria-pressed="true">Tutti</button>`, ...tipi.map((t) => `<button type="button" class="chip chip--tipo" data-tipo="${html(t)}" aria-pressed="false"><i style="background:${colore(t)}"></i>${html(t)}</button>`)].join('');
  const segna = () => contenitoreTipi.querySelectorAll<HTMLButtonElement>('[data-tipo]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tipo === S.tipo)));

  // ---------- disegno ----------
  let marcatori: { m: L.CircleMarker; r: Riga }[] = [];
  const filtrati = () => dati.filter((r) => (!S.tipo || r[2] === S.tipo) && (!S.testo || norm(`${r[1]} ${r[3]} ${r[2]}`).includes(norm(S.testo))));
  function popup(r: Riga) {
    return `<div class="popup"><span class="scheda__categoria">${html(r[2])}</span><a class="popup__titolo" href="${base}luoghi/${r[0]}/">${html(r[1])}</a><span>${html(r[3])} (${r[4]})</span><span>${html(r[8])}</span>${r[7] ? '<small>Posizione indicativa (centro del paese)</small>' : ''}<a href="${base}luoghi/${r[0]}/">Orari, costi e come arrivare →</a></div>`;
  }
  function disegna(inquadra: boolean) {
    const f = filtrati();
    livello.clearLayers(); marcatori = [];
    for (const r of f) {
      const m = L.circleMarker([r[5], r[6]], { radius: 8, color: '#fff', weight: 2, fillColor: colore(r[2]), fillOpacity: r[7] ? 0.55 : 0.95, className: 'punto-luogo' }).bindPopup(popup(r)).bindTooltip(r[1]);
      m.addTo(livello); marcatori.push({ m, r });
    }
    azzera.hidden = !(S.testo || S.tipo || S.aqui);
    stato.textContent = `${f.length} ${f.length === 1 ? 'luogo' : 'luoghi'}${S.tipo ? ` · ${S.tipo}` : ''}${S.testo ? ` · «${S.testo}»` : ''}`;
    if (inquadra && f.length) {
      const pt = f.map((r) => L.latLng(r[5], r[6]));
      if (S.aqui) { pt.push(L.latLng(S.aqui.lat, S.aqui.lon)); }
      if (pt.length === 1) mappa.setView(pt[0], 13); else mappa.fitBounds(L.latLngBounds(pt), { padding: [30, 30], maxZoom: 14 });
    }
    segna();
    elencoInVista();
  }
  function elencoInVista() {
    const c = S.aqui ? L.latLng(S.aqui.lat, S.aqui.lon) : mappa.getCenter();
    const b = mappa.getBounds();
    const visibili = marcatori.filter(({ r }) => b.contains([r[5], r[6]]) || S.aqui).map(({ r }) => ({ r, d: km(c.lat, c.lng, r[5], r[6]) })).sort((a, b2) => a.d - b2.d).slice(0, 15);
    titoloLista.hidden = visibili.length === 0;
    titoloLista.textContent = S.aqui ? 'Più vicini a te' : 'Luoghi in questa zona';
    lista.innerHTML = visibili.map(({ r, d }) => `<li class="scheda scheda--luogo"><div><span class="scheda__categoria">${html(r[2])}</span><h3 class="scheda__titolo"><a href="${base}luoghi/${r[0]}/">${html(r[1])}</a></h3><p class="scheda__info">${html(r[3])} (${r[4]})${S.aqui ? ` · a ${d < 10 ? d.toFixed(1).replace('.', ',') : Math.round(d)} km` : ''} · ${html(r[8])}</p></div></li>`).join('');
  }
  mappa.on('moveend', () => { if (!S.aqui) elencoInVista(); });

  // ---------- comandi ----------
  contenitoreTipi.addEventListener('click', (e) => { const b = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-tipo]'); if (!b) return; S.tipo = b.dataset.tipo ?? ''; disegna(true); });
  azzera.addEventListener('click', () => { S.testo = ''; S.tipo = ''; S.aqui = null; campo.value = ''; livelloAqui.clearLayers(); disegna(false); mappa.fitBounds(RIQUADRO_ITALIA); });
  q<HTMLFormElement>('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); S.testo = campo.value.trim(); disegna(true); });

  let comuni: [string, string, string, number, number][] | null = null, attesa = 0;
  campo.addEventListener('focus', async () => { if (comuni) return; try { comuni = (await (await fetch(radice.dataset.comuni!)).json()).luoghi; } catch { comuni = []; } }, { once: true });
  campo.addEventListener('input', () => {
    const v = campo.value.trim(), n = norm(v);
    if (comuni && v.length >= 2) {
      datalist.innerHTML = comuni.filter((c) => norm(c[1]).startsWith(n)).slice(0, 8).map((c) => `<option value="${html(c[1])} (${c[2]})"></option>`).join('');
      const esatto = comuni.find((c) => `${c[1]} (${c[2]})` === v);
      if (esatto) { S.testo = ''; campo.value = ''; S.aqui = null; livelloAqui.clearLayers(); disegna(false); mappa.setView([esatto[3], esatto[4]], 12); campo.blur(); return; }
    }
    clearTimeout(attesa);
    attesa = window.setTimeout(() => { S.testo = v; disegna(true); }, 300);
  });

  q<HTMLButtonElement>('[data-gps]').addEventListener('click', () => {
    if (!navigator.geolocation) { stato.textContent = 'Questo telefono non permette di usare la posizione. Scrivi il nome del tuo comune.'; return; }
    stato.textContent = 'Cerco la tua posizione… (resta sul tuo telefono)';
    navigator.geolocation.getCurrentPosition((p) => {
      S.aqui = { lat: p.coords.latitude, lon: p.coords.longitude };
      livelloAqui.clearLayers();
      L.circleMarker([S.aqui.lat, S.aqui.lon], { radius: 8, className: 'punto-partenza' }).bindTooltip('Sei qui').addTo(livelloAqui);
      disegna(false);
      const vicini = filtrati().map((r) => km(S.aqui!.lat, S.aqui!.lon, r[5], r[6])).sort((a, b) => a - b);
      const raggio = Math.min(Math.max(vicini[Math.min(4, vicini.length - 1)] ?? 25, 5), 150);
      mappa.fitBounds(L.latLng(S.aqui.lat, S.aqui.lon).toBounds(raggio * 2000));
    }, () => { stato.textContent = 'Non ho il permesso di usare la posizione. Scrivi il nome del tuo comune nella casella.'; }, { timeout: 15000, maximumAge: 300000 });
  });

  disegna(false);
  // Se i luoghi sono pochi si inquadrano; con tanti luoghi si parte dall'Italia intera.
  if (dati.length && dati.length <= 12) disegna(true);
  // I suggerimenti sono utili solo con JavaScript: i comandi si mostrano (la classe solo-js è nascosta senza JS dal CSS esistente).
}
