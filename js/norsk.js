/* Norwegisch (Bokmål): Substantive deklinieren, Verben konjugieren, Adjektive angleichen/steigern, Zahlen.
   Eingebaute Wörter haben ausdrücklich angegebene Formen (sicher). Regeln gelten für regelmäßige Wörter. */
(function (g) {
  'use strict';
  const V = 'aeiouyæøå';
  const isV = ch => V.includes(ch);
  const syllables = w => (String(w).toLowerCase().match(/[aeiouyæøå]+/g) || []).length;
  const ART = { m: 'en', f: 'ei', n: 'et' };
  const GENUS = { m: 'maskulin (en)', f: 'feminin (ei)', n: 'neutrum (et)' };

  /* ───────── Substantive ─────────
     Eintrag: { no:'bil', g:'m'|'f'|'n', forms?:[bestimmt Sg, unbestimmt Pl, bestimmt Pl] } */
  function nounForms(e) {
    const w = e.no;
    let def, pl, defPl;
    if (e.forms) [def, pl, defPl] = e.forms;
    else if (e.g === 'n') {
      if (/e$/.test(w)) { def = w + 't'; pl = w + 'r'; defPl = w + 'ne'; }
      else { def = w + 'et'; pl = syllables(w) === 1 ? w : w + 'er'; defPl = w + 'ene'; }
    } else if (e.g === 'f') {
      if (/e$/.test(w)) { def = w.slice(0, -1) + 'a'; pl = w + 'r'; defPl = w + 'ne'; }
      else { def = w + 'a'; pl = w + 'er'; defPl = w + 'ene'; }
    } else {
      if (/e$/.test(w)) { def = w + 'n'; pl = w + 'r'; defPl = w + 'ne'; }
      else if (/er$/.test(w) && syllables(w) > 1) { def = w + 'en'; pl = w + 'e'; defPl = w.slice(0, -2) + 'erne'; }
      else { def = w + 'en'; pl = w + 'er'; defPl = w + 'ene'; }
    }
    // Feminin darf im Bokmål auch maskulin gebeugt werden (jenta / jenten)
    const defAlt = e.g === 'f' ? (e.defAlt || (/a$/.test(def) ? (/e$/.test(w) ? w + 'n' : w + 'en') : '')) : '';
    return { indef: ART[e.g] + ' ' + w, def, defAlt, pl, defPl };
  }
  const NOUN_FORMS = {
    def: { label: 'bestimmt Singular', hint: 'bilen, jenta, huset' },
    pl: { label: 'unbestimmt Plural', hint: 'biler, jenter, hus' },
    defPl: { label: 'bestimmt Plural', hint: 'bilene, jentene, husene' }
  };
  function nounAnswer(e, key) {
    const f = nounForms(e);
    if (key === 'def' && f.defAlt) return f.def + ' / ' + f.defAlt;
    return f[key];
  }

  /* ───────── Verben ─────────
     Eintrag: { inf:'spise', cls?:1|2|3|4, pres?, pret?, part?, imp? }
     Klassen der schwachen Verben: 1 -et (snakket), 2 -te (spiste), 3 -de (levde), 4 -dde (bodde); starke Verben: pret/part angeben */
  function guessClass(inf) {
    if (!/e$/.test(inf)) return 4;                         // bo, tro, nå
    const st = inf.slice(0, -1);
    if (/(v|g|ei|øy)$/.test(st)) return 3;                 // leve, prøve, bygge, eie
    const a = st[st.length - 1], b = st[st.length - 2];
    if (a && b && !isV(a) && !isV(b)) return 1;            // snakke, vaske, åpne
    return 2;                                              // spise, kjøre, høre
  }
  function verbForms(e) {
    const inf = e.inf;
    const st = /e$/.test(inf) && inf.length > 2 ? inf.slice(0, -1) : inf;
    const cls = e.cls || (e.pret ? 's' : guessClass(inf));
    const s1 = st.replace(/([^aeiouyæøå])\1$/, '$1');     // Doppelkonsonant vor -te/-de vereinfachen: begynn → begynte, bygg → bygde
    const weak = { 1: [st + 'et', st + 'et'], 2: [s1 + 'te', s1 + 't'], 3: [s1 + 'de', s1 + 'd'], 4: [st + 'dde', st + 'dd'] }[cls] || [s1 + 'te', s1 + 't'];
    const pret = e.pret || weak[0], part = e.part || weak[1];
    const pres = e.pres || inf + 'r';
    const imp = e.imp || st.replace(/(mm)$/, 'm');
    return { inf: 'å ' + inf, pres, pret, perf: 'har ' + part, plusq: 'hadde ' + part, fut: 'skal ' + inf, futK: 'kommer til å ' + inf, imp, part, cls };
  }
  const VERB_FORMS = {
    pres: { label: 'Präsens', hint: 'jeg spiser' },
    pret: { label: 'Präteritum', hint: 'jeg spiste' },
    perf: { label: 'Perfektum', hint: 'jeg har spist' },
    plusq: { label: 'Plusquamperfekt', hint: 'jeg hadde spist' },
    fut: { label: 'Futur mit skal', hint: 'jeg skal spise' },
    futK: { label: 'Futur mit kommer til å', hint: 'det kommer til å regne' },
    imp: { label: 'Imperativ', hint: 'Spis!' }
  };
  const CLASS_INFO = {
    1: 'Schwache Verben Klasse 1 (-et): meist mit Konsonantengruppe am Stammende – snakke → snakket, har snakket.',
    2: 'Schwache Verben Klasse 2 (-te): meist ein einzelner Konsonant – spise → spiste, har spist.',
    3: 'Schwache Verben Klasse 3 (-de): Stamm auf -v, -g, -ei, -øy – leve → levde, har levd.',
    4: 'Schwache Verben Klasse 4 (-dde): einsilbig, endet auf Vokal – bo → bodde, har bodd.',
    s: 'Starkes/unregelmäßiges Verb: Präteritum und Partizip muss man lernen (skrive → skrev, har skrevet).'
  };

  /* ───────── Adjektive ─────────
     Eintrag: { no:'stor', n?, pl?, komp?, sup? } */
  function adjForms(e) {
    const w = e.no;
    let n = e.n, pl = e.pl;
    if (!n) {
      if (/(ig|isk)$/.test(w)) n = w;                      // viktig, praktisk (norsk/tysk: im Lexikon)
      else if (isV(w[w.length - 1])) n = w + 'tt';          // ny → nytt, blå → blått
      else if (/[^aeiouyæøå]t$/.test(w)) n = w;             // lett, kort
      else if (/t$/.test(w)) n = w + 't';                   // hvit → hvitt
      else if (/([^aeiouyæøå])\1$/.test(w)) n = w.slice(0, -1) + 't'; // grønn → grønt
      else n = w + 't';                                     // stor → stort
    }
    if (!pl) pl = /[åe]$/.test(w) ? w : w + 'e';            // stor → store, ny → nye, blå → blå
    const komp = e.komp || (/e$/.test(w) ? w + 're' : w + 'ere');
    const sup = e.sup || (/ig$/.test(w) ? w + 'st' : /e$/.test(w) ? w + 'st' : w + 'est');
    return { m: w, n, pl, komp, sup };
  }
  const ADJ_FORMS = {
    n: { label: 'Neutrum (et …)', hint: 'et stort hus' },
    pl: { label: 'Plural / bestimmt', hint: 'store hus, det store huset' },
    komp: { label: 'Komparativ', hint: 'større' },
    sup: { label: 'Superlativ', hint: 'størst' }
  };

  /* ───────── Zahlen ───────── */
  const N0 = ['null', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten'];
  const T10 = ['', '', 'tjue', 'tretti', 'førti', 'femti', 'seksti', 'sytti', 'åtti', 'nitti'];
  function num(n) {
    if (n < 20) return N0[n];
    if (n < 100) return T10[Math.floor(n / 10)] + (n % 10 ? N0[n % 10] : '');
    if (n < 1000) { const h = Math.floor(n / 100), r = n % 100; return (h === 1 ? 'hundre' : N0[h] + ' hundre') + (r ? ' og ' + num(r) : ''); }
    if (n < 1000000) { const t = Math.floor(n / 1000), r = n % 1000; return (t === 1 ? 'tusen' : num(t) + ' tusen') + (r ? (r < 100 ? ' og ' : ' ') + num(r) : ''); }
    return String(n);
  }
  // Varianten, die ebenfalls richtig sind (syv statt sju, ett hundre …)
  function numVariants(s) {
    const out = new Set([s]);
    out.add(s.replace(/sju/g, 'syv'));
    out.add(s.replace(/^hundre/, 'ett hundre').replace(/^tusen/, 'ett tusen'));
    out.add(s.replace(/ og /g, ' '));
    return [...out];
  }
  const ORD = ['', 'første', 'andre', 'tredje', 'fjerde', 'femte', 'sjette', 'sjuende', 'åttende', 'niende', 'tiende', 'ellevte', 'tolvte', 'trettende', 'fjortende',
    'femtende', 'sekstende', 'syttende', 'attende', 'nittende', 'tjuende'];
  function ordinal(n) { if (n <= 20) return ORD[n]; if (n < 30) return 'tjue' + ORD[n - 20]; if (n === 30) return 'trettiende'; return 'tretti' + ORD[n - 30]; }
  const MONTHS = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
  const MONTHS_DE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  function clock(h, m) {
    const H = x => { const k = ((x - 1) % 12) + 1; return k === 1 ? 'ett' : num(k); };   // Uhrzeit: „klokka ett“
    const nx = h + 1;
    const map = {
      0: [H(h), 'klokka ' + H(h)], 5: ['fem over ' + H(h)], 10: ['ti over ' + H(h)], 15: ['kvart over ' + H(h)],
      20: ['ti på halv ' + H(nx), 'tjue over ' + H(h)], 25: ['fem på halv ' + H(nx)], 30: ['halv ' + H(nx)], 35: ['fem over halv ' + H(nx)],
      40: ['ti over halv ' + H(nx), 'tjue på ' + H(nx)], 45: ['kvart på ' + H(nx)], 50: ['ti på ' + H(nx)], 55: ['fem på ' + H(nx)]
    };
    return map[m];
  }
  const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function genNumber(kinds) {
    const kind = pick(kinds && kinds.length ? kinds : ['zahl', 'preis', 'uhr', 'datum']);
    if (kind === 'zahl') { const n = pick([r(0, 20), r(21, 99), r(21, 99), r(100, 999), r(1000, 9999)]); return { kind, q: n.toLocaleString('de-DE'), sub: 'Schreib die Zahl aus', answers: numVariants(num(n)), hint: '21 = tjueen, 100 = hundre, 1000 = tusen; 7 = sju (auch syv)' }; }
    if (kind === 'preis') { const n = pick([r(10, 99), r(100, 500), r(1, 9) * 100, r(2, 20) * 50]); return { kind, q: n + ' Kronen', sub: 'Preis (kroner)', answers: numVariants(num(n)).map(x => x + ' kroner'), hint: 'kr = kroner; 1 Krone = en krone' }; }
    if (kind === 'uhr') { const h = r(1, 12), m = pick([0, 5, 10, 15, 20, 25, 30, 30, 35, 40, 45, 50, 55]); return { kind, q: `${h}:${String(m).padStart(2, '0')} Uhr`, sub: 'Uhrzeit (umgangssprachlich)', answers: clock(h, m), hint: 'halv fire = 3:30 (wie im Deutschen!), kvart over = Viertel nach, ti på halv = 20 nach' }; }
    const mo = r(0, 11), d = r(1, 31);
    return { kind: 'datum', q: `${d}. ${MONTHS_DE[mo]}`, sub: 'Datum (Ordinalzahl + Monat)', answers: [ordinal(d) + ' ' + MONTHS[mo], 'den ' + ordinal(d) + ' ' + MONTHS[mo]], hint: '17. mai = syttende mai; Monate klein geschrieben' };
  }

  g.Norsk = { ART, GENUS, syllables, nounForms, nounAnswer, NOUN_FORMS, guessClass, verbForms, VERB_FORMS, CLASS_INFO, adjForms, ADJ_FORMS, num, numVariants, ordinal, clock, genNumber, MONTHS };
})(typeof window !== 'undefined' ? window : globalThis);
