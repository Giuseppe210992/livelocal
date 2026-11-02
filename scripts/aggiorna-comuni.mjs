// Rigenera src/data/territorio.json: regioni, province e comuni con codice ISTAT e coordinate del centro.
// Fonte: confini ufficiali ISTAT, distribuiti da Openpolis (geojson-italy) con licenza CC BY 4.0.
// Le coordinate sono il baricentro del territorio comunale: vanno bene per "parti da questo comune",
// non per indicare un luogo preciso.
//
// Uso:  node scripts/aggiorna-comuni.mjs
// Per aggiungere una regione: aggiungi il suo codice ISTAT a REGIONI (es. 13 = Abruzzo) e rilancia.

import { writeFileSync } from 'node:fs';

const REGIONI = [12, 15]; // 12 = Lazio, 15 = Campania
const BASE = 'https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson';

/** Testo per gli indirizzi: minuscolo, senza accenti, parole separate da trattini. */
function slug(testo) {
  return testo
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’`]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Baricentro di un poligono (o multipoligono) in coordinate geografiche. */
function baricentro(geometria) {
  const poligoni = geometria.type === 'Polygon' ? [geometria.coordinates] : geometria.coordinates;
  let area = 0, x = 0, y = 0;
  for (const poligono of poligoni) {
    const anello = poligono[0]; // solo il contorno esterno
    for (let i = 0, j = anello.length - 1; i < anello.length; j = i++) {
      const [x0, y0] = anello[j];
      const [x1, y1] = anello[i];
      const f = x0 * y1 - x1 * y0;
      area += f;
      x += (x0 + x1) * f;
      y += (y0 + y1) * f;
    }
  }
  area *= 0.5;
  return { lat: +(y / (6 * area)).toFixed(5), lon: +(x / (6 * area)).toFixed(5) };
}

const regioni = [];
const province = new Map();
const comuni = [];

for (const codice of REGIONI) {
  const risposta = await fetch(`${BASE}/limits_R_${codice}_municipalities.geojson`);
  if (!risposta.ok) throw new Error(`Download regione ${codice} non riuscito: ${risposta.status}`);
  const dati = await risposta.json();
  const primo = dati.features[0].properties;
  regioni.push({ codiceIstat: primo.reg_istat_code, nome: primo.reg_name, slug: slug(primo.reg_name) });

  for (const { properties: p, geometry } of dati.features) {
    if (!province.has(p.prov_istat_code)) {
      province.set(p.prov_istat_code, {
        codiceIstat: p.prov_istat_code,
        sigla: p.prov_acr,
        nome: p.prov_name,
        slug: slug(p.prov_name),
        tipo: p.prov_tipo_uts === 'Città metropolitana' ? 'Città metropolitana' : 'Provincia',
        regione: p.reg_istat_code,
      });
    }
    comuni.push({
      codiceIstat: p.com_istat_code,
      codiceCatastale: p.com_catasto_code,
      nome: p.name,
      slug: slug(p.name),
      provincia: p.prov_istat_code,
      ...baricentro(geometry),
    });
  }
}

// Controllo: due comuni della stessa provincia non possono avere lo stesso indirizzo.
const visti = new Set();
for (const c of comuni) {
  const chiave = `${c.provincia}/${c.slug}`;
  if (visti.has(chiave)) throw new Error(`Indirizzo doppio: ${chiave}`);
  visti.add(chiave);
}

comuni.sort((a, b) => a.codiceIstat.localeCompare(b.codiceIstat));
const uscita = {
  _fonte: 'Confini ISTAT al 1 gennaio 2026, distribuiti da Openpolis geojson-italy (CC BY 4.0). Coordinate = baricentro del territorio comunale.',
  _generato: new Date().toISOString().slice(0, 10),
  regioni,
  province: [...province.values()].sort((a, b) => a.codiceIstat.localeCompare(b.codiceIstat)),
  comuni,
};
writeFileSync(new URL('../src/data/territorio.json', import.meta.url), JSON.stringify(uscita, null, 0).replace(/\},\{/g, '},\n{') + '\n');
console.log(`Scritti ${regioni.length} regioni, ${uscita.province.length} province, ${comuni.length} comuni.`);
