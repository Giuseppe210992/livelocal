#!/usr/bin/env python3
"""Censimento dei locali d'Italia (bar, pub, club, musica dal vivo) dai dati aperti di Overture Maps.

Overture Maps (overturemaps.org) pubblica un archivio libero di luoghi, con licenza CDLA Permissive 2.0 (si può salvare e riusare,
citando la fonte). Per molti locali ha il collegamento alla pagina Facebook e, a volte, il sito: da lì si possono cercare gli eventi.
Questo script legge i file pubblici su S3 senza chiavi. Per ora fa solo il CENSIMENTO: stampa quanti locali ci sono per categoria e per
regione e quanti hanno sito o pagina Facebook, e se SCRIVI=1 salva l'elenco in ricerca/locali-overture.json.gz.
Uso:  python3 scripts/scopri_locali_overture.py            (solo conteggi)
      SCRIVI=1 python3 scripts/scopri_locali_overture.py    (salva anche l'elenco)
"""
import gzip, json, os, re, sys, time, urllib.request, collections
import pyarrow.dataset as ds, pyarrow.fs as pafs, pyarrow.compute as pc

BUCKET = 'overturemaps-us-west-2'
ITALIA = dict(xmin=6.6, xmax=18.6, ymin=35.4, ymax=47.2)
# Categorie dove si fanno serate ed eventi. Il primo lancio stampa TUTTE le categorie trovate per poter correggere questo elenco.
CATEGORIE = {'bar', 'pub', 'lounge', 'music_venue', 'dance_club', 'night_club', 'nightlife', 'cocktail_bar', 'beer_bar', 'wine_bar',
             'beach_club', 'brewery', 'karaoke', 'comedy_club', 'jazz_and_blues', 'beer_garden', 'irish_pub', 'sports_bar', 'live_music_venue', 'concert_hall'}
CONFIDENZA_MIN = float(os.environ.get('CONFIDENZA_MIN', '0.6'))

def ultima_release() -> str:
    url = f'https://{BUCKET}.s3.us-west-2.amazonaws.com/?list-type=2&prefix=release/&delimiter=/'
    xml = urllib.request.urlopen(url, timeout=60).read().decode()
    return sorted(re.findall(r'<Prefix>release/([^<]+)/</Prefix>', xml))[-1]

def main() -> None:
    t0 = time.time()
    release = os.environ.get('RELEASE') or ultima_release()
    print(f'Release Overture: {release}', flush=True)
    fs = pafs.S3FileSystem(anonymous=True, region='us-west-2')
    d = ds.dataset(f'{BUCKET}/release/{release}/theme=places/type=place/', filesystem=fs)
    f = ((pc.field(('bbox', 'xmin')) > ITALIA['xmin']) & (pc.field(('bbox', 'xmax')) < ITALIA['xmax'])
         & (pc.field(('bbox', 'ymin')) > ITALIA['ymin']) & (pc.field(('bbox', 'ymax')) < ITALIA['ymax']))
    tab = d.to_table(filter=f, columns=['id', 'names', 'basic_category', 'addresses', 'websites', 'socials', 'phones', 'confidence', 'operating_status', 'bbox'])
    print(f'Luoghi nel rettangolo Italia: {tab.num_rows} ({round(time.time() - t0)} s)', flush=True)

    tutte = collections.Counter(); regioni = collections.Counter(); tenuti = []
    for r in tab.to_pylist():
        a = (r['addresses'] or [{}])[0]
        if a.get('country') != 'IT': continue
        cat = r['basic_category'] or ''
        tutte[cat] += 1
        if cat not in CATEGORIE or r['operating_status'] == 'permanently_closed' or (r['confidence'] or 0) < CONFIDENZA_MIN: continue
        socials = [s for s in (r['socials'] or []) if s]
        fb = next((s for s in socials if 'facebook.com' in s), None)
        ig = next((s for s in socials if 'instagram.com' in s), None)
        sito = (r['websites'] or [None])[0]
        b = r['bbox']
        tenuti.append({'id': r['id'], 'nome': (r['names'] or {}).get('primary'), 'cat': cat, 'comune': a.get('locality'), 'regione': a.get('region'),
                       'via': a.get('freeform'), 'cap': a.get('postcode'), 'lat': round((b['ymin'] + b['ymax']) / 2, 6), 'lon': round((b['xmin'] + b['xmax']) / 2, 6),
                       'sito': sito, 'facebook': fb, 'instagram': ig, 'confidenza': round(r['confidence'] or 0, 2)})
        regioni[a.get('region') or '?'] += 1

    print('\nLuoghi in Italia per categoria (prime 40):')
    for c, n in tutte.most_common(40): print(f'  {n:8d}  {c}{"   <-- tenuta" if c in CATEGORIE else ""}')
    per_cat = collections.Counter(x['cat'] for x in tenuti)
    print('\nLocali tenuti per categoria:'); [print(f'  {n:7d}  {c}') for c, n in per_cat.most_common()]
    print(f'\nLocali tenuti (categorie scelte, aperti, confidenza >= {CONFIDENZA_MIN}): {len(tenuti)}')
    print(f'  con sito: {sum(1 for x in tenuti if x["sito"])} | con Facebook: {sum(1 for x in tenuti if x["facebook"])} | con Instagram: {sum(1 for x in tenuti if x["instagram"])} | con almeno uno: {sum(1 for x in tenuti if x["sito"] or x["facebook"] or x["instagram"])}')
    print('Per regione:'); [print(f'  {n:7d}  {r}') for r, n in regioni.most_common(25)]
    if os.environ.get('SCRIVI') == '1':
        os.makedirs('ricerca', exist_ok=True)
        with gzip.open('ricerca/locali-overture.json.gz', 'wt', encoding='utf-8') as g:
            json.dump({'_nota': f"Locali d'Italia da Overture Maps, release {release} (licenza CDLA Permissive 2.0, © Overture Maps Foundation). Generato da scripts/scopri_locali_overture.py: non modificare a mano.", 'release': release, 'locali': tenuti}, g, ensure_ascii=False, separators=(',', ':'))
        print(f"Salvato ricerca/locali-overture.json.gz ({os.path.getsize('ricerca/locali-overture.json.gz') // 1024} KB)")
    print(f'\nFinito in {round(time.time() - t0)} s')

if __name__ == '__main__':
    main()
