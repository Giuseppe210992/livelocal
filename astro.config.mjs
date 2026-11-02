// Configurazione di Astro. Il sito esce come pagine statiche (HTML già pronto) nella cartella dist/.
// SITE_URL: indirizzo pubblico (es. https://succedequi.it). BASE_PATH: sottocartella, se serve
// (es. "/succedequi" per https://utente.github.io/succedequi/). Si impostano nella GitHub Action.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://succedequi.it',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
});
