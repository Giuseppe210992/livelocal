// Modulo "Invia il tuo evento" (gira nel browser).
// I dati partono dal telefono verso Web3Forms, che li gira per email al titolare del sito.
// Non passano da questo repository e non vengono salvati sul sito.

const ENDPOINT = 'https://api.web3forms.com/submit';
const ATTESA_MINIMA_MS = 4000; // chi compila in meno di 4 secondi è un programma, non una persona

interface Luogo { slug: string; nome: string }

const formatoData = (iso: string) => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

function telefonoValido(t: string): string | null {
  const pulito = t.replace(/[\s.\-()]/g, '').replace(/^(\+39|0039)/, '');
  return /^(3\d{8,9}|0\d{5,10})$/.test(pulito) ? pulito : null;
}

export function avviaModulo(): void {
  const form = document.getElementById('modulo') as HTMLFormElement;
  const stato = document.getElementById('stato-modulo')!;
  const invia = document.getElementById('invia') as HTMLButtonElement;
  const grazie = document.getElementById('grazie')!;
  const comune = document.getElementById('luogo-comune') as HTMLInputElement;
  const elencoComuni = document.getElementById('elenco-comuni') as HTMLDataListElement;
  const chiave = form.dataset.chiave ?? '';
  const aperturaPagina = Date.now();
  let luoghi: Luogo[] | null = null;
  let inCorso = false;

  const messaggio = (testo: string, tipo: 'info' | 'errore' = 'info') => { stato.textContent = testo; stato.dataset.tipo = tipo; };
  const campo = (nome: string) => form.elements.namedItem(nome) as HTMLInputElement;
  const valore = (nome: string) => campo(nome).value.trim();

  async function caricaLuoghi(): Promise<Luogo[]> {
    if (luoghi) return luoghi;
    const r = await fetch(form.dataset.luoghi!);
    const { luoghi: righe } = (await r.json()) as { luoghi: [string, string, string][] };
    luoghi = righe.map(([slug, nome, sigla]) => ({ slug, nome: `${nome} (${sigla})` }));
    return luoghi;
  }
  // Con tutti i comuni d'Italia si propongono solo le prime 40 corrispondenze a ciò che si scrive.
  const normalizza = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function suggerimenti(testo: string) {
    if (!luoghi) return;
    const q = normalizza(testo.trim());
    if (q.length < 2) { elencoComuni.innerHTML = ''; return; }
    const inizio: Luogo[] = [], dentro: Luogo[] = [];
    for (const l of luoghi) {
      const n = normalizza(l.nome);
      if (n.startsWith(q)) inizio.push(l); else if (n.includes(q)) dentro.push(l);
      if (inizio.length >= 40) break;
    }
    elencoComuni.innerHTML = inizio.concat(dentro).slice(0, 40).map((l) => { const o = document.createElement('option'); o.value = l.nome; return o.outerHTML; }).join('');
  }
  comune.addEventListener('focus', () => { caricaLuoghi().catch(() => {}); }, { once: true });
  comune.addEventListener('input', () => { caricaLuoghi().then(() => suggerimenti(comune.value)).catch(() => {}); });

  function segnala(el: HTMLElement | null, testo: string): false {
    messaggio(testo, 'errore');
    el?.focus();
    el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return false;
  }

  async function controlla(): Promise<{ codiceLuogo: string } | false> {
    for (const nome of ['nome', 'cognome', 'organizzatore', 'titolo', 'posto', 'indirizzo']) {
      if (!valore(nome)) return segnala(campo(nome), 'Manca qualche dato: ti ho portato al primo campo da compilare.');
    }
    if (!telefonoValido(valore('cellulare'))) return segnala(campo('cellulare'), 'Il cellulare non sembra corretto. Scrivi un numero italiano, per esempio con 10 cifre.');
    if (!valore('categoria')) return segnala(campo('categoria'), 'Scegli che tipo di evento è.');

    let codiceLuogo = '';
    try {
      const elenco = await caricaLuoghi();
      const trovato = elenco.find((l) => l.nome.toLowerCase() === valore('luogo_comune').toLowerCase());
      if (!trovato) return segnala(comune, 'Scegli il comune o la frazione dai suggerimenti.');
      codiceLuogo = trovato.slug;
    } catch {
      if (!valore('luogo_comune')) return segnala(comune, 'Scrivi il comune.');
    }

    const inizio = valore('data_inizio'); const fine = valore('data_fine');
    if (!inizio) return segnala(campo('data_inizio'), 'Scegli la data di inizio.');
    if (fine && fine < inizio) return segnala(campo('data_fine'), 'La data di fine è prima di quella di inizio.');
    if (fine && fine === inizio && valore('ora_inizio') && valore('ora_fine') && valore('ora_fine') < valore('ora_inizio')) return segnala(campo('ora_fine'), "L'ora di fine è prima di quella di inizio.");
    if (valore('descrizione').length < 30) return segnala(campo('descrizione'), 'La descrizione è troppo corta: scrivi almeno 2-3 righe.');
    if (!form.querySelector<HTMLInputElement>('input[name="ingresso"]:checked')) return segnala(form.querySelector('input[name="ingresso"]'), "Indica se l'ingresso è gratuito o a pagamento.");
    if (valore('link') && !/^https?:\/\/\S+\.\S+/.test(valore('link'))) return segnala(campo('link'), 'Il link deve cominciare con https://');
    if (!campo('consenso').checked) return segnala(campo('consenso'), "Per inviare serve spuntare l'informativa privacy.");
    return { codiceLuogo };
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (inCorso) return;
    messaggio('');
    const esito = await controlla();
    if (!esito) return;

    // Trappola per i programmi: se il campo nascosto è compilato, o è passato troppo poco tempo, fingiamo che sia andato bene senza inviare nulla.
    if (valore('sito_web') || Date.now() - aperturaPagina < ATTESA_MINIMA_MS) { mostraGrazie(); return; }
    if (!chiave) { messaggio('Il modulo non è ancora attivo. Scrivi per email, trovi l\'indirizzo qui sopra.', 'errore'); return; }

    const telefono = telefonoValido(valore('cellulare'))!;
    const dati: Record<string, string> = {
      access_key: chiave,
      subject: `LiveLocal – evento da verificare: ${valore('titolo')}`,
      from_name: 'LiveLocal – segnalazioni',
      'CHIAMA': `+39${telefono}`,
      'Nome': valore('nome'),
      'Cognome': valore('cognome'),
      'Cellulare': valore('cellulare'),
      'Chi organizza (nome pubblico)': valore('organizzatore'),
      'Titolo': valore('titolo'),
      'Tipo di evento': valore('categoria'),
      'Comune': valore('luogo_comune'),
      'Codice luogo (per il sito)': esito.codiceLuogo,
      'Nome del posto': valore('posto'),
      'Indirizzo': valore('indirizzo'),
      'Inizio': `${formatoData(valore('data_inizio'))}${valore('ora_inizio') ? `, ore ${valore('ora_inizio')}` : ''}  [${valore('data_inizio')}${valore('ora_inizio') ? `T${valore('ora_inizio')}` : ''}]`,
      'Fine': valore('data_fine') || valore('ora_fine') ? `${valore('data_fine') ? formatoData(valore('data_fine')) : 'stesso giorno'}${valore('ora_fine') ? `, ore ${valore('ora_fine')}` : ''}` : 'non indicata',
      'Descrizione': valore('descrizione'),
      'Ingresso': `${form.querySelector<HTMLInputElement>('input[name="ingresso"]:checked')!.value}${valore('prezzo') ? ` (${valore('prezzo')})` : ''}`,
      'Link': valore('link') || 'nessuno',
      'Consenso privacy': 'sì',
    };

    inCorso = true; invia.disabled = true; invia.textContent = 'Invio in corso…';
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(dati) });
      const esitoServer = (await r.json().catch(() => ({}))) as { success?: boolean };
      if (!r.ok || !esitoServer.success) throw new Error('rifiutato');
      mostraGrazie();
    } catch {
      messaggio('Non siamo riusciti a inviare. Controlla la connessione e riprova: i dati che hai scritto sono ancora qui.', 'errore');
      invia.disabled = false; invia.textContent = 'Invia per revisione'; inCorso = false;
    }
  });

  function mostraGrazie(): void {
    form.reset();
    form.hidden = true;
    grazie.hidden = false;
    grazie.scrollIntoView({ block: 'start', behavior: 'smooth' });
    grazie.querySelector('h2')?.setAttribute('tabindex', '-1');
    (grazie.querySelector('h2') as HTMLElement | null)?.focus();
  }
}
