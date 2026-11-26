/* Grammatik Norwegisch (Bokmål) – eigene Erklärungen, Reihenfolge nach üblicher Kursprogression A1 → B1.
   level: 1 = A1, 2 = A2, 3 = B1
   s   = Beispielsätze [Norwegisch, Deutsch]
   err = Fehlersätze [falsch, richtig, Index des falschen Wortes, Hinweis]
   ch  = Lückensätze [Satz mit ___, Optionen, richtige Option, Deutsch]
   drill = automatisch erzeugte Übungen: verb / noun / adj / numbers */
(function (g) {
  'use strict';
  const P = [];
  const add = o => P.push(o);

  /* ───────────── A1 ───────────── */
  add({
    id: 'vaere', level: 1, title: 'Personalpronomen, være & ha',
    summary: 'jeg er, du har … – die wichtigsten Verben und Pronomen.',
    explain: `<table><tr><th>Person</th><th>Pronomen</th><th>være (sein)</th><th>ha (haben)</th></tr>
<tr><td>ich</td><td>jeg</td><td rowspan="8"><b>er</b></td><td rowspan="8"><b>har</b></td></tr>
<tr><td>du</td><td>du</td></tr><tr><td>er / sie / es</td><td>han / hun / den, det</td></tr>
<tr><td>wir</td><td>vi</td></tr><tr><td>ihr</td><td>dere</td></tr><tr><td>sie</td><td>de</td></tr><tr><td>Sie (höflich)</td><td>De (selten)</td></tr><tr><td>man</td><td>man</td></tr></table>
<p>Gute Nachricht: <b>Verben werden nicht nach Personen gebeugt</b> – jeg er, du er, vi er … Im Präsens endet fast jedes Verb auf <b>-r</b>.</p>
<p><b>den</b> = es (für en-/ei-Wörter), <b>det</b> = es (für et-Wörter und allgemein: Det regner).</p>`,
    drill: { kind: 'verb', forms: ['pres'], only: ['være', 'ha', 'gå', 'komme', 'se', 'si', 'gjøre', 'vite', 'spørre', 'bli'] },
    s: [['Jeg er fra Tyskland.', 'Ich komme aus Deutschland.'], ['Hun har en hund.', 'Sie hat einen Hund.'], ['Vi er studenter.', 'Wir sind Studenten.'],
      ['Har du tid i dag?', 'Hast du heute Zeit?'], ['De er veldig hyggelige.', 'Sie sind sehr nett.'], ['Det er kaldt i dag.', 'Heute ist es kalt.']],
    err: [['Jeg ere student.', 'Jeg er student.', 1, 'være heißt im Präsens für alle Personen „er“.'],
      ['Vi har ikke tid har.', 'Vi har ikke tid.', 4, 'Das Verb steht nur einmal – an zweiter Stelle.']],
    ch: [['Hun ___ to barn.', ['har', 'er', 'hare'], 'har', 'Sie hat zwei Kinder.'], ['___ er lærer. (er)', ['Han', 'Hun', 'Den'], 'Han', 'Er ist Lehrer.']]
  });

  add({
    id: 'genus', level: 1, title: 'Substantive: en, ei, et',
    summary: 'Drei Geschlechter und der unbestimmte Artikel.',
    explain: `<p>Jedes Nomen hat ein Geschlecht – lerne es immer mit Artikel:</p>
<table><tr><th>Geschlecht</th><th>Artikel</th><th>Beispiel</th></tr>
<tr><td>maskulin</td><td><b>en</b></td><td>en bil, en gutt</td></tr>
<tr><td>feminin</td><td><b>ei</b></td><td>ei jente, ei bok</td></tr>
<tr><td>neutrum</td><td><b>et</b></td><td>et hus, et barn</td></tr></table>
<p>Im Bokmål darf man feminine Wörter auch maskulin behandeln: <b>en bok</b> ist ebenfalls richtig. Etwa 75 % der Nomen sind maskulin – im Zweifel „en“.</p>
<p>Berufe und Nationalitäten nach <b>være/bli</b> stehen ohne Artikel: Jeg er <b>lærer</b>.</p>`,
    s: [['Jeg har en bil.', 'Ich habe ein Auto.'], ['Hun leser ei bok.', 'Sie liest ein Buch.'], ['Vi bor i et stort hus.', 'Wir wohnen in einem großen Haus.'],
      ['Han er lege.', 'Er ist Arzt.'], ['Det er et eple på bordet.', 'Auf dem Tisch liegt ein Apfel.']],
    err: [['Jeg har et bil.', 'Jeg har en bil.', 2, 'bil ist maskulin → en bil.'],
      ['Han er en lærer.', 'Han er lærer.', 2, 'Beruf nach være: ohne Artikel → Han er lærer.']],
    ch: [['Jeg bor i ___ hus.', ['et', 'en', 'ei'], 'et', 'Ich wohne in einem Haus.'], ['Hun har ___ hund.', ['en', 'et'], 'en', 'Sie hat einen Hund.'],
      ['Det er ___ barn i parken.', ['et', 'en', 'ei'], 'et', 'Im Park ist ein Kind.']]
  });

  add({
    id: 'bestemt', level: 1, title: 'Bestimmte Form Singular',
    summary: 'Der Artikel wird angehängt: bilen, jenta, huset.',
    explain: `<p>Der bestimmte Artikel („der/die/das“) steht im Norwegischen <b>hinten am Wort</b>:</p>
<table><tr><th></th><th>unbestimmt</th><th>bestimmt</th></tr>
<tr><td>maskulin</td><td>en bil</td><td>bil<b>en</b></td></tr>
<tr><td>feminin</td><td>ei jente</td><td>jent<b>a</b> (auch: jenten)</td></tr>
<tr><td>neutrum</td><td>et hus</td><td>hus<b>et</b></td></tr></table>
<p>Endet das Wort auf -e, fällt ein e weg: en time → time<b>n</b>, et eple → eple<b>t</b>, ei jente → jent<b>a</b>.</p>`,
    drill: { kind: 'noun', forms: ['def'] },
    s: [['Bilen er ny.', 'Das Auto ist neu.'], ['Jenta heter Ingrid.', 'Das Mädchen heißt Ingrid.'], ['Huset ligger ved sjøen.', 'Das Haus liegt am Meer.'],
      ['Hvor er nøkkelen?', 'Wo ist der Schlüssel?'], ['Eplet er søtt.', 'Der Apfel ist süß.']],
    err: [['Bilet er ny.', 'Bilen er ny.', 0, 'bil ist maskulin → bilen.'],
      ['Hvor er barnen?', 'Hvor er barnet?', 2, 'et barn ist Neutrum → barnet.']],
    ch: [['___ er ny. (Das Auto)', ['Bilen', 'Bilet', 'Bila'], 'Bilen'], ['Hvor er ___? (das Kind)', ['barnet', 'barnen', 'barna'], 'barnet']]
  });

  add({
    id: 'flertall', level: 1, title: 'Plural: biler – bilene',
    summary: 'Unbestimmter und bestimmter Plural.',
    explain: `<table><tr><th></th><th>Singular</th><th>Plural unbestimmt</th><th>Plural bestimmt</th></tr>
<tr><td>maskulin</td><td>en bil</td><td>bil<b>er</b></td><td>bil<b>ene</b></td></tr>
<tr><td>feminin</td><td>ei jente</td><td>jente<b>r</b></td><td>jente<b>ne</b></td></tr>
<tr><td>neutrum, einsilbig</td><td>et hus</td><td><b>hus</b> (keine Endung!)</td><td>hus<b>ene</b></td></tr>
<tr><td>neutrum, mehrsilbig</td><td>et eple</td><td>eple<b>r</b></td><td>eple<b>ne</b></td></tr></table>
<p><b>Unregelmäßig:</b> mann → menn, bok → bøker, fot → føtter, hånd → hender, barn → barn/barna, bror → brødre, øye → øyne.</p>
<p>Nomen auf -er (lærer): lærere – lærerne.</p>`,
    drill: { kind: 'noun', forms: ['pl', 'defPl'] },
    s: [['Vi har to biler.', 'Wir haben zwei Autos.'], ['Barna leker ute.', 'Die Kinder spielen draußen.'], ['Det er mange hus her.', 'Hier gibt es viele Häuser.'],
      ['Bøkene ligger på bordet.', 'Die Bücher liegen auf dem Tisch.'], ['Tre menn står ved døra.', 'Drei Männer stehen an der Tür.']],
    err: [['Vi har tre huser.', 'Vi har tre hus.', 3, 'Einsilbige Neutra haben im Plural keine Endung: hus.'],
      ['Jeg har to bokene.', 'Jeg har to bøker.', 3, 'Nach Zahlen: unbestimmter Plural – und bok → bøker.']]
  });

  add({
    id: 'presens', level: 1, title: 'Präsens: -r',
    summary: 'Infinitiv + r – für alle Personen gleich.',
    explain: `<p>Präsens = Infinitiv + <b>r</b>: å spise → spise<b>r</b>, å bo → bo<b>r</b>, å snakke → snakke<b>r</b>.</p>
<p><b>Ausnahmen:</b> være → <b>er</b>, gjøre → <b>gjør</b>, spørre → <b>spør</b>, vite → <b>vet</b>, si → <b>sier</b>.<br>
Modalverben: kan, vil, skal, må, bør (ohne -r!).</p>
<p>Das Präsens beschreibt auch die nahe Zukunft: I morgen <b>reiser</b> jeg til Oslo.</p>`,
    drill: { kind: 'verb', forms: ['pres'] },
    s: [['Jeg snakker litt norsk.', 'Ich spreche ein bisschen Norwegisch.'], ['Hun bor i Bergen.', 'Sie wohnt in Bergen.'], ['Hva gjør du?', 'Was machst du?'],
      ['Vi spiser middag klokka fem.', 'Wir essen um fünf zu Abend.'], ['Vet du hvor stasjonen er?', 'Weißt du, wo der Bahnhof ist?']],
    err: [['Hun spiseer frokost.', 'Hun spiser frokost.', 1, 'Präsens = Infinitiv + r: spiser.'],
      ['Jeg gjører lekser.', 'Jeg gjør lekser.', 1, 'Unregelmäßig: gjøre → gjør.']]
  });

  add({
    id: 'ordstilling', level: 1, title: 'Wortstellung: Verb an Position 2',
    summary: 'Inversion: I dag spiser jeg …',
    explain: `<p>Im Hauptsatz steht das Verb (wie im Deutschen) an <b>zweiter Stelle</b>. Beginnt der Satz mit etwas anderem als dem Subjekt, kommt das Subjekt hinter das Verb (<b>Inversion</b>):</p>
<table><tr><th>1</th><th>2 (Verb)</th><th>Subjekt</th><th>Rest</th></tr>
<tr><td>Jeg</td><td><b>spiser</b></td><td></td><td>fisk i dag.</td></tr>
<tr><td>I dag</td><td><b>spiser</b></td><td>jeg</td><td>fisk.</td></tr>
<tr><td>Hva</td><td><b>spiser</b></td><td>du?</td><td></td></tr></table>
<p>Anders als im Deutschen steht ein zweites Verb <b>nicht</b> am Ende: Jeg <b>vil</b> <b>spise</b> fisk (nicht: Jeg vil fisk spise).</p>`,
    s: [['I dag skinner sola.', 'Heute scheint die Sonne.'], ['Om sommeren reiser vi til Norge.', 'Im Sommer reisen wir nach Norwegen.'],
      ['Nå må jeg gå.', 'Jetzt muss ich gehen.'], ['Jeg vil lære norsk.', 'Ich will Norwegisch lernen.'], ['I morgen jobber hun hjemme.', 'Morgen arbeitet sie zu Hause.']],
    err: [['I dag jeg jobber hjemme.', 'I dag jobber jeg hjemme.', 2, 'Verb an Position 2: I dag jobber jeg …'],
      ['Jeg vil norsk lære.', 'Jeg vil lære norsk.', 2, 'Kein Verb am Satzende wie im Deutschen: vil lære norsk.']]
  });

  add({
    id: 'ikke', level: 1, title: 'Verneinung mit ikke',
    summary: 'ikke steht hinter dem (ersten) Verb.',
    explain: `<p><b>ikke</b> = nicht/kein. Im Hauptsatz steht es <b>direkt nach dem Verb</b>:</p>
<p>Jeg snakker <b>ikke</b> tysk. · Jeg <b>kan ikke</b> komme. · Jeg har <b>ikke</b> tid.</p>
<p>Bei Inversion nach dem Subjekt: I dag jobber jeg <b>ikke</b>.<br>„kein“ = meist auch <b>ikke</b>: Jeg har ikke bil. (Alternativ: ingen = niemand/kein.)</p>
<p>Im Nebensatz steht ikke <b>vor</b> dem Verb – siehe Lektion Nebensätze.</p>`,
    s: [['Jeg forstår ikke.', 'Ich verstehe nicht.'], ['Hun drikker ikke kaffe.', 'Sie trinkt keinen Kaffee.'], ['Vi kan ikke komme i kveld.', 'Wir können heute Abend nicht kommen.'],
      ['I dag regner det ikke.', 'Heute regnet es nicht.'], ['Jeg har ikke tid nå.', 'Ich habe jetzt keine Zeit.']],
    err: [['Jeg ikke forstår.', 'Jeg forstår ikke.', 1, 'Im Hauptsatz: ikke nach dem Verb.'],
      ['Han kan komme ikke.', 'Han kan ikke komme.', 3, 'ikke steht nach dem ersten Verb (kan).']]
  });

  add({
    id: 'sporsmal', level: 1, title: 'Fragen & Fragewörter',
    summary: 'Ja/Nein-Fragen durch Umstellung, W-Fragen mit hv-.',
    explain: `<p><b>Ja/Nein-Frage:</b> Verb an den Anfang: <b>Snakker</b> du norsk?</p>
<table><tr><th>Fragewort</th><th>Bedeutung</th></tr>
<tr><td>hva</td><td>was</td></tr><tr><td>hvem</td><td>wer</td></tr><tr><td>hvor</td><td>wo / wie (+ Adj.)</td></tr><tr><td>hvor mye / hvor mange</td><td>wie viel / wie viele</td></tr>
<tr><td>når</td><td>wann</td></tr><tr><td>hvorfor</td><td>warum</td></tr><tr><td>hvordan</td><td>wie</td></tr><tr><td>hvilken / hvilket / hvilke</td><td>welche(r/s)</td></tr></table>
<p>Antwort auf eine verneinte Frage: <b>jo</b> (= doch). Snakker du ikke norsk? – <b>Jo</b>, litt!</p>`,
    s: [['Hva heter du?', 'Wie heißt du?'], ['Hvor bor du?', 'Wo wohnst du?'], ['Når kommer bussen?', 'Wann kommt der Bus?'], ['Hvor mye koster det?', 'Wie viel kostet das?'],
      ['Hvorfor lærer du norsk?', 'Warum lernst du Norwegisch?'], ['Snakker du engelsk?', 'Sprichst du Englisch?']],
    err: [['Hva du heter?', 'Hva heter du?', 1, 'In Fragen: Fragewort – Verb – Subjekt.'],
      ['Hvor du bor?', 'Hvor bor du?', 1, 'In Fragen: Fragewort – Verb – Subjekt.']],
    ch: [['___ kommer du fra? (Woher)', ['Hvor', 'Hva', 'Når'], 'Hvor'], ['Snakker du ikke norsk? – ___, litt.', ['Jo', 'Ja', 'Nei'], 'Jo'],
      ['___ mange barn har du?', ['Hvor', 'Hvordan', 'Hva'], 'Hvor']]
  });

  add({
    id: 'adjektiv', level: 1, title: 'Adjektive: stor – stort – store',
    summary: 'Das Adjektiv passt sich an Geschlecht und Zahl an.',
    explain: `<table><tr><th></th><th>Form</th><th>Beispiel</th></tr>
<tr><td>en / ei</td><td>Grundform</td><td>en <b>stor</b> bil, ei <b>stor</b> jente</td></tr>
<tr><td>et</td><td>+ <b>t</b></td><td>et <b>stort</b> hus</td></tr>
<tr><td>Plural</td><td>+ <b>e</b></td><td><b>store</b> hus</td></tr></table>
<p>Das gilt auch nach være: Huset er <b>stort</b>. Bilene er <b>store</b>.</p>
<p><b>Ohne -t:</b> Adjektive auf -ig und -isk (viktig, praktisk), norsk/tysk, und auf Konsonant + t (lett, kort).<br>
Auf Vokal: ny → nytt, blå → blått. Doppelkonsonant: grønn → grønt.<br>
<b>Unregelmäßig:</b> liten – lite – små, gammel – gammelt – gamle.</p>`,
    drill: { kind: 'adj', forms: ['n', 'pl'] },
    s: [['Vi har et stort hus.', 'Wir haben ein großes Haus.'], ['Bilen er ny.', 'Das Auto ist neu.'], ['Barna er glade.', 'Die Kinder sind froh.'],
      ['Det er et viktig spørsmål.', 'Das ist eine wichtige Frage.'], ['Hun har mange små barn.', 'Sie hat viele kleine Kinder.']],
    err: [['Huset er stor.', 'Huset er stort.', 2, 'et hus → stort (Neutrum + t).'],
      ['Vi har to nytt biler.', 'Vi har to nye biler.', 3, 'Plural → nye.']],
    ch: [['et ___ eple (rot)', ['rødt', 'rød', 'røde'], 'rødt'], ['Bøkene er ___. (neu)', ['nye', 'nytt', 'ny'], 'nye'], ['et ___ problem (wichtig)', ['viktig', 'viktigt', 'viktige'], 'viktig']]
  });

  add({
    id: 'eiendom', level: 1, title: 'Possessivpronomen: min, mitt, mine',
    summary: 'Besitz – meist nachgestellt: boka mi, huset mitt.',
    explain: `<table><tr><th></th><th>en-Wort</th><th>ei-Wort</th><th>et-Wort</th><th>Plural</th></tr>
<tr><td>mein</td><td>min</td><td>mi</td><td>mitt</td><td>mine</td></tr>
<tr><td>dein</td><td>din</td><td>di</td><td>ditt</td><td>dine</td></tr>
<tr><td>unser</td><td>vår</td><td>vår</td><td>vårt</td><td>våre</td></tr>
<tr><td>sein / ihr / euer / ihr</td><td colspan="4">hans / hennes / deres / deres (unverändert)</td></tr></table>
<p>Meist <b>nach</b> dem Nomen in bestimmter Form: bil<b>en min</b>, bok<b>a mi</b>, hus<b>et mitt</b>, barn<b>a mine</b>. Davor (min bil) klingt betonend.</p>`,
    s: [['Bilen min er gammel.', 'Mein Auto ist alt.'], ['Hvor er boka mi?', 'Wo ist mein Buch?'], ['Huset vårt ligger i sentrum.', 'Unser Haus liegt im Zentrum.'],
      ['Barna mine heter Ola og Kari.', 'Meine Kinder heißen Ola und Kari.'], ['Er dette jakka di?', 'Ist das deine Jacke?']],
    err: [['Huset min er stort.', 'Huset mitt er stort.', 1, 'et hus → mitt.'],
      ['Barna min er små.', 'Barna mine er små.', 1, 'Plural → mine.']],
    ch: [['rommet ___ (mein)', ['mitt', 'min', 'mine'], 'mitt'], ['vennene ___ (dein)', ['dine', 'din', 'ditt'], 'dine'], ['bilen ___ (unser)', ['vår', 'vårt', 'våre'], 'vår']]
  });

  add({
    id: 'modal', level: 1, title: 'Modalverben: kan, vil, skal, må, bør',
    summary: 'Modalverb + Infinitiv ohne å.',
    explain: `<table><tr><th>Infinitiv</th><th>Präsens</th><th>Präteritum</th><th>Bedeutung</th></tr>
<tr><td>kunne</td><td><b>kan</b></td><td>kunne</td><td>können</td></tr>
<tr><td>ville</td><td><b>vil</b></td><td>ville</td><td>wollen</td></tr>
<tr><td>skulle</td><td><b>skal</b></td><td>skulle</td><td>sollen; werden (Plan)</td></tr>
<tr><td>måtte</td><td><b>må</b></td><td>måtte</td><td>müssen</td></tr>
<tr><td>burde</td><td><b>bør</b></td><td>burde</td><td>sollte</td></tr></table>
<p>Danach steht der Infinitiv <b>ohne å</b>: Jeg kan <b>snakke</b> norsk. Achtung: <b>må ikke</b> = darf nicht!</p>`,
    drill: { kind: 'verb', forms: ['pres', 'pret'], only: ['kunne', 'ville', 'skulle', 'måtte', 'burde'] },
    s: [['Jeg kan snakke litt norsk.', 'Ich kann ein bisschen Norwegisch.'], ['Vil du ha kaffe?', 'Möchtest du Kaffee?'], ['Vi skal reise til Tromsø.', 'Wir werden nach Tromsø reisen.'],
      ['Du må ikke røyke her.', 'Du darfst hier nicht rauchen.'], ['Du bør gå til legen.', 'Du solltest zum Arzt gehen.']],
    err: [['Jeg kan å svømme.', 'Jeg kan svømme.', 2, 'Nach Modalverben steht kein å.'],
      ['Hun vile komme.', 'Hun vil komme.', 1, 'Präsens von ville: vil.']],
    ch: [['Du ___ ikke parkere her. (darfst nicht)', ['må', 'kan', 'vil'], 'må']]
  });

  add({
    id: 'tall', level: 1, title: 'Zahlen & Uhrzeit',
    summary: 'en, to, tre … und „halv fire“.',
    explain: `<p>1 en · 2 to · 3 tre · 4 fire · 5 fem · 6 seks · 7 sju (syv) · 8 åtte · 9 ni · 10 ti · 11 elleve · 12 tolv · 13 tretten · 20 tjue · 21 tjueen · 30 tretti · 40 førti · 50 femti · 100 hundre · 1000 tusen</p>
<p><b>Uhrzeit:</b> Hva er klokka? – Klokka er tre. · <b>kvart over</b> tre (3:15) · <b>halv fire</b> (3:30 – wie im Deutschen!) · <b>kvart på</b> fire (3:45) · ti på halv fire (3:20) · fem over halv fire (3:35).</p>
<p><b>Datum</b> mit Ordinalzahlen: den <b>syttende</b> mai (17. Mai). Monate und Wochentage klein: mandag, januar.</p>`,
    drill: { kind: 'numbers' },
    s: [['Klokka er halv fire.', 'Es ist halb vier.'], ['Det koster femti kroner.', 'Das kostet fünfzig Kronen.'], ['Jeg er trettifem år gammel.', 'Ich bin fünfunddreißig Jahre alt.'],
      ['Bussen kommer kvart over åtte.', 'Der Bus kommt um Viertel nach acht.'], ['Bursdagen min er den tredje mai.', 'Mein Geburtstag ist am dritten Mai.']],
    err: [['Klokka er tre og halv.', 'Klokka er halv fire.', 2, '3:30 = halv fire (halb vier) – wie im Deutschen.'],
      ['Det koster fem og tjue kroner.', 'Det koster tjuefem kroner.', 2, 'Zehner vor Einer: tjuefem (25).']]
  });

  add({
    id: 'preposisjon', level: 1, title: 'Präpositionen: i, på, til, fra, med',
    summary: 'Wo? Wohin? – die häufigsten Präpositionen.',
    explain: `<table><tr><th>Präposition</th><th>Gebrauch</th><th>Beispiel</th></tr>
<tr><td><b>i</b></td><td>in (Länder, Städte, Räume), Zeit</td><td>i Norge, i Oslo, i stua, i dag</td></tr>
<tr><td><b>på</b></td><td>auf; an Orten/Veranstaltungen</td><td>på bordet, på jobb, på kino, på butikken</td></tr>
<tr><td><b>til</b></td><td>nach, zu (Richtung)</td><td>til Bergen, til legen</td></tr>
<tr><td><b>fra</b></td><td>von, aus</td><td>fra Tyskland</td></tr>
<tr><td><b>med</b></td><td>mit</td><td>med buss, med venner</td></tr>
<tr><td><b>hos</b></td><td>bei (Person)</td><td>hos legen, hos meg</td></tr></table>
<p><b>hjemme</b> = zu Hause (wo?), <b>hjem</b> = nach Hause (wohin?).</p>`,
    s: [['Jeg bor i Norge.', 'Ich wohne in Norwegen.'], ['Hun er på jobb.', 'Sie ist auf der Arbeit.'], ['Vi reiser til Bergen med tog.', 'Wir fahren mit dem Zug nach Bergen.'],
      ['Han er hos legen.', 'Er ist beim Arzt.'], ['Jeg går hjem nå.', 'Ich gehe jetzt nach Hause.']],
    err: [['Jeg er på Norge.', 'Jeg er i Norge.', 2, 'Länder → i.'],
      ['Jeg går hjemme nå.', 'Jeg går hjem nå.', 2, 'Richtung (wohin) → hjem.']],
    ch: [['Vi går ___ kino. (ins Kino)', ['på', 'i', 'til'], 'på'], ['Han kommer ___ Tyskland.', ['fra', 'til', 'med'], 'fra'], ['Jeg reiser ___ fly.', ['med', 'på', 'hos'], 'med'],
      ['Jeg er ___ i kveld. (zu Hause)', ['hjemme', 'hjem'], 'hjemme']]
  });

  /* ───────────── A2 ───────────── */
  add({
    id: 'preteritum', level: 2, title: 'Präteritum der schwachen Verben',
    summary: 'Vier Gruppen: -et, -te, -de, -dde.',
    explain: `<table><tr><th>Klasse</th><th>Präteritum</th><th>Perfekt</th><th>typisch</th></tr>
<tr><td>1</td><td>snakk<b>et</b></td><td>har snakk<b>et</b></td><td>Konsonantengruppe: snakke, vaske, jobbe</td></tr>
<tr><td>2</td><td>spis<b>te</b></td><td>har spis<b>t</b></td><td>ein Konsonant: spise, kjøre, lese</td></tr>
<tr><td>3</td><td>lev<b>de</b></td><td>har lev<b>d</b></td><td>-v, -g, -ei, -øy: leve, prøve, bygge</td></tr>
<tr><td>4</td><td>bo<b>dde</b></td><td>har bo<b>dd</b></td><td>einsilbig auf Vokal: bo, tro</td></tr></table>
<p>Die Regeln sind Faustregeln – die Klasse lernt man am besten mit dem Verb: <i>å snakke – snakket</i>.</p>`,
    drill: { kind: 'verb', forms: ['pret'], weakOnly: true },
    s: [['I går snakket jeg med læreren.', 'Gestern habe ich mit dem Lehrer gesprochen.'], ['Vi spiste pizza.', 'Wir haben Pizza gegessen.'], ['De bodde i Oslo i to år.', 'Sie haben zwei Jahre in Oslo gewohnt.'],
      ['Hun prøvde kjolen.', 'Sie hat das Kleid anprobiert.'], ['Jeg kjøpte en ny genser.', 'Ich habe einen neuen Pullover gekauft.']],
    err: [['I går spiset jeg fisk.', 'I går spiste jeg fisk.', 2, 'spise gehört zu Klasse 2 → spiste.'],
      ['Vi bote i Bergen.', 'Vi bodde i Bergen.', 1, 'bo → bodde (Klasse 4).']]
  });

  add({
    id: 'sterke', level: 2, title: 'Starke & unregelmäßige Verben',
    summary: 'skrive – skrev – har skrevet.',
    explain: `<p>Viele häufige Verben bilden die Vergangenheit mit Vokalwechsel – sie müssen gelernt werden:</p>
<table><tr><th>Infinitiv</th><th>Präteritum</th><th>Perfekt</th></tr>
<tr><td>gå</td><td>gikk</td><td>har gått</td></tr><tr><td>se</td><td>så</td><td>har sett</td></tr><tr><td>få</td><td>fikk</td><td>har fått</td></tr>
<tr><td>gjøre</td><td>gjorde</td><td>har gjort</td></tr><tr><td>si</td><td>sa</td><td>har sagt</td></tr><tr><td>skrive</td><td>skrev</td><td>har skrevet</td></tr>
<tr><td>drikke</td><td>drakk</td><td>har drukket</td></tr><tr><td>finne</td><td>fant</td><td>har funnet</td></tr><tr><td>være</td><td>var</td><td>har vært</td></tr></table>
<p>Die komplette Liste findest du im Trainer unter „Verben“ (nur starke wählen).</p>`,
    drill: { kind: 'verb', forms: ['pret', 'perf'], strongOnly: true },
    s: [['Jeg gikk hjem klokka ti.', 'Ich bin um zehn nach Hause gegangen.'], ['Vi så en fin film.', 'Wir haben einen schönen Film gesehen.'], ['Hun skrev et langt brev.', 'Sie hat einen langen Brief geschrieben.'],
      ['Jeg fikk en gave.', 'Ich habe ein Geschenk bekommen.'], ['Hva sa du?', 'Was hast du gesagt?']],
    err: [['I går gådde jeg til byen.', 'I går gikk jeg til byen.', 2, 'gå ist unregelmäßig → gikk.'],
      ['Han drikket kaffe.', 'Han drakk kaffe.', 1, 'drikke → drakk.']]
  });

  add({
    id: 'perfektum', level: 2, title: 'Perfektum: har + Partizip',
    summary: 'Ergebnis oder Erfahrung bis jetzt.',
    explain: `<p><b>har</b> + Partizip – immer mit har (nicht wie im Deutschen „bin gegangen“): Jeg <b>har gått</b>.</p>
<p><b>Präteritum oder Perfektum?</b> Mit genauer Zeitangabe in der Vergangenheit (i går, i fjor, da) → Präteritum. Ohne Zeitpunkt, mit Bezug zur Gegenwart oder „schon/noch nie“ → Perfektum.</p>
<p>Jeg <b>har vært</b> i Norge to ganger. · I fjor <b>var</b> jeg i Norge.</p>`,
    drill: { kind: 'verb', forms: ['perf'] },
    s: [['Jeg har bodd her i tre år.', 'Ich wohne seit drei Jahren hier.'], ['Har du spist?', 'Hast du gegessen?'], ['Vi har aldri vært i Tromsø.', 'Wir waren noch nie in Tromsø.'],
      ['Hun har glemt nøkkelen.', 'Sie hat den Schlüssel vergessen.'], ['Toget har gått.', 'Der Zug ist abgefahren.']],
    err: [['Jeg er gått hjem.', 'Jeg har gått hjem.', 1, 'Perfekt immer mit har.'],
      ['I går har jeg sett filmen.', 'I går så jeg filmen.', 2, 'Mit genauer Zeit (i går) → Präteritum.']]
  });

  add({
    id: 'futurum', level: 2, title: 'Zukunft: skal, vil, kommer til å',
    summary: 'Pläne, Vorhersagen und Präsens.',
    explain: `<table><tr><th>Form</th><th>Gebrauch</th><th>Beispiel</th></tr>
<tr><td><b>skal</b> + Inf.</td><td>Plan, Absicht</td><td>Jeg skal reise i morgen.</td></tr>
<tr><td><b>kommer til å</b> + Inf.</td><td>Vorhersage (ohne Willen)</td><td>Det kommer til å regne.</td></tr>
<tr><td><b>vil</b> + Inf.</td><td>Vorhersage, formell</td><td>Det vil bli kaldt.</td></tr>
<tr><td>Präsens + Zeitangabe</td><td>feste Zukunft</td><td>Toget går klokka åtte.</td></tr></table>`,
    drill: { kind: 'verb', forms: ['fut', 'futK'] },
    s: [['Vi skal flytte til Norge.', 'Wir werden nach Norwegen ziehen.'], ['Det kommer til å snø i natt.', 'Heute Nacht wird es schneien.'],
      ['Hva skal du gjøre i helgen?', 'Was machst du am Wochenende?'], ['Jeg skal begynne på kurs.', 'Ich fange einen Kurs an.'], ['Hun kommer til å bli glad.', 'Sie wird sich freuen.']],
    err: [['Det kommer til regne.', 'Det kommer til å regne.', 3, 'kommer til å + Infinitiv – das å nicht vergessen.'],
      ['Jeg skal å reise.', 'Jeg skal reise.', 2, 'Nach skal kein å.']]
  });

  add({
    id: 'imperativ', level: 2, title: 'Imperativ',
    summary: 'Befehl: Infinitiv ohne -e.',
    explain: `<p>Imperativ = Infinitiv ohne das End-e: spise → <b>Spis!</b>, komme → <b>Kom!</b>, vente → <b>Vent!</b></p>
<p>Endet der Infinitiv nicht auf -e, bleibt er gleich: <b>Gå!</b> <b>Se!</b> <b>Bo!</b><br>Nach Konsonant + l/n/r bleibt -e oft: <b>Åpne</b> døra!</p>
<p>Höflicher mit <b>vær så snill</b> (bitte) oder als Frage: Kan du hjelpe meg?</p>`,
    drill: { kind: 'verb', forms: ['imp'] },
    s: [['Kom inn!', 'Komm herein!'], ['Vent litt!', 'Warte kurz!'], ['Spis maten din!', 'Iss dein Essen!'], ['Ikke glem nøkkelen!', 'Vergiss den Schlüssel nicht!'],
      ['Snakk litt saktere, vær så snill.', 'Sprich bitte etwas langsamer.']],
    err: [['Komme hit!', 'Kom hit!', 0, 'Imperativ ohne -e: kom.'],
      ['Ikke glemmer nøkkelen!', 'Ikke glem nøkkelen!', 1, 'Verneinter Imperativ: Ikke + Imperativ (glem).']]
  });

  add({
    id: 'bestemtadj', level: 2, title: 'Adjektiv + bestimmte Form: den store bilen',
    summary: 'Doppelte Bestimmtheit.',
    explain: `<p>Steht ein Adjektiv vor einem bestimmten Nomen, braucht man einen <b>vorangestellten Artikel</b> UND die Endung am Nomen:</p>
<table><tr><th></th><th>Form</th></tr>
<tr><td>en / ei</td><td><b>den</b> stor<b>e</b> bil<b>en</b>, <b>den</b> stor<b>e</b> jent<b>a</b></td></tr>
<tr><td>et</td><td><b>det</b> stor<b>e</b> hus<b>et</b></td></tr>
<tr><td>Plural</td><td><b>de</b> stor<b>e</b> bil<b>ene</b></td></tr></table>
<p>Das Adjektiv endet immer auf <b>-e</b>. Sonderfall: liten → <b>den lille</b> gutten, de <b>små</b> barna.</p>`,
    drill: { kind: 'adj', forms: ['pl'] },
    s: [['Den nye bilen er rød.', 'Das neue Auto ist rot.'], ['Det store huset ligger ved sjøen.', 'Das große Haus liegt am Meer.'], ['De gamle bøkene er fine.', 'Die alten Bücher sind schön.'],
      ['Den lille gutten gråter.', 'Der kleine Junge weint.'], ['Jeg liker det gule huset.', 'Ich mag das gelbe Haus.']],
    err: [['Det store hus er fint.', 'Det store huset er fint.', 2, 'Doppelte Bestimmtheit: det store huset.'],
      ['Den ny bilen er dyr.', 'Den nye bilen er dyr.', 1, 'Adjektiv in bestimmter Form → -e: nye.']],
    ch: [['___ gamle mannen (der alte Mann)', ['Den', 'Det', 'De'], 'Den'], ['de ___ barna (die kleinen Kinder)', ['små', 'lille', 'liten'], 'små']]
  });

  add({
    id: 'gradbøying', level: 2, title: 'Steigerung: større, størst',
    summary: 'Komparativ -ere, Superlativ -est.',
    explain: `<p>Regel: <b>-ere</b> und <b>-est</b> (bei -ig nur -st): billig – billig<b>ere</b> – billig<b>st</b>, pen – pen<b>ere</b> – pen<b>est</b>.</p>
<table><tr><th>Grundform</th><th>Komparativ</th><th>Superlativ</th></tr>
<tr><td>god</td><td>bedre</td><td>best</td></tr><tr><td>stor</td><td>større</td><td>størst</td></tr><tr><td>liten</td><td>mindre</td><td>minst</td></tr>
<tr><td>gammel</td><td>eldre</td><td>eldst</td></tr><tr><td>ung</td><td>yngre</td><td>yngst</td></tr><tr><td>mange</td><td>flere</td><td>flest</td></tr></table>
<p>„als“ = <b>enn</b>: Oslo er større <b>enn</b> Bergen. Lange Adjektive: <b>mer</b> interessant, <b>mest</b> interessant.</p>`,
    drill: { kind: 'adj', forms: ['komp', 'sup'] },
    s: [['Oslo er større enn Bergen.', 'Oslo ist größer als Bergen.'], ['Dette er den beste kaffen.', 'Das ist der beste Kaffee.'], ['Broren min er eldre enn meg.', 'Mein Bruder ist älter als ich.'],
      ['Det er billigere med tog.', 'Mit dem Zug ist es billiger.'], ['Hvilket fjell er høyest?', 'Welcher Berg ist am höchsten?']],
    err: [['Oslo er stor enn Bergen.', 'Oslo er større enn Bergen.', 2, 'Komparativ von stor: større.'],
      ['Han er gooder enn meg.', 'Han er bedre enn meg.', 2, 'god → bedre (unregelmäßig).']],
    ch: [['Bergen er mindre ___ Oslo.', ['enn', 'som', 'da'], 'enn']]
  });

  add({
    id: 'objekt', level: 2, title: 'Objektpronomen & reflexive Verben',
    summary: 'meg, deg, ham/henne … und seg.',
    explain: `<table><tr><th>Subjekt</th><th>Objekt</th><th>reflexiv</th></tr>
<tr><td>jeg</td><td>meg</td><td>meg</td></tr><tr><td>du</td><td>deg</td><td>deg</td></tr><tr><td>han / hun</td><td>ham (han) / henne</td><td><b>seg</b></td></tr>
<tr><td>vi</td><td>oss</td><td>oss</td></tr><tr><td>dere</td><td>dere</td><td>dere</td></tr><tr><td>de</td><td>dem</td><td><b>seg</b></td></tr></table>
<p>Reflexive Verben: vaske <b>seg</b>, glede <b>seg</b> (sich freuen), sette <b>seg</b>, kose <b>seg</b> (es sich gemütlich machen).</p>`,
    s: [['Kan du hjelpe meg?', 'Kannst du mir helfen?'], ['Jeg ser ham ikke.', 'Ich sehe ihn nicht.'], ['Hun gleder seg til ferien.', 'Sie freut sich auf die Ferien.'],
      ['Vi koste oss i helgen.', 'Wir haben es uns am Wochenende gemütlich gemacht.'], ['Sett deg, vær så snill.', 'Setz dich bitte.']],
    err: [['Han vasker ham før middag.', 'Han vasker seg før middag.', 2, 'Reflexiv (er selbst) → seg.'],
      ['Kan du ringe jeg?', 'Kan du ringe meg?', 3, 'Objekt → meg.']],
    ch: [['De gleder ___ til jul.', ['seg', 'dem', 'oss'], 'seg'], ['Jeg elsker ___. (dich)', ['deg', 'du', 'din'], 'deg']]
  });

  add({
    id: 'leddsetning', level: 2, title: 'Nebensätze: at, fordi, når, hvis',
    summary: 'Im Nebensatz steht ikke VOR dem Verb.',
    explain: `<p>Nebensatz-Einleitungen: <b>at</b> (dass), <b>fordi</b> (weil), <b>når</b> (wenn/als – wiederholt), <b>da</b> (als – einmalig), <b>hvis</b> (falls), <b>om</b> (ob), <b>selv om</b> (obwohl).</p>
<p>Wortstellung im Nebensatz: Subjekt – (Adverb wie <b>ikke, alltid, aldri</b>) – Verb:<br>
Jeg vet at han <b>ikke kommer</b>. (Hauptsatz: Han kommer ikke.)</p>
<p>Kein Verb am Ende wie im Deutschen! Beginnt der Satz mit dem Nebensatz, folgt Inversion: <b>Hvis</b> det regner, <b>blir jeg</b> hjemme.</p>`,
    s: [['Jeg tror at hun kommer.', 'Ich glaube, dass sie kommt.'], ['Han er trøtt fordi han ikke sov.', 'Er ist müde, weil er nicht geschlafen hat.'],
      ['Hvis det regner, blir vi hjemme.', 'Wenn es regnet, bleiben wir zu Hause.'], ['Da jeg var barn, bodde jeg i Hamburg.', 'Als ich ein Kind war, wohnte ich in Hamburg.'],
      ['Jeg vet ikke om han har tid.', 'Ich weiß nicht, ob er Zeit hat.']],
    err: [['Jeg vet at han kommer ikke.', 'Jeg vet at han ikke kommer.', 5, 'Im Nebensatz steht ikke vor dem Verb.'],
      ['Hvis det regner, vi blir hjemme.', 'Hvis det regner, blir vi hjemme.', 3, 'Nach dem Nebensatz: Inversion → blir vi.']],
    ch: [['Jeg lærer norsk ___ jeg vil bo i Norge.', ['fordi', 'hvis', 'om'], 'fordi'], ['___ jeg var liten, bodde jeg på landet. (einmalig)', ['Da', 'Når', 'Hvis'], 'Da']]
  });

  add({
    id: 'sin', level: 2, title: 'sin / si / sitt / sine',
    summary: 'Reflexiver Besitz – „sein eigenes“.',
    explain: `<p>Gehört etwas dem <b>Subjekt desselben Satzes</b> (3. Person), nimmt man <b>sin/si/sitt/sine</b> statt hans/hennes:</p>
<p>Per vasker bilen <b>sin</b>. (= Per wäscht sein eigenes Auto)<br>Per vasker bilen <b>hans</b>. (= das Auto eines anderen Mannes)</p>
<table><tr><th>en</th><th>ei</th><th>et</th><th>Plural</th></tr><tr><td>sin</td><td>si</td><td>sitt</td><td>sine</td></tr></table>
<p>Im Subjekt selbst nie sin: <b>Hans</b> bil er ny (nicht: Sin bil …).</p>`,
    s: [['Kari ringer moren sin.', 'Kari ruft ihre (eigene) Mutter an.'], ['Ola selger huset sitt.', 'Ola verkauft sein (eigenes) Haus.'], ['De besøker barna sine.', 'Sie besuchen ihre (eigenen) Kinder.'],
      ['Han leter etter boka si.', 'Er sucht sein (eigenes) Buch.'], ['Bilen hans er ny.', 'Sein Auto ist neu.']],
    err: [['Ola elsker kona hans.', 'Ola elsker kona si.', 3, 'Seine eigene Frau → kona si (sonst wäre es die Frau eines anderen!).'],
      ['Sin bil er gammel.', 'Bilen hans er gammel.', 0, 'Im Subjekt kein sin → bilen hans.']],
    ch: [['Per vasker huset ___. (sein eigenes)', ['sitt', 'sin', 'hans'], 'sitt']]
  });

  add({
    id: 'finnes', level: 2, title: 'Det er / det finnes – es gibt',
    summary: 'Formales Subjekt det.',
    explain: `<p>„Es gibt“ heißt <b>det er</b> (konkret, hier) oder <b>det finnes</b> (existiert allgemein):</p>
<p><b>Det er</b> en butikk på hjørnet. · <b>Det finnes</b> mange fjorder i Norge.</p>
<p>Auch beim Wetter und bei Gefühlen steht <b>det</b>: <b>Det</b> regner. <b>Det</b> er kaldt. <b>Det</b> går bra.</p>`,
    s: [['Det er mange folk her.', 'Hier sind viele Leute.'], ['Det finnes ingen enkel løsning.', 'Es gibt keine einfache Lösung.'], ['Det snør i dag.', 'Heute schneit es.'],
      ['Er det en minibank i nærheten?', 'Gibt es hier in der Nähe einen Geldautomaten?'], ['Hvordan går det? – Det går bra.', 'Wie geht es? – Es geht gut.']],
    err: [['Det gir mange fjorder i Norge.', 'Det finnes mange fjorder i Norge.', 1, '„Es gibt“ = det finnes / det er – nicht „gir“.'],
      ['Er kaldt i dag.', 'Det er kaldt i dag.', 0, 'Beim Wetter braucht man det.']]
  });

  add({
    id: 'konjunksjon', level: 2, title: 'og, men, eller, for, så',
    summary: 'Hauptsätze verbinden – ohne Umstellung.',
    explain: `<p>Diese Konjunktionen verbinden zwei Hauptsätze; die Wortstellung ändert sich <b>nicht</b>:</p>
<p><b>og</b> (und) · <b>men</b> (aber) · <b>eller</b> (oder) · <b>for</b> (denn) · <b>så</b> (also, deshalb)</p>
<p>Jeg er sulten, <b>så</b> jeg lager mat. · Jeg blir hjemme, <b>for</b> jeg er syk.</p>
<p>Achtung: <b>så</b> als Adverb am Satzanfang („dann“) bewirkt Inversion: Så gikk vi hjem.</p>`,
    s: [['Jeg liker kaffe, men hun liker te.', 'Ich mag Kaffee, aber sie mag Tee.'], ['Vil du ha te eller kaffe?', 'Möchtest du Tee oder Kaffee?'],
      ['Jeg er trøtt, så jeg legger meg.', 'Ich bin müde, also gehe ich ins Bett.'], ['Hun er glad, for hun har fått jobben.', 'Sie ist froh, denn sie hat den Job bekommen.']],
    err: [['Jeg er sulten, men har jeg ikke mat.', 'Jeg er sulten, men jeg har ikke mat.', 4, 'Nach men: keine Umstellung → men jeg har.']]
  });

  /* ───────────── B1 ───────────── */
  add({
    id: 'passiv', level: 3, title: 'Passiv: -s und bli + Partizip',
    summary: 'Huset selges. / Huset ble solgt.',
    explain: `<p><b>s-Passiv</b> (vor allem Präsens, Infinitiv und nach Modalverben): Infinitiv + <b>s</b> – Huset <b>selges</b>. Det <b>må gjøres</b>.</p>
<p><b>bli-Passiv</b> (alle Zeiten): <b>bli/blir/ble/har blitt</b> + Partizip – Huset <b>ble solgt</b> i fjor.</p>
<p>Der Handelnde mit <b>av</b>: Boka ble skrevet <b>av</b> Ibsen.</p>`,
    s: [['Huset selges.', 'Das Haus wird verkauft.'], ['Butikken åpnes klokka ni.', 'Der Laden wird um neun geöffnet.'], ['Brevet ble skrevet i går.', 'Der Brief wurde gestern geschrieben.'],
      ['Dette må gjøres i dag.', 'Das muss heute gemacht werden.'], ['Boka er oversatt til tysk.', 'Das Buch ist ins Deutsche übersetzt.']],
    err: [['Huset blir solges.', 'Huset selges.', 2, 'Entweder s-Passiv (selges) oder bli + Partizip (blir solgt) – nicht beides.'],
      ['Boka ble skrevet fra Ibsen.', 'Boka ble skrevet av Ibsen.', 3, 'Der Handelnde im Passiv: av.']]
  });

  add({
    id: 'pluskvamperfektum', level: 3, title: 'Plusquamperfekt: hadde + Partizip',
    summary: 'Vorvergangenheit.',
    explain: `<p><b>hadde</b> + Partizip: Etwas war vor einem anderen Ereignis in der Vergangenheit abgeschlossen.</p>
<p>Da jeg kom, <b>hadde</b> toget <b>gått</b>. (Als ich kam, war der Zug abgefahren.)</p>`,
    drill: { kind: 'verb', forms: ['plusq'] },
    s: [['Da vi kom, hadde filmen begynt.', 'Als wir kamen, hatte der Film angefangen.'], ['Hun hadde aldri sett snø før.', 'Sie hatte nie zuvor Schnee gesehen.'],
      ['Jeg hadde glemt passordet.', 'Ich hatte das Passwort vergessen.'], ['De hadde allerede spist.', 'Sie hatten schon gegessen.']],
    err: [['Da jeg kom, var toget gått.', 'Da jeg kom, hadde toget gått.', 3, 'Plusquamperfekt immer mit hadde.']]
  });

  add({
    id: 'indirekte', level: 3, title: 'Indirekte Rede',
    summary: 'Han sa at han var trøtt.',
    explain: `<p>Indirekte Rede ist ein <b>at-Nebensatz</b>. Steht das Einleitungsverb in der Vergangenheit, rückt die Zeit meist zurück:</p>
<p>„Jeg <b>er</b> trøtt.“ → Han sa at han <b>var</b> trøtt.<br>„Jeg <b>har</b> spist.“ → Hun sa at hun <b>hadde</b> spist.<br>„Jeg <b>skal</b> komme.“ → Han sa at han <b>skulle</b> komme.</p>
<p>Fragen: Hun spurte <b>om</b> jeg ville komme. / Han spurte <b>hvor</b> jeg bodde. Im Nebensatz: ikke vor dem Verb.</p>`,
    s: [['Han sa at han var syk.', 'Er sagte, dass er krank sei.'], ['Hun spurte om jeg ville ha kaffe.', 'Sie fragte, ob ich Kaffee wolle.'], ['De sa at de skulle komme.', 'Sie sagten, sie würden kommen.'],
      ['Han spurte hvor jeg bodde.', 'Er fragte, wo ich wohne.'], ['Hun sa at hun ikke hadde tid.', 'Sie sagte, dass sie keine Zeit habe.']],
    err: [['Hun spurte hvor bor jeg.', 'Hun spurte hvor jeg bodde.', 3, 'Indirekte Frage: Subjekt vor Verb (hvor jeg bodde).'],
      ['Han sa at han hadde ikke tid.', 'Han sa at han ikke hadde tid.', 5, 'Im Nebensatz: ikke vor dem Verb.']]
  });

  add({
    id: 'som', level: 3, title: 'Relativsätze mit som',
    summary: 'mannen som bor her …',
    explain: `<p><b>som</b> = der/die/das/welche – für Personen und Dinge, Singular und Plural, unverändert.</p>
<p>Mannen <b>som</b> bor her, er lege. · Boka <b>som</b> jeg leser, er spennende.</p>
<p>Ist som Objekt, kann es wegfallen: Boka (som) jeg leser … Ist som Subjekt, muss es bleiben. Im Relativsatz steht ikke vor dem Verb.</p>`,
    s: [['Kvinnen som jobber her, er fra Sverige.', 'Die Frau, die hier arbeitet, kommt aus Schweden.'], ['Filmen som vi så, var lang.', 'Der Film, den wir gesehen haben, war lang.'],
      ['Det er en by som jeg liker.', 'Das ist eine Stadt, die ich mag.'], ['Han som ikke kom, er syk.', 'Der, der nicht kam, ist krank.']],
    err: [['Mannen hvem bor her, er lege.', 'Mannen som bor her, er lege.', 1, 'Relativpronomen: som.'],
      ['Boka som jeg leser ikke, er kjedelig.', 'Boka som jeg ikke leser, er kjedelig.', 4, 'Im Relativsatz: ikke vor dem Verb.']]
  });

  add({
    id: 'kondisjonal', level: 3, title: 'Konditional: ville / skulle + Infinitiv',
    summary: 'Würde, hätte, Höflichkeit.',
    explain: `<p><b>ville</b> + Infinitiv = würde: Jeg <b>ville</b> kjøpt det hvis jeg hadde penger. (umgangssprachlich oft mit Partizip)</p>
<p>Höflich: <b>Kunne</b> du hjelpe meg? · Jeg <b>skulle</b> gjerne hatt en kaffe. (Ich hätte gern einen Kaffee.)</p>
<p>Irreale Bedingung: <b>Hvis</b> jeg <b>hadde</b> tid, <b>ville</b> jeg reist mer.</p>`,
    s: [['Kunne du åpne vinduet?', 'Könntest du das Fenster öffnen?'], ['Jeg skulle gjerne hatt en kopp te.', 'Ich hätte gern eine Tasse Tee.'],
      ['Hvis jeg var rik, ville jeg kjøpt en hytte.', 'Wenn ich reich wäre, würde ich eine Hütte kaufen.'], ['Det ville vært fint.', 'Das wäre schön.']],
    err: [['Kan du åpner vinduet?', 'Kan du åpne vinduet?', 2, 'Nach Modalverb: Infinitiv (åpne).']]
  });

  g.Grammar = { points: P, byId: Object.fromEntries(P.map(p => [p.id, p])) };
})(typeof window !== 'undefined' ? window : globalThis);
