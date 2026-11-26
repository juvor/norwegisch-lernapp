"""Erzeugt vokabeln/pakete.js aus allen meine_vokabeln_teil*.csv.
Die App lädt diese Datei per <script> (funktioniert auch bei file://) und bietet die Pakete zum Import an.
Aufruf (im Ordner vokabeln): python -I build_pakete.py
Nach jeder Änderung an einer CSV erneut ausführen."""
import csv, glob, hashlib, json, os, re, sys

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
sys.stdout.reconfigure(encoding="utf-8")
try:
    import prioritaet  # optional: Häufigkeitsstufen-Listen
except ImportError:
    prioritaet = None
KEYS = ['ko', 'de', 'topic', 'pos', 'note', 'exKo', 'exDe']
paths = sorted(glob.glob(os.path.join(here, 'meine_vokabeln_teil*.csv')), key=lambda p: int(re.search(r'teil(\d+)', p).group(1)))
alle = set()
for path in paths:
    with open(path, encoding='utf-8-sig') as f:
        alle |= {r[0].strip() for r in csv.reader(f, delimiter=';') if r}
STUFE, unbekannt = prioritaet.stufen(alle) if prioritaet else ({}, [])
if unbekannt:
    print('Hinweis – in prioritaet.py, aber in keiner CSV:', ' '.join(unbekannt))
pakete = []
for path in sorted(glob.glob(os.path.join(here, 'meine_vokabeln_teil*.csv')), key=lambda p: int(re.search(r'teil(\d+)', p).group(1))):
    nr = re.search(r'teil(\d+)', path).group(1)
    with open(path, encoding='utf-8-sig') as f:
        reader = csv.reader(f, delimiter=';')
        next(reader)  # Kopfzeile
        raw = [[c.strip() for c in r] + [''] * (8 - len(r)) for r in reader if r and r[0].strip()]
    rows = [{k: v for k, v in zip(KEYS, r[:7]) if v} for r in raw]
    for r, rr in zip(rows, raw):
        csv_prio = int(rr[7]) if rr[7].isdigit() and 1 <= int(rr[7]) <= 5 else 3   # optionale 8. Spalte „Häufigkeit“
        r['prio'] = STUFE.get(r['ko'], csv_prio)                                     # Listen in prioritaet.py haben Vorrang
    rows.sort(key=lambda r: r['prio'])  # stabil: innerhalb einer Stufe bleibt die Reihenfolge der Notiz
    version = hashlib.sha1(json.dumps(rows, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()[:10]
    pakete.append({'id': 'teil' + nr, 'title': 'Meine Vokabeln – Teil ' + nr, 'version': version, 'rows': rows})

js = ('/* Automatisch erzeugt von build_pakete.py – nicht von Hand bearbeiten. Persönliche Daten: nicht veröffentlichen. */\n'
      'window.VOKABEL_PAKETE = ' + json.dumps(pakete, ensure_ascii=False, separators=(',', ':')) + ';\n')
with open(os.path.join(here, 'pakete.js'), 'w', encoding='utf-8') as f:
    f.write(js)
print(', '.join(f"{p['id']}: {len(p['rows'])} Karten (Version {p['version']})" for p in pakete))
from collections import Counter
print('Stufen gesamt:', dict(sorted(Counter(r['prio'] for p in pakete for r in p['rows']).items())))
