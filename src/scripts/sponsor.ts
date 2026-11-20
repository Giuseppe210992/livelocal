// Modulo «Richiedi un preventivo» per gli spazi sponsor (gira nel browser).
// I dati partono dal browser verso Web3Forms, che li gira per email al titolare del sito. Non passano dal repository.
// Si usa il modulo invece del link «mailto:», che sui computer senza programma di posta apre pagine di errore.

const ENDPOINT = 'https://api.web3forms.com/submit';
const ATTESA_MINIMA_MS = 4000; // chi compila in meno di 4 secondi è un programma, non una persona

export function avviaRichiestaSponsor(): void {
  const form = document.getElementById('richiesta-sponsor') as HTMLFormElement | null;
  if (!form) return;
  const stato = document.getElementById('stato-richiesta')!;
  const invia = document.getElementById('invia-richiesta') as HTMLButtonElement;
  const grazie = document.getElementById('grazie-richiesta')!;
  const chiave = form.dataset.chiave ?? '';
  const apertura = Date.now();
  let inCorso = false;

  const campo = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  const valore = (n: string) => campo(n).value.trim();
  const messaggio = (t: string, tipo: 'info' | 'errore' = 'info') => { stato.textContent = t; stato.dataset.tipo = tipo; };
  const segnala = (n: string, t: string): void => { messaggio(t, 'errore'); campo(n).focus(); campo(n).scrollIntoView({ block: 'center', behavior: 'smooth' }); };
  const telefonoOk = (t: string) => /^(3\d{8,9}|0\d{5,10})$/.test(t.replace(/[\s.\-()]/g, '').replace(/^(\+39|0039)/, ''));
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (inCorso) return;
    messaggio('');
    if (!valore('attivita')) return segnala('attivita', 'Scrivi il nome della tua attività.');
    if (!valore('referente')) return segnala('referente', 'Scrivi il tuo nome.');
    if (!valore('telefono') && !valore('email')) return segnala('telefono', 'Lascia un telefono o un\'email, così ti possiamo rispondere.');
    if (valore('telefono') && !telefonoOk(valore('telefono'))) return segnala('telefono', 'Il telefono non sembra corretto. Scrivi un numero italiano.');
    if (valore('email') && !emailOk(valore('email'))) return segnala('email', "L'indirizzo email non sembra corretto.");
    if (!valore('spazio')) return segnala('spazio', 'Scegli quale spazio ti interessa.');
    if (!campo('consenso').checked) return segnala('consenso', "Per inviare serve spuntare l'informativa privacy.");

    if (valore('sito_web') || Date.now() - apertura < ATTESA_MINIMA_MS) { mostraGrazie(); return; }
    if (!chiave) { messaggio('Il modulo non è ancora attivo. Scrivi all\'indirizzo email indicato qui sopra.', 'errore'); return; }

    const dati: Record<string, string> = {
      access_key: chiave,
      subject: `LiveLocal – richiesta spazio sponsor: ${valore('attivita')}`,
      from_name: 'LiveLocal – sponsor',
      'Attività': valore('attivita'),
      'Referente': valore('referente'),
      'Telefono': valore('telefono') || 'non indicato',
      'Email': valore('email') || 'non indicata',
      'Spazio di interesse': valore('spazio'),
      'Zona o territorio': valore('zona') || 'non indicata',
      'Periodo': valore('periodo') || 'non indicato',
      'Messaggio': valore('messaggio') || 'nessuno',
      'Consenso privacy': 'sì',
    };
    if (valore('email')) dati.replyto = valore('email');

    inCorso = true; invia.disabled = true; invia.textContent = 'Invio in corso…';
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(dati) });
      const esito = (await r.json().catch(() => ({}))) as { success?: boolean };
      if (!r.ok || !esito.success) throw new Error('rifiutato');
      mostraGrazie();
    } catch {
      messaggio('Non siamo riusciti a inviare. Controlla la connessione e riprova: i dati che hai scritto sono ancora qui.', 'errore');
      invia.disabled = false; invia.textContent = 'Invia la richiesta'; inCorso = false;
    }
  });

  function mostraGrazie(): void {
    form.reset(); form.hidden = true; grazie.hidden = false;
    grazie.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }
}
