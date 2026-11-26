/* Memory-Bildersets Norwegisch (Bokmål): [Bild (Emoji) oder Farbe, Norwegisch, Deutsch].
   Nomen mit Artikel (en/ei/et), damit das Geschlecht mitgelernt wird. Format siehe js/memory.js. */
(function (g) {
  'use strict';
  const list = [
    { id: 'farben', icon: '🎨', title: 'Farben', topic: 'Farben & Beschreibung', pos: 'Adjektiv', items: [
      ['#e53935', 'rød', 'rot'], ['#fb8c00', 'oransje', 'orange'], ['#fdd835', 'gul', 'gelb'], ['#43a047', 'grønn', 'grün'],
      ['#1e5bd8', 'blå', 'blau'], ['#8e24aa', 'lilla', 'lila'], ['#f48fb1', 'rosa', 'rosa'], ['#6d4c41', 'brun', 'braun'],
      ['#111111', 'svart', 'schwarz'], ['#ffffff', 'hvit', 'weiß'], ['#9e9e9e', 'grå', 'grau'], ['#81d4fa', 'lyseblå', 'hellblau']] },
    { id: 'tiere', icon: '🐾', title: 'Tiere', topic: 'Natur & Tiere', pos: 'Nomen', items: [
      ['🐶', 'en hund', 'Hund'], ['🐱', 'en katt', 'Katze'], ['🐦', 'en fugl', 'Vogel'], ['🐟', 'en fisk', 'Fisch'], ['🐴', 'en hest', 'Pferd'], ['🐄', 'ei ku', 'Kuh'],
      ['🐷', 'en gris', 'Schwein'], ['🐔', 'ei høne', 'Huhn'], ['🐰', 'en kanin', 'Kaninchen'], ['🐻', 'en bjørn', 'Bär'], ['🐯', 'en tiger', 'Tiger'], ['🐒', 'en ape', 'Affe'],
      ['🐘', 'en elefant', 'Elefant'], ['🐍', 'en slange', 'Schlange'], ['🐭', 'ei mus', 'Maus'], ['🐑', 'en sau', 'Schaf']] },
    { id: 'wohnung', icon: '🛋️', title: 'Möbel & Wohnung', topic: 'Haushalt', pos: 'Nomen', items: [
      ['🛏️', 'ei seng', 'Bett'], ['🪑', 'en stol', 'Stuhl'], ['🛋️', 'en sofa', 'Sofa'], ['🚪', 'ei dør', 'Tür'], ['🪟', 'et vindu', 'Fenster'], ['🪞', 'et speil', 'Spiegel'],
      ['🕰️', 'ei klokke', 'Uhr'], ['💡', 'ei lampe', 'Lampe'], ['🛁', 'et badekar', 'Badewanne'], ['🚽', 'et toalett', 'Toilette'], ['📺', 'en TV', 'Fernseher'],
      ['🚿', 'en dusj', 'Dusche'], ['🔑', 'en nøkkel', 'Schlüssel'], ['🧺', 'en kurv', 'Korb']] },
    { id: 'verkehr', icon: '🚦', title: 'Verkehrsmittel', topic: 'Unterwegs', pos: 'Nomen', items: [
      ['🚗', 'en bil', 'Auto'], ['🚌', 'en buss', 'Bus'], ['🚕', 'en drosje', 'Taxi'], ['🚇', 'en T-bane', 'U-Bahn'], ['🚆', 'et tog', 'Zug'], ['✈️', 'et fly', 'Flugzeug'],
      ['🚢', 'et skip', 'Schiff'], ['🚲', 'en sykkel', 'Fahrrad'], ['🏍️', 'en motorsykkel', 'Motorrad'], ['🚚', 'en lastebil', 'Lastwagen'], ['🚑', 'en ambulanse', 'Krankenwagen'],
      ['🚒', 'en brannbil', 'Feuerwehrauto'], ['🚓', 'en politibil', 'Polizeiauto'], ['🚁', 'et helikopter', 'Hubschrauber']] },
    { id: 'obst', icon: '🍎', title: 'Obst & Gemüse', topic: 'Essen', pos: 'Nomen', items: [
      ['🍎', 'et eple', 'Apfel'], ['🍌', 'en banan', 'Banane'], ['🍇', 'en drue', 'Weintraube'], ['🍓', 'et jordbær', 'Erdbeere'], ['🍉', 'en vannmelon', 'Wassermelone'],
      ['🍑', 'en fersken', 'Pfirsich'], ['🍋', 'en sitron', 'Zitrone'], ['🍊', 'en appelsin', 'Orange (Frucht)'], ['🥕', 'en gulrot', 'Karotte'], ['🥔', 'en potet', 'Kartoffel'],
      ['🍅', 'en tomat', 'Tomate'], ['🌽', 'en mais', 'Mais'], ['🍄', 'en sopp', 'Pilz'], ['🧅', 'en løk', 'Zwiebel']] },
    { id: 'koerper', icon: '🧍', title: 'Körper', topic: 'Gesundheit', pos: 'Nomen', items: [
      ['👁️', 'et øye', 'Auge'], ['👃', 'en nese', 'Nase'], ['👄', 'en munn', 'Mund'], ['👂', 'et øre', 'Ohr'], ['✋', 'ei hånd', 'Hand'], ['🦶', 'en fot', 'Fuß'],
      ['🦵', 'et bein', 'Bein'], ['💪', 'en arm', 'Arm'], ['🦷', 'en tann', 'Zahn'], ['🫀', 'et hjerte', 'Herz'], ['👅', 'ei tunge', 'Zunge'], ['🧠', 'en hjerne', 'Gehirn']] },
    { id: 'kleidung', icon: '👕', title: 'Kleidung', topic: 'Einkaufen', pos: 'Nomen', items: [
      ['👕', 'en T-skjorte', 'T-Shirt'], ['👖', 'ei bukse', 'Hose'], ['👗', 'en kjole', 'Kleid'], ['👟', 'en joggesko', 'Turnschuh'], ['🧢', 'ei lue', 'Mütze'],
      ['🧦', 'en sokk', 'Socke'], ['🧤', 'en vott', 'Fäustling, Handschuh'], ['🧣', 'et skjerf', 'Schal'], ['🧥', 'ei jakke', 'Jacke'], ['👓', 'briller', 'Brille'],
      ['👜', 'ei veske', 'Tasche'], ['☂️', 'en paraply', 'Regenschirm']] },
    { id: 'natur', icon: '🌤️', title: 'Natur & Wetter', topic: 'Wetter', pos: 'Nomen', items: [
      ['☀️', 'ei sol', 'Sonne'], ['🌙', 'en måne', 'Mond'], ['⭐', 'ei stjerne', 'Stern'], ['☁️', 'en sky', 'Wolke'], ['🌧️', 'regn', 'Regen'], ['❄️', 'snø', 'Schnee'],
      ['💨', 'vind', 'Wind'], ['🌈', 'en regnbue', 'Regenbogen'], ['⚡', 'et lyn', 'Blitz'], ['⛰️', 'et fjell', 'Berg'], ['🌊', 'et hav', 'Meer'], ['🌳', 'et tre', 'Baum'], ['🌸', 'en blomst', 'Blume']] }
  ];
  g.MemorySets = { list };
})(typeof window !== 'undefined' ? window : globalThis);
