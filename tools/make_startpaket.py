"""Erzeugt js/data/startpaket.js (Grundwortschatz-Startpaket) aus js/data/lexicon.js.
Aufruf (im App-Ordner): python -I tools/make_startpaket.py
Nach Änderungen am Lexikon erneut ausführen (und VERSION in sw.js erhöhen)."""
import hashlib, json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = open(os.path.join(root, 'js', 'data', 'lexicon.js'), encoding='utf-8').read()

def js_array(name):
    body = re.search(r'const ' + name + r' = (\[.*?\n  \]);', src, re.S).group(1)
    body = re.sub(r"'((?:[^'\\]|\\.)*)'", lambda m: json.dumps(m.group(1)), body)   # '…' → "…"
    body = re.sub(r'([{,]\s*)([A-Za-z]+)\s*:', r'\1"\2":', body)                      # {cls: 2} → {"cls": 2}
    body = re.sub(r',\s*([\]}])', r'\1', body)
    return json.loads(body)

ART = {'m': 'en', 'f': 'ei', 'n': 'et'}
# Grobe Themen-Zuordnung für den Startwortschatz
TOPIC = {
    'Familie': 'gutt mann venn sønn bror far mor datter søster jente kone kjæreste barn menneske nabo pike',
    'Unterwegs': 'bil by buss sykkel vei stasjon flyplass billett tog fly kart gate sted',
    'Essen': 'kopp kafé restaurant fisk eple brød egg glass kake flaske',
    'Zeit': 'dag morgen kveld time uke natt år sommer vinter måned tid klokke',
    'Gesundheit': 'fot hånd øye hode lege sykehus ansikt bein',
    'Arbeit': 'lærer student skole jobb kontor møte universitet avis',
    'Haushalt': 'stol dør seng bord vindu kjøkken bad rom hus lampe nøkkel dusj hytte',
    'Natur & Tiere': 'hund katt tre fjell dyr vær',
}
topic_of = {w: t for t, ws in TOPIC.items() for w in ws.split()}

rows = []
for no, gen, de, *forms in js_array('N'):
    r = {'ko': f'{ART[gen]} {no}', 'de': de, 'topic': topic_of.get(no, 'Alltag'), 'pos': 'Nomen', 'prio': 1}
    if forms and forms[0][1] != '–':
        r['note'] = 'unregelmäßig: ' + ', '.join(forms[0])
    rows.append(r)
for inf, de, o in js_array('VB'):
    r = {'ko': f'å {inf}', 'de': de, 'topic': 'Alltag', 'pos': 'Verb', 'prio': 1}
    if o.get('pret'):
        r['note'] = ('Modalverb: ' if o.get('modal') else 'stark: ') + ', '.join(x for x in [o.get('pres'), o['pret'], 'har ' + o['part']] if x)
    rows.append(r)
for no, de, o in js_array('AJ'):
    r = {'ko': no, 'de': de, 'topic': 'Farben & Beschreibung', 'pos': 'Adjektiv', 'prio': 1}
    if o.get('komp') or o.get('pl'):
        r['note'] = 'Formen: ' + ', '.join(x for x in [o.get('n'), o.get('pl'), o.get('komp'), o.get('sup')] if x)
    rows.append(r)

version = hashlib.sha1(json.dumps(rows, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()[:10]
paket = [{'id': 'start', 'title': 'Grundwortschatz (Startpaket)', 'version': version, 'rows': rows}]
js = ('/* Automatisch erzeugt von tools/make_startpaket.py aus lexicon.js – nicht von Hand bearbeiten. */\n'
      'window.START_PAKETE = ' + json.dumps(paket, ensure_ascii=False, separators=(',', ':')) + ';\n')
open(os.path.join(root, 'js', 'data', 'startpaket.js'), 'w', encoding='utf-8').write(js)
print(len(rows), 'Karten, Version', version)
