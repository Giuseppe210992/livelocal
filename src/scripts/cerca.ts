// Ricerca interattiva degli eventi nella home (gira nel browser).
// - cerca per testo (titolo, comune, luogo) o per comune scelto dall'elenco
// - quando: prossimi, oggi, domani, weekend, questo mese; categoria; solo gratuiti
// - «Vicino a me»: la posizione si chiede SOLO quando si tocca il pulsante e non lascia mai il telefono
// - i filtri restano nell'indirizzo della pagina, così si può condividere la ricerca
// Senza JavaScript la pagina mostra comunque i prossimi eventi (HTML già pronto).

type Riga = [string, string, string, string, string, string, string, number, number, number, string, string];
interface Dati { agg: string; cat: Record<string, string>; e: Riga[] }
type Quando = 'prossimi' | 'oggi' | 'domani' | 'weekend' | 'mese';
interface Centro { lat: number; lon: number; nome: string; gps: boolean }

const radice = document.querySelector<HTMLElement>('[data-cerca]');
if (radice) avvia(radice);

function avvia(radice: HTMLElement) {
  const base = radice.dataset.base ?? '/';
  const q = <T extends HTMLElement>(s: string) => radice.querySelector<T>(s)!;
  const campo = q<HTMLInputElement>('[data-testo]'), lista = q<HTMLUListElement>('[data-risultati]');
  const stato = q<HTMLElement>('[data-stato]'), altri = q<HTMLButtonElement>('[data-altri]'), datalist = q<HTMLDataListElement>('[data-comuni-lista]');
  const raggi = q<HTMLElement>('[data-raggi]'), gpsBtn = q<HTMLButtonElement>('[data-gps]'), azzera = q<HTMLButtonElement>('[data-azzera]');

  const S = { testo: '', quando: 'prossimi' as Quando, cat: '', gratis: false, centro: null as Centro | null, raggio: 25, mostra: 20 };
  let dati: Dati | null = null, comuni: [string, string, string, number, number][] | null = null, inCaricamento: Promise<void> | null = null;

  // ---------- date (fuso italiano) ----------
  const oggiRoma = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const piu = (iso: string, n: number) => { const [a, m, g] = iso.split('-').map(Number); return new Date(Date.UTC(a, m - 1, g + n)).toISOString().slice(0, 10); };
  const wd = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
  const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('it-IT', { timeZone: 'UTC', ...o }).format(new Date(`${iso}T12:00:00Z`));
  function intervallo(quando: Quando, oggi: string): [string, string] {
    if (quando === 'oggi') return [oggi, oggi];
    if (quando === 'domani') return [piu(oggi, 1), piu(oggi, 1)];
    if (quando === 'weekend') { const g = wd(oggi); if (g === 0) return [oggi, oggi]; const sab = g === 6 ? oggi : piu(oggi, 6 - g); return [sab, piu(sab, 1)]; }
    if (quando === 'mese') { const [a, m] = oggi.split('-').map(Number); return [oggi, new Date(Date.UTC(a, m, 0)).toISOString().slice(0, 10)]; }
    return [oggi, '9999-12-31'];
  }
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const km = (a: number, b: number, c: number, d: number) => { const r = Math.PI / 180, dx = (d - b) * r * Math.cos(((a + c) / 2) * r), dy = (c - a) * r; return Math.sqrt(dx * dx + dy * dy) * 6371; };

  // ---------- caricamento (solo quando serve) ----------
  function carica(): Promise<void> {
    if (dati) return Promise.resolve();
    if (!inCaricamento) {
      stato.textContent = 'Carico gli eventi…';
      inCaricamento = fetch(radice!.dataset.ricerca!).then((r) => r.json()).then((d: Dati) => { dati = d; }).catch(() => { stato.textContent = 'Non riesco a caricare gli eventi: riprova tra poco.'; inCaricamento = null; });
    }
    return inCaricamento;
  }
  async function caricaComuni() {
    if (comuni) return;
    try { comuni = (await (await fetch(radice!.dataset.comuni!)).json()).luoghi; } catch { comuni = []; }
  }

  // ---------- filtro e disegno ----------
  const html = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
  function quandoBreve(i: string, f: string) {
    const gi = i.slice(0, 10), gf = (f || i).slice(0, 10), ora = i.length > 10 ? i.slice(11, 16) : '';
    if (gf !== gi) return fmt(gi, { day: 'numeric', month: 'short' }) + ' – ' + fmt(gf, { day: 'numeric', month: 'short' });
    return fmt(gi, { weekday: 'short', day: 'numeric', month: 'short' }) + (ora ? `, ${ora}` : '');
  }
  function risultati() {
    if (!dati) return [];
    const oggi = oggiRoma(), [da, a] = intervallo(S.quando, oggi), t = norm(S.testo);
    const out: { r: Riga; ordine: string; d: number | null }[] = [];
    for (const r of dati.e) {
      const gi = r[3].slice(0, 10), gf = (r[4] || r[3]).slice(0, 10);
      if (gf < da || gi > a) continue;
      if (S.cat && r[2] !== S.cat) continue;
      if (S.gratis && !r[9]) continue;
      if (t && !norm(`${r[1]} ${r[5]} ${r[10]}`).includes(t)) continue;
      let d: number | null = null;
      if (S.centro) { d = km(S.centro.lat, S.centro.lon, r[7], r[8]); if (S.raggio > 0 && d > S.raggio) continue; }
      // prima gli eventi che iniziano nel periodo scelto, per data e ora; poi quelli già in corso (mostre e rassegne lunghe)
      out.push({ r, ordine: gi >= da ? '0' + gi + (r[3].length > 10 ? r[3].slice(11, 16) : '00:00') : '1' + gi, d });
    }
    return out.sort((x, y) => x.ordine.localeCompare(y.ordine) || (x.d ?? 0) - (y.d ?? 0));
  }
  function scheda(x: { r: Riga; d: number | null }) {
    const r = x.r, g = (r[3]).slice(0, 10), oggi = oggiRoma(), inizio = g < oggi ? oggi : g;
    const sett = fmt(inizio, { weekday: 'short' }).replace('.', ''), mese = fmt(inizio, { month: 'short' }).replace('.', '');
    const dist = x.d !== null ? ` · a ${x.d < 10 ? x.d.toFixed(1).replace('.', ',') : Math.round(x.d)} km` : '';
    return `<li class="scheda"><div class="data" aria-hidden="true"><span class="data__settimana">${sett}</span><span class="data__giorno">${Number(inizio.slice(8))}</span><span class="data__mese">${mese}</span></div>
<div><span class="scheda__categoria">${html(dati!.cat[r[2]] ?? r[2])}</span>${r[11] ? ` <span class="stato stato--${r[11].toLowerCase().replace(/\s+/g, '-')}">${html(r[11])}</span>` : ''}
<h3 class="scheda__titolo"><a href="${base}${r[0].replace(/^\//, '')}">${html(r[1])}</a></h3>
<p class="scheda__info">${quandoBreve(r[3], r[4])} · ${html(r[10])}, ${html(r[5])} (${r[6]})${dist}</p></div></li>`;
  }
  function disegna() {
    const tutti = risultati(), vis = tutti.slice(0, S.mostra);
    lista.innerHTML = vis.length ? vis.map(scheda).join('') : '';
    const filtri = S.testo || S.cat || S.gratis || S.centro || S.quando !== 'prossimi';
    azzera.hidden = !filtri;
    raggi.hidden = !S.centro;
    if (!vis.length) {
      stato.textContent = '';
      lista.innerHTML = `<li class="vuoto">Nessun evento con questi filtri.${S.centro && S.raggio > 0 ? ' Prova ad allargare la distanza o scegli «Tutta Italia».' : ' Prova a togliere un filtro.'}</li>`;
    } else {
      const dove = S.centro ? (S.centro.gps ? ' vicino a te' : ` vicino a ${S.centro.nome}`) : '';
      stato.textContent = `${tutti.length} ${tutti.length === 1 ? 'evento' : 'eventi'}${dove}`;
    }
    altri.hidden = tutti.length <= S.mostra;
    altri.textContent = `Mostra altri ${Math.min(20, tutti.length - S.mostra)}`;
    segna();
    scriviIndirizzo();
  }
  function segna() {
    radice!.querySelectorAll<HTMLButtonElement>('[data-quando]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.quando === S.quando)));
    radice!.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.cat ?? '') === S.cat)));
    radice!.querySelectorAll<HTMLButtonElement>('[data-raggio]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.raggio) === S.raggio)));
    q<HTMLButtonElement>('[data-gratis]').setAttribute('aria-pressed', String(S.gratis));
  }
  async function aggiorna() { S.mostra = 20; await carica(); if (dati) disegna(); }

  // ---------- indirizzo della pagina ----------
  function scriviIndirizzo() {
    const p = new URLSearchParams();
    if (S.testo) p.set('q', S.testo);
    if (S.quando !== 'prossimi') p.set('quando', S.quando);
    if (S.cat) p.set('cat', S.cat);
    if (S.gratis) p.set('gratis', '1');
    if (S.centro && !S.centro.gps) { p.set('lat', S.centro.lat.toFixed(4)); p.set('lon', S.centro.lon.toFixed(4)); p.set('dove', S.centro.nome); }
    if (S.centro && S.raggio !== 25) p.set('r', String(S.raggio));
    const s = p.toString();
    history.replaceState(null, '', location.pathname + (s ? `?${s}` : '') + location.hash);
  }
  function leggiIndirizzo(): boolean {
    const p = new URLSearchParams(location.search);
    if (![...p.keys()].length) return false;
    S.testo = p.get('q') ?? ''; campo.value = S.testo;
    const qd = p.get('quando'); if (qd && ['oggi', 'domani', 'weekend', 'mese'].includes(qd)) S.quando = qd as Quando;
    S.cat = p.get('cat') ?? ''; S.gratis = p.get('gratis') === '1';
    const la = Number(p.get('lat')), lo = Number(p.get('lon'));
    if (p.get('lat') && Number.isFinite(la) && Number.isFinite(lo)) S.centro = { lat: la, lon: lo, nome: p.get('dove') ?? 'questo luogo', gps: false };
    const r = Number(p.get('r')); if ([10, 25, 50, 100, 0].includes(r) && p.get('r') !== null) S.raggio = r;
    return true;
  }

  // ---------- comandi ----------
  radice.querySelectorAll<HTMLButtonElement>('[data-quando]').forEach((b) => b.addEventListener('click', () => { S.quando = (b.dataset.quando as Quando) === S.quando && S.quando !== 'prossimi' ? 'prossimi' : (b.dataset.quando as Quando); aggiorna(); }));
  radice.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((b) => b.addEventListener('click', () => { S.cat = b.dataset.cat ?? ''; aggiorna(); }));
  radice.querySelectorAll<HTMLButtonElement>('[data-raggio]').forEach((b) => b.addEventListener('click', () => { S.raggio = Number(b.dataset.raggio); aggiorna(); }));
  q<HTMLButtonElement>('[data-gratis]').addEventListener('click', () => { S.gratis = !S.gratis; aggiorna(); });
  altri.addEventListener('click', () => { S.mostra += 20; if (dati) disegna(); });
  azzera.addEventListener('click', () => { S.testo = ''; campo.value = ''; S.quando = 'prossimi'; S.cat = ''; S.gratis = false; S.centro = null; S.raggio = 25; aggiorna(); });

  let attesa = 0;
  campo.addEventListener('input', async () => {
    const v = campo.value.trim();
    await caricaComuni();
    if (comuni && v.length >= 2) {
      const n = norm(v);
      const trovati = comuni.filter((c) => norm(c[1]).startsWith(n)).slice(0, 8);
      datalist.innerHTML = trovati.map((c) => `<option value="${html(c[1])} (${c[2]})"></option>`).join('');
      const esatto = comuni.find((c) => `${c[1]} (${c[2]})` === campo.value.trim());
      if (esatto) { S.centro = { lat: esatto[3], lon: esatto[4], nome: esatto[1], gps: false }; S.testo = ''; S.raggio = S.raggio || 25; campo.value = ''; aggiorna(); campo.blur(); return; }
    }
    clearTimeout(attesa);
    attesa = window.setTimeout(() => { S.testo = v; aggiorna(); }, 250);
  });
  campo.addEventListener('focus', () => { carica(); caricaComuni(); }, { once: true });
  q<HTMLFormElement>('[data-form]').addEventListener('submit', (e) => { e.preventDefault(); S.testo = campo.value.trim(); aggiorna(); });

  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) { stato.textContent = 'Questo telefono non permette di usare la posizione. Scrivi il nome del tuo comune.'; return; }
    stato.textContent = 'Cerco la tua posizione… (la posizione resta sul tuo telefono)';
    navigator.geolocation.getCurrentPosition(
      (p) => { S.centro = { lat: p.coords.latitude, lon: p.coords.longitude, nome: 'te', gps: true }; if (S.raggio === 0) S.raggio = 25; aggiorna(); },
      () => { stato.textContent = 'Non ho il permesso di usare la posizione. Scrivi il nome del tuo comune nella casella.'; },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    );
  });

  // Se l'indirizzo ha già dei filtri (ricerca condivisa) si parte subito.
  if (leggiIndirizzo()) aggiorna();
}
