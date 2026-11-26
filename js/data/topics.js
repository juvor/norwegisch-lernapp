/* Themen mit nützlichen Alltagsphrasen (Bokmål). Eigene Vokabeln mit passender "Thema"-Spalte erscheinen automatisch beim Thema. */
(function (g) {
  'use strict';
  const topics = [
    { id: 'Alltag', icon: '👋', title: 'Begrüßung & Alltag', phrases: [
      ['Hei! Hvordan går det?', 'Hallo! Wie geht’s?'], ['Takk, bare bra.', 'Danke, gut.'], ['Takk for sist!', 'Danke fürs letzte Mal! (beim Wiedersehen)'],
      ['Unnskyld!', 'Entschuldigung!'], ['Det går fint.', 'Das ist in Ordnung.'], ['Hyggelig å møte deg.', 'Schön, dich kennenzulernen.'],
      ['Hva heter du?', 'Wie heißt du?'], ['Ha det bra!', 'Mach’s gut!'], ['Vi ses!', 'Wir sehen uns!'], ['God natt!', 'Gute Nacht!']] },
    { id: 'Essen', icon: '🍽️', title: 'Essen & Restaurant', phrases: [
      ['Kan jeg få menyen?', 'Kann ich die Speisekarte haben?'], ['Jeg vil gjerne ha en kaffe.', 'Ich hätte gern einen Kaffee.'], ['Kan vi få regningen?', 'Können wir die Rechnung haben?'],
      ['Takk for maten!', 'Danke für das Essen!'], ['Vær så god!', 'Bitte schön! / Guten Appetit!'], ['Det smaker godt.', 'Das schmeckt gut.'],
      ['Jeg er allergisk mot nøtter.', 'Ich bin allergisch gegen Nüsse.'], ['Kan jeg betale med kort?', 'Kann ich mit Karte zahlen?'], ['Skål!', 'Prost!']] },
    { id: 'Einkaufen', icon: '🛒', title: 'Einkaufen', phrases: [
      ['Hvor mye koster det?', 'Wie viel kostet das?'], ['Jeg bare ser meg rundt.', 'Ich schaue mich nur um.'], ['Har dere denne i en annen størrelse?', 'Haben Sie das in einer anderen Größe?'],
      ['Kan jeg prøve den?', 'Kann ich es anprobieren?'], ['Trenger du pose?', 'Brauchst du eine Tüte?'], ['Det er for dyrt.', 'Das ist zu teuer.'],
      ['Jeg tar den.', 'Ich nehme es.'], ['Kan jeg få kvittering?', 'Kann ich eine Quittung bekommen?']] },
    { id: 'Unterwegs', icon: '🚆', title: 'Unterwegs & Verkehr', phrases: [
      ['Hvor er togstasjonen?', 'Wo ist der Bahnhof?'], ['Er det langt herfra?', 'Ist es weit von hier?'], ['Når går neste buss?', 'Wann fährt der nächste Bus?'],
      ['En billett til Bergen, takk.', 'Eine Fahrkarte nach Bergen, bitte.'], ['Gå rett fram.', 'Geh geradeaus.'], ['Ta til venstre.', 'Biege links ab.'],
      ['Jeg har gått meg vill.', 'Ich habe mich verlaufen.'], ['Hvor lang tid tar det?', 'Wie lange dauert es?']] },
    { id: 'Wetter', icon: '🌦️', title: 'Wetter & Jahreszeiten', phrases: [
      ['Hvordan er været i dag?', 'Wie ist das Wetter heute?'], ['Det regner.', 'Es regnet.'], ['Det snør.', 'Es schneit.'], ['Sola skinner.', 'Die Sonne scheint.'],
      ['Det er kaldt ute.', 'Draußen ist es kalt.'], ['Det blåser mye.', 'Es ist sehr windig.'], ['Det finnes ikke dårlig vær, bare dårlige klær.', 'Es gibt kein schlechtes Wetter, nur schlechte Kleidung.'],
      ['I morgen blir det fint vær.', 'Morgen wird schönes Wetter.']] },
    { id: 'Arbeit', icon: '💼', title: 'Arbeit & Schule', phrases: [
      ['Hva jobber du med?', 'Was arbeitest du?'], ['Jeg jobber som sykepleier.', 'Ich arbeite als Krankenpfleger(in).'], ['Jeg har et møte klokka ti.', 'Ich habe um zehn eine Besprechung.'],
      ['Jeg går på norskkurs.', 'Ich besuche einen Norwegischkurs.'], ['Kan du gjenta det?', 'Kannst du das wiederholen?'], ['Hva betyr det?', 'Was bedeutet das?'],
      ['Jeg har fri i morgen.', 'Ich habe morgen frei.'], ['God helg!', 'Schönes Wochenende!']] },
    { id: 'Freizeit', icon: '⛷️', title: 'Freizeit & Hobbys', phrases: [
      ['Hva liker du å gjøre på fritiden?', 'Was machst du gern in deiner Freizeit?'], ['Jeg liker å gå på tur.', 'Ich gehe gern wandern.'], ['Skal vi gå på kino?', 'Sollen wir ins Kino gehen?'],
      ['Vi drar på hytta i helgen.', 'Am Wochenende fahren wir zur Hütte.'], ['Jeg går på ski om vinteren.', 'Im Winter fahre ich Ski.'], ['Det var kjempegøy!', 'Das hat riesig Spaß gemacht!'],
      ['Har du lyst til å bli med?', 'Hast du Lust mitzukommen?'], ['Vi koser oss.', 'Wir machen es uns gemütlich.']] },
    { id: 'Gesundheit', icon: '🏥', title: 'Gesundheit', phrases: [
      ['Jeg føler meg ikke bra.', 'Ich fühle mich nicht gut.'], ['Jeg har vondt i hodet.', 'Ich habe Kopfschmerzen.'], ['Jeg er forkjølet.', 'Ich bin erkältet.'],
      ['Jeg må gå til legen.', 'Ich muss zum Arzt.'], ['Hvor er nærmeste apotek?', 'Wo ist die nächste Apotheke?'], ['Jeg har feber.', 'Ich habe Fieber.'],
      ['God bedring!', 'Gute Besserung!'], ['Ring 113!', 'Ruf 113 an! (Notruf)']] },
    { id: 'Familie', icon: '👨‍👩‍👧', title: 'Familie & Menschen', phrases: [
      ['Har du søsken?', 'Hast du Geschwister?'], ['Jeg har en bror og to søstre.', 'Ich habe einen Bruder und zwei Schwestern.'], ['Er du gift?', 'Bist du verheiratet?'],
      ['Vi har to barn.', 'Wir haben zwei Kinder.'], ['Foreldrene mine bor i Tyskland.', 'Meine Eltern wohnen in Deutschland.'], ['Dette er kjæresten min.', 'Das ist mein Freund / meine Freundin.'],
      ['Hvor gammel er du?', 'Wie alt bist du?']] },
    { id: 'Zeit', icon: '⏰', title: 'Zeit & Verabredungen', phrases: [
      ['Hva er klokka?', 'Wie spät ist es?'], ['Klokka er halv fire.', 'Es ist halb vier.'], ['Når skal vi møtes?', 'Wann sollen wir uns treffen?'],
      ['Har du tid i morgen?', 'Hast du morgen Zeit?'], ['Jeg blir litt forsinket.', 'Ich verspäte mich etwas.'], ['Hvilken dag er det i dag?', 'Welcher Tag ist heute?'],
      ['Vi ses på mandag.', 'Wir sehen uns am Montag.'], ['Om en uke.', 'In einer Woche.']] }
  ];
  g.Topics = { list: topics, byId: Object.fromEntries(topics.map(t => [t.id, t])) };
})(typeof window !== 'undefined' ? window : globalThis);
