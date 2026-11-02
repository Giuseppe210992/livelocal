// Configurazione di Astro. Il sito esce come pagine statiche (HTML già pronto) nella cartella dist/.
// SITE_URL: indirizzo pubblico. BASE_PATH: sottocartella ("/livelocal" su GitHub Pages, vuota con un dominio proprio).
// Nella GitHub Action li fornisce GitHub Pages; i valori qui sotto valgono per le prove sul computer.
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.SITE_URL || 'https://giuseppe210992.github.io',
  base: (process.env.BASE_PATH ?? '/livelocal') || '/',
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory' },
});
