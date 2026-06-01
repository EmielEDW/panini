/*
 * Panini FIFA World Cup 2026 — checklist data + builder
 *
 * Structuur (980 "boek"-stickers + bonus):
 *   - Intro        FWC1..FWC9   (9)   gastlanden, mascottes, trofee, poster
 *   - Legends      FWC10..FWC20 (11)  FIFA Museum / oud-kampioenen
 *   - Teams        48 x 20      (960) logo(foil) + teamfoto + 18 spelers
 *   => samen 980 = het volledige album ("boek")
 *   - Coca-Cola    CC1..CC12    (12)  exclusief in flessen (niet in pakjes)
 *   - Extra        EX1..EX20    (20)  internationaal 1:100 (niet in normale pakjes)
 *
 * De spelersnamen zijn placeholders ("<Land> speler N"); je past ze inline aan
 * in de app (wordt lokaal bewaard). Teamnamen/codes/vlaggen kloppen al.
 */
(function () {
  "use strict";

  // Officiële albumvolgorde: per groep A→L, binnen de groep op lotingspositie.
  // Groepen volgens de FIFA-eindloting van 5 dec 2025.
  // [naam, FIFA-code, vlag-emoji, confederatie, groep]
  var TEAMS = [
    // Groep A
    ["Mexico", "MEX", "🇲🇽", "CONCACAF", "A"],
    ["Zuid-Afrika", "RSA", "🇿🇦", "CAF", "A"],
    ["Zuid-Korea", "KOR", "🇰🇷", "AFC", "A"],
    ["Tsjechië", "CZE", "🇨🇿", "UEFA", "A"],
    // Groep B
    ["Canada", "CAN", "🇨🇦", "CONCACAF", "B"],
    ["Bosnië-Herzegovina", "BIH", "🇧🇦", "UEFA", "B"],
    ["Qatar", "QAT", "🇶🇦", "AFC", "B"],
    ["Zwitserland", "SUI", "🇨🇭", "UEFA", "B"],
    // Groep C
    ["Brazilië", "BRA", "🇧🇷", "CONMEBOL", "C"],
    ["Marokko", "MAR", "🇲🇦", "CAF", "C"],
    ["Haïti", "HAI", "🇭🇹", "CONCACAF", "C"],
    ["Schotland", "SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "UEFA", "C"],
    // Groep D
    ["Verenigde Staten", "USA", "🇺🇸", "CONCACAF", "D"],
    ["Paraguay", "PAR", "🇵🇾", "CONMEBOL", "D"],
    ["Australië", "AUS", "🇦🇺", "AFC", "D"],
    ["Turkije", "TUR", "🇹🇷", "UEFA", "D"],
    // Groep E
    ["Duitsland", "GER", "🇩🇪", "UEFA", "E"],
    ["Curaçao", "CUW", "🇨🇼", "CONCACAF", "E"],
    ["Ivoorkust", "CIV", "🇨🇮", "CAF", "E"],
    ["Ecuador", "ECU", "🇪🇨", "CONMEBOL", "E"],
    // Groep F
    ["Nederland", "NED", "🇳🇱", "UEFA", "F"],
    ["Japan", "JPN", "🇯🇵", "AFC", "F"],
    ["Zweden", "SWE", "🇸🇪", "UEFA", "F"],
    ["Tunesië", "TUN", "🇹🇳", "CAF", "F"],
    // Groep G
    ["België", "BEL", "🇧🇪", "UEFA", "G"],
    ["Egypte", "EGY", "🇪🇬", "CAF", "G"],
    ["Iran", "IRN", "🇮🇷", "AFC", "G"],
    ["Nieuw-Zeeland", "NZL", "🇳🇿", "OFC", "G"],
    // Groep H
    ["Spanje", "ESP", "🇪🇸", "UEFA", "H"],
    ["Kaapverdië", "CPV", "🇨🇻", "CAF", "H"],
    ["Saoedi-Arabië", "KSA", "🇸🇦", "AFC", "H"],
    ["Uruguay", "URU", "🇺🇾", "CONMEBOL", "H"],
    // Groep I
    ["Frankrijk", "FRA", "🇫🇷", "UEFA", "I"],
    ["Senegal", "SEN", "🇸🇳", "CAF", "I"],
    ["Irak", "IRQ", "🇮🇶", "AFC", "I"],
    ["Noorwegen", "NOR", "🇳🇴", "UEFA", "I"],
    // Groep J
    ["Argentinië", "ARG", "🇦🇷", "CONMEBOL", "J"],
    ["Algerije", "ALG", "🇩🇿", "CAF", "J"],
    ["Oostenrijk", "AUT", "🇦🇹", "UEFA", "J"],
    ["Jordanië", "JOR", "🇯🇴", "AFC", "J"],
    // Groep K
    ["Portugal", "POR", "🇵🇹", "UEFA", "K"],
    ["DR Congo", "COD", "🇨🇩", "CAF", "K"],
    ["Oezbekistan", "UZB", "🇺🇿", "AFC", "K"],
    ["Colombia", "COL", "🇨🇴", "CONMEBOL", "K"],
    // Groep L
    ["Engeland", "ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "UEFA", "L"],
    ["Kroatië", "CRO", "🇭🇷", "UEFA", "L"],
    ["Ghana", "GHA", "🇬🇭", "CAF", "L"],
    ["Panama", "PAN", "🇵🇦", "CONCACAF", "L"]
  ];

  var INTRO = [
    "Officieel embleem",
    "Gastland Verenigde Staten",
    "Gastland Canada",
    "Gastland Mexico",
    "Mascottes",
    "WK-trofee",
    "Officiële poster",
    "Officiële bal",
    "Stadions"
  ];

  var LEGENDS = [
    "Brazilië 1970",
    "Argentinië 1986 — Maradona",
    "Italië 1982",
    "Frankrijk 1998 — Zidane",
    "Brazilië 2002 — Ronaldo",
    "Duitsland 2014",
    "Spanje 2010",
    "Engeland 1966",
    "Nederland — Cruijff",
    "Argentinië 2022 — Messi",
    "FIFA Museum"
  ];

  var stickers = [];
  var sections = [];
  var teams = [];

  function add(sticker) {
    stickers.push(sticker);
  }

  // 1) Intro
  sections.push({ id: "intro", title: "Tornooi & Intro", kind: "intro" });
  INTRO.forEach(function (name, i) {
    add({
      code: "FWC" + (i + 1),
      number: i + 1,
      name: name,
      country: "FIFA",
      countryFlag: "🌍",
      sectionId: "intro",
      type: i === 0 ? "logo" : "intro",
      inPacks: true,
      bonus: false
    });
  });

  // 2) Legends
  sections.push({ id: "legends", title: "Legends / FIFA Museum", kind: "legends" });
  LEGENDS.forEach(function (name, i) {
    add({
      code: "FWC" + (INTRO.length + i + 1),
      number: INTRO.length + i + 1,
      name: name,
      country: "FIFA",
      countryFlag: "🏆",
      sectionId: "legends",
      type: "legend",
      inPacks: true,
      bonus: false
    });
  });

  // 3) Teams (48 x 20)
  TEAMS.forEach(function (t) {
    var name = t[0], code = t[1], flag = t[2], conf = t[3], group = t[4];
    var sectionId = "team-" + code;
    sections.push({
      id: sectionId,
      title: name,
      kind: "team",
      teamCode: code,
      teamFlag: flag,
      confederation: conf,
      group: group
    });
    teams.push({ code: code, name: name, flag: flag, confederation: conf, group: group, sectionId: sectionId });

    for (var n = 1; n <= 20; n++) {
      var type, label;
      if (n === 1) {
        type = "logo";
        label = "Teamlogo (Foil)";
      } else if (n === 13) {
        type = "teamphoto";
        label = "Teamfoto";
      } else {
        type = "player";
        // spelers doorlopend nummeren, logo (1) en teamfoto (13) overslaan
        label = name + " speler " + (n < 13 ? n - 1 : n - 2);
      }
      add({
        code: code + n,
        number: n,
        name: label,
        country: name,
        countryFlag: flag,
        sectionId: sectionId,
        type: type,
        inPacks: true,
        bonus: false
      });
    }
  });

  // 4) Coca-Cola exclusives (niet in pakjes)
  sections.push({ id: "cocacola", title: "Coca-Cola Exclusief", kind: "bonus" });
  for (var c = 1; c <= 12; c++) {
    add({
      code: "CC" + c,
      number: c,
      name: "Coca-Cola sticker " + c,
      country: "Coca-Cola",
      countryFlag: "🥤",
      sectionId: "cocacola",
      type: "special",
      inPacks: false,
      bonus: true
    });
  }

  // 5) Extra stickers (internationaal, 1:100)
  sections.push({ id: "extra", title: "Extra Stickers (1:100)", kind: "bonus" });
  for (var e = 1; e <= 20; e++) {
    add({
      code: "EX" + e,
      number: e,
      name: "Extra sticker " + e,
      country: "Extra",
      countryFlag: "✨",
      sectionId: "extra",
      type: "special",
      inPacks: false,
      bonus: true
    });
  }

  var baseCount = stickers.filter(function (s) { return !s.bonus; }).length;

  window.PaniniChecklist = {
    stickers: stickers,
    sections: sections,
    teams: teams,
    baseCount: baseCount,          // = 980 (het "boek")
    totalCount: stickers.length,   // incl. bonus
    packSize: 7,
    defaultPackPrice: 1.5
  };
})();
