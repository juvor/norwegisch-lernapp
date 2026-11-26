/* Eingebaute Wörter mit sicheren Formen (Bokmål) – für Trainer, Formentabelle und das Startpaket.
   Nomen:      [Wort, Geschlecht m/f/n, Deutsch, Formen?(bestimmt Sg, unbestimmt Pl, bestimmt Pl)]
   Verben:     [Infinitiv, Deutsch, {cls 1–4 | pres, pret, part, imp, modal}]
   Adjektive:  [Wort, Deutsch, {n, pl, komp, sup}] */
(function (g) {
  'use strict';
  const N = [
    ['bil', 'm', 'Auto'], ['gutt', 'm', 'Junge'], ['mann', 'm', 'Mann', ['mannen', 'menn', 'mennene']], ['venn', 'm', 'Freund'],
    ['lærer', 'm', 'Lehrer(in)'], ['student', 'm', 'Student(in)'], ['by', 'm', 'Stadt'], ['dag', 'm', 'Tag'], ['morgen', 'm', 'Morgen'],
    ['kveld', 'm', 'Abend'], ['time', 'm', 'Stunde; Unterrichtsstunde'], ['stol', 'm', 'Stuhl'], ['butikk', 'm', 'Laden, Geschäft'],
    ['buss', 'm', 'Bus'], ['skole', 'm', 'Schule'], ['jobb', 'm', 'Job, Arbeit'], ['film', 'm', 'Film'], ['kopp', 'm', 'Tasse'],
    ['telefon', 'm', 'Telefon'], ['nøkkel', 'm', 'Schlüssel', ['nøkkelen', 'nøkler', 'nøklene']], ['sykkel', 'm', 'Fahrrad', ['sykkelen', 'sykler', 'syklene']],
    ['fot', 'm', 'Fuß', ['foten', 'føtter', 'føttene']], ['sko', 'm', 'Schuh', ['skoen', 'sko', 'skoene']], ['bror', 'm', 'Bruder', ['broren', 'brødre', 'brødrene']],
    ['far', 'm', 'Vater', ['faren', 'fedre', 'fedrene']], ['sønn', 'm', 'Sohn'], ['hund', 'm', 'Hund'], ['katt', 'm', 'Katze'], ['vei', 'm', 'Weg, Straße'],
    ['lege', 'm', 'Arzt, Ärztin'], ['nabo', 'm', 'Nachbar(in)'], ['sommer', 'm', 'Sommer', ['sommeren', 'somrer', 'somrene']],
    ['vinter', 'm', 'Winter', ['vinteren', 'vintrer', 'vintrene']], ['pris', 'm', 'Preis'], ['regning', 'm', 'Rechnung'], ['billett', 'm', 'Fahrkarte, Ticket'],
    ['stasjon', 'm', 'Bahnhof, Station'], ['flyplass', 'm', 'Flughafen'], ['restaurant', 'm', 'Restaurant'], ['kafé', 'm', 'Café', ['kafeen', 'kafeer', 'kafeene']],
    ['dusj', 'm', 'Dusche'], ['genser', 'm', 'Pullover'], ['kjæreste', 'm', 'Freund(in), Partner(in)'], ['måned', 'm', 'Monat'], ['fisk', 'm', 'Fisch'],
    ['dør', 'f', 'Tür'], ['seng', 'f', 'Bett'], ['jente', 'f', 'Mädchen'], ['kone', 'f', 'Ehefrau'], ['datter', 'f', 'Tochter', ['datteren', 'døtre', 'døtrene']],
    ['mor', 'f', 'Mutter', ['moren', 'mødre', 'mødrene']], ['søster', 'f', 'Schwester', ['søsteren', 'søstre', 'søstrene']], ['bok', 'f', 'Buch', ['boka', 'bøker', 'bøkene']],
    ['hånd', 'f', 'Hand', ['hånda', 'hender', 'hendene']], ['natt', 'f', 'Nacht', ['natta', 'netter', 'nettene']], ['uke', 'f', 'Woche'], ['klokke', 'f', 'Uhr, Glocke'],
    ['avis', 'f', 'Zeitung'], ['hytte', 'f', 'Hütte, Ferienhaus'], ['kake', 'f', 'Kuchen'], ['tid', 'f', 'Zeit'], ['side', 'f', 'Seite'], ['gate', 'f', 'Straße'],
    ['veske', 'f', 'Tasche'], ['flaske', 'f', 'Flasche'], ['jakke', 'f', 'Jacke'], ['pike', 'f', 'Mädchen (gehoben)'], ['lampe', 'f', 'Lampe'],
    ['hus', 'n', 'Haus'], ['barn', 'n', 'Kind', ['barnet', 'barn', 'barna']], ['år', 'n', 'Jahr'], ['rom', 'n', 'Zimmer, Raum', ['rommet', 'rom', 'rommene']],
    ['eple', 'n', 'Apfel'], ['bord', 'n', 'Tisch'], ['vindu', 'n', 'Fenster'], ['tog', 'n', 'Zug'], ['fly', 'n', 'Flugzeug'], ['brød', 'n', 'Brot'],
    ['land', 'n', 'Land'], ['språk', 'n', 'Sprache'], ['ord', 'n', 'Wort'], ['spørsmål', 'n', 'Frage', ['spørsmålet', 'spørsmål', 'spørsmålene']],
    ['kjøkken', 'n', 'Küche', ['kjøkkenet', 'kjøkken', 'kjøkkenene']], ['øye', 'n', 'Auge', ['øyet', 'øyne', 'øynene']], ['hode', 'n', 'Kopf'],
    ['menneske', 'n', 'Mensch'], ['bilde', 'n', 'Bild'], ['problem', 'n', 'Problem'], ['kontor', 'n', 'Büro'], ['egg', 'n', 'Ei'], ['glass', 'n', 'Glas'],
    ['bad', 'n', 'Bad'], ['kart', 'n', 'Landkarte'], ['sted', 'n', 'Ort, Stelle', ['stedet', 'steder', 'stedene']], ['tre', 'n', 'Baum', ['treet', 'trær', 'trærne']],
    ['fjell', 'n', 'Berg'], ['dyr', 'n', 'Tier'], ['bein', 'n', 'Bein; Knochen', ['beinet', 'bein', 'beina']], ['sykehus', 'n', 'Krankenhaus', ['sykehuset', 'sykehus', 'sykehusene']],
    ['museum', 'n', 'Museum', ['museet', 'museer', 'museene']], ['universitet', 'n', 'Universität'], ['ansikt', 'n', 'Gesicht'], ['møte', 'n', 'Treffen, Besprechung'],
    ['vær', 'n', 'Wetter', ['været', '–', '–']]
  ];
  const nouns = N.map(([no, gen, de, forms]) => ({ no, g: gen, de, forms }));

  const VB = [
    ['være', 'sein', { pres: 'er', pret: 'var', part: 'vært', imp: 'vær' }], ['ha', 'haben', { pres: 'har', pret: 'hadde', part: 'hatt', imp: 'ha' }],
    ['gå', 'gehen', { pres: 'går', pret: 'gikk', part: 'gått', imp: 'gå' }], ['komme', 'kommen', { pret: 'kom', part: 'kommet', imp: 'kom' }],
    ['se', 'sehen', { pres: 'ser', pret: 'så', part: 'sett', imp: 'se' }], ['si', 'sagen', { pres: 'sier', pret: 'sa', part: 'sagt', imp: 'si' }],
    ['gjøre', 'machen, tun', { pres: 'gjør', pret: 'gjorde', part: 'gjort', imp: 'gjør' }], ['få', 'bekommen; dürfen', { pres: 'får', pret: 'fikk', part: 'fått', imp: 'få' }],
    ['ta', 'nehmen', { pres: 'tar', pret: 'tok', part: 'tatt', imp: 'ta' }], ['gi', 'geben', { pres: 'gir', pret: 'ga', part: 'gitt', imp: 'gi' }],
    ['vite', 'wissen', { pres: 'vet', pret: 'visste', part: 'visst', imp: 'vit' }], ['spise', 'essen', { cls: 2 }],
    ['drikke', 'trinken', { pret: 'drakk', part: 'drukket', imp: 'drikk' }], ['sove', 'schlafen', { pret: 'sov', part: 'sovet', imp: 'sov' }],
    ['skrive', 'schreiben', { pret: 'skrev', part: 'skrevet', imp: 'skriv' }], ['lese', 'lesen', { cls: 2 }], ['snakke', 'sprechen', { cls: 1 }],
    ['jobbe', 'arbeiten', { cls: 1 }], ['arbeide', 'arbeiten', { cls: 1 }], ['bo', 'wohnen', { cls: 4 }], ['tro', 'glauben', { cls: 4 }],
    ['kjøpe', 'kaufen', { cls: 2 }], ['betale', 'bezahlen', { cls: 2 }], ['selge', 'verkaufen', { pret: 'solgte', part: 'solgt', imp: 'selg' }],
    ['reise', 'reisen', { cls: 2 }], ['kjøre', 'fahren (Auto)', { cls: 2 }], ['høre', 'hören', { cls: 2 }], ['bruke', 'benutzen', { cls: 2 }],
    ['lære', 'lernen; lehren', { cls: 2 }], ['spørre', 'fragen', { pres: 'spør', pret: 'spurte', part: 'spurt', imp: 'spør' }], ['svare', 'antworten', { cls: 2 }],
    ['like', 'mögen', { cls: 2 }], ['elske', 'lieben', { cls: 1 }], ['hete', 'heißen', { pret: 'het', part: 'hett', imp: 'het' }],
    ['hjelpe', 'helfen', { pret: 'hjalp', part: 'hjulpet', imp: 'hjelp' }], ['finne', 'finden', { pret: 'fant', part: 'funnet', imp: 'finn' }],
    ['bli', 'werden; bleiben', { pres: 'blir', pret: 'ble', part: 'blitt', imp: 'bli' }], ['stå', 'stehen', { pres: 'står', pret: 'sto', part: 'stått', imp: 'stå' }],
    ['sitte', 'sitzen', { pret: 'satt', part: 'sittet', imp: 'sitt' }], ['ligge', 'liegen', { pret: 'lå', part: 'ligget', imp: 'ligg' }],
    ['legge', 'legen', { pret: 'la', part: 'lagt', imp: 'legg' }], ['sette', 'setzen, stellen', { pret: 'satte', part: 'satt', imp: 'sett' }],
    ['løpe', 'laufen, rennen', { pret: 'løp', part: 'løpt', imp: 'løp' }], ['dra', 'fahren, ziehen', { pres: 'drar', pret: 'dro', part: 'dratt', imp: 'dra' }],
    ['flytte', 'umziehen', { cls: 1 }], ['lage', 'machen, zubereiten', { cls: 1 }], ['vaske', 'waschen', { cls: 1 }],
    ['åpne', 'öffnen', { cls: 1, imp: 'åpne' }], ['lukke', 'schließen', { cls: 1 }], ['begynne', 'anfangen', { cls: 2, imp: 'begynn' }],
    ['glemme', 'vergessen', { cls: 2, imp: 'glem' }], ['huske', 'sich erinnern', { cls: 1 }], ['vente', 'warten', { cls: 1 }],
    ['prøve', 'probieren, versuchen', { cls: 3 }], ['leve', 'leben', { cls: 3 }], ['bygge', 'bauen', { cls: 3, imp: 'bygg' }], ['øve', 'üben', { cls: 3 }],
    ['spille', 'spielen', { cls: 2, imp: 'spill' }], ['ringe', 'anrufen', { cls: 2 }], ['tenke', 'denken', { cls: 2 }],
    ['treffe', 'treffen', { pret: 'traff', part: 'truffet', imp: 'treff' }], ['møte', 'treffen, begegnen', { cls: 2 }], ['vise', 'zeigen', { cls: 2 }],
    ['trenge', 'brauchen', { cls: 2 }], ['bestille', 'bestellen', { cls: 2, imp: 'bestill' }], ['handle', 'einkaufen; handeln', { cls: 1, imp: 'handle' }],
    ['danse', 'tanzen', { cls: 1 }], ['synge', 'singen', { pret: 'sang', part: 'sunget', imp: 'syng' }], ['le', 'lachen', { pres: 'ler', pret: 'lo', part: 'ledd', imp: 'le' }],
    ['gråte', 'weinen', { pret: 'gråt', part: 'grått', imp: 'gråt' }], ['våkne', 'aufwachen', { cls: 1, imp: 'våkne' }], ['dusje', 'duschen', { cls: 1 }],
    ['svømme', 'schwimmen', { cls: 2, imp: 'svøm' }], ['sykle', 'Rad fahren', { cls: 1, imp: 'sykle' }], ['vinne', 'gewinnen', { pret: 'vant', part: 'vunnet', imp: 'vinn' }],
    ['koste', 'kosten', { cls: 1 }], ['ønske', 'wünschen', { cls: 1 }], ['mene', 'meinen', { cls: 2 }],
    ['forstå', 'verstehen', { pres: 'forstår', pret: 'forsto', part: 'forstått', imp: 'forstå' }], ['bety', 'bedeuten', { cls: 4 }], ['studere', 'studieren', { cls: 2 }],
    ['kunne', 'können', { pres: 'kan', pret: 'kunne', part: 'kunnet', modal: true }], ['ville', 'wollen', { pres: 'vil', pret: 'ville', part: 'villet', modal: true }],
    ['skulle', 'sollen, werden', { pres: 'skal', pret: 'skulle', part: 'skullet', modal: true }], ['måtte', 'müssen', { pres: 'må', pret: 'måtte', part: 'måttet', modal: true }],
    ['burde', 'sollte(n)', { pres: 'bør', pret: 'burde', part: 'burdet', modal: true }]
  ];
  const verbs = VB.map(([inf, de, o]) => Object.assign({ inf, de }, o));

  const AJ = [
    ['stor', 'groß', { komp: 'større', sup: 'størst' }], ['liten', 'klein', { n: 'lite', pl: 'små', komp: 'mindre', sup: 'minst' }],
    ['god', 'gut', { komp: 'bedre', sup: 'best' }], ['dårlig', 'schlecht', {}], ['ny', 'neu', {}], ['gammel', 'alt', { n: 'gammelt', pl: 'gamle', komp: 'eldre', sup: 'eldst' }],
    ['ung', 'jung', { komp: 'yngre', sup: 'yngst' }], ['lang', 'lang', { komp: 'lengre', sup: 'lengst' }], ['kort', 'kurz', {}], ['høy', 'hoch, groß', { n: 'høyt' }],
    ['lav', 'niedrig', {}], ['pen', 'hübsch', {}], ['fin', 'schön, fein', {}], ['billig', 'billig', {}], ['dyr', 'teuer', {}], ['varm', 'warm', {}],
    ['kald', 'kalt', {}], ['glad', 'froh', { n: 'glad' }], ['trist', 'traurig', {}], ['sulten', 'hungrig', { n: 'sultent', pl: 'sultne', komp: 'sultnere', sup: 'sultnest' }],
    ['trøtt', 'müde', {}], ['snill', 'lieb, nett', { n: 'snilt' }], ['hyggelig', 'nett, gemütlich', {}], ['vanskelig', 'schwierig', {}], ['lett', 'leicht', {}],
    ['viktig', 'wichtig', {}], ['interessant', 'interessant', {}], ['morsom', 'lustig', { n: 'morsomt', pl: 'morsomme', komp: 'morsommere', sup: 'morsomst' }],
    ['kjedelig', 'langweilig', {}], ['rask', 'schnell', {}], ['grønn', 'grün', {}], ['blå', 'blau', {}], ['rød', 'rot', {}], ['hvit', 'weiß', {}],
    ['svart', 'schwarz', {}], ['gul', 'gelb', {}], ['full', 'voll; betrunken', { n: 'fullt' }], ['tom', 'leer', { n: 'tomt', pl: 'tomme', komp: 'tommere', sup: 'tomst' }],
    ['syk', 'krank', {}], ['frisk', 'gesund; frisch', {}], ['sterk', 'stark', {}], ['rik', 'reich', {}], ['fattig', 'arm', {}], ['ren', 'sauber', {}],
    ['skitten', 'schmutzig', { n: 'skittent', pl: 'skitne', komp: 'skitnere', sup: 'skitnest' }], ['norsk', 'norwegisch', { n: 'norsk' }],
    ['tysk', 'deutsch', { n: 'tysk' }], ['deilig', 'lecker, herrlich', {}], ['vakker', 'schön', { n: 'vakkert', pl: 'vakre', komp: 'vakrere', sup: 'vakrest' }],
    ['søt', 'süß', {}], ['tung', 'schwer', { komp: 'tyngre', sup: 'tyngst' }], ['nær', 'nah', { komp: 'nærmere', sup: 'nærmest' }],
    ['enkel', 'einfach', { n: 'enkelt', pl: 'enkle', komp: 'enklere', sup: 'enklest' }], ['åpen', 'offen', { n: 'åpent', pl: 'åpne' }], ['ledig', 'frei, verfügbar', {}]
  ];
  const adjs = AJ.map(([no, de, o]) => Object.assign({ no, de }, o));

  g.Lexicon = { nouns, verbs, adjs };
})(typeof window !== 'undefined' ? window : globalThis);
