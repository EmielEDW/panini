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

  // [naam, FIFA-code, vlag-emoji, confederatie]
  var TEAMS = [
    // UEFA (16)
    ["Oostenrijk", "AUT", "🇦🇹", "UEFA"],
    ["België", "BEL", "🇧🇪", "UEFA"],
    ["Bosnië-Herzegovina", "BIH", "🇧🇦", "UEFA"],
    ["Kroatië", "CRO", "🇭🇷", "UEFA"],
    ["Tsjechië", "CZE", "🇨🇿", "UEFA"],
    ["Engeland", "ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "UEFA"],
    ["Frankrijk", "FRA", "🇫🇷", "UEFA"],
    ["Duitsland", "GER", "🇩🇪", "UEFA"],
    ["Nederland", "NED", "🇳🇱", "UEFA"],
    ["Noorwegen", "NOR", "🇳🇴", "UEFA"],
    ["Portugal", "POR", "🇵🇹", "UEFA"],
    ["Schotland", "SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "UEFA"],
    ["Spanje", "ESP", "🇪🇸", "UEFA"],
    ["Zweden", "SWE", "🇸🇪", "UEFA"],
    ["Zwitserland", "SUI", "🇨🇭", "UEFA"],
    ["Turkije", "TUR", "🇹🇷", "UEFA"],
    // CONMEBOL (6)
    ["Argentinië", "ARG", "🇦🇷", "CONMEBOL"],
    ["Brazilië", "BRA", "🇧🇷", "CONMEBOL"],
    ["Colombia", "COL", "🇨🇴", "CONMEBOL"],
    ["Ecuador", "ECU", "🇪🇨", "CONMEBOL"],
    ["Paraguay", "PAR", "🇵🇾", "CONMEBOL"],
    ["Uruguay", "URU", "🇺🇾", "CONMEBOL"],
    // CONCACAF (6)
    ["Canada", "CAN", "🇨🇦", "CONCACAF"],
    ["Curaçao", "CUW", "🇨🇼", "CONCACAF"],
    ["Haïti", "HAI", "🇭🇹", "CONCACAF"],
    ["Mexico", "MEX", "🇲🇽", "CONCACAF"],
    ["Panama", "PAN", "🇵🇦", "CONCACAF"],
    ["Verenigde Staten", "USA", "🇺🇸", "CONCACAF"],
    // CAF (10)
    ["Algerije", "ALG", "🇩🇿", "CAF"],
    ["Kaapverdië", "CPV", "🇨🇻", "CAF"],
    ["DR Congo", "COD", "🇨🇩", "CAF"],
    ["Egypte", "EGY", "🇪🇬", "CAF"],
    ["Ghana", "GHA", "🇬🇭", "CAF"],
    ["Ivoorkust", "CIV", "🇨🇮", "CAF"],
    ["Marokko", "MAR", "🇲🇦", "CAF"],
    ["Senegal", "SEN", "🇸🇳", "CAF"],
    ["Zuid-Afrika", "RSA", "🇿🇦", "CAF"],
    ["Tunesië", "TUN", "🇹🇳", "CAF"],
    // AFC (9)
    ["Australië", "AUS", "🇦🇺", "AFC"],
    ["Iran", "IRN", "🇮🇷", "AFC"],
    ["Irak", "IRQ", "🇮🇶", "AFC"],
    ["Japan", "JPN", "🇯🇵", "AFC"],
    ["Jordanië", "JOR", "🇯🇴", "AFC"],
    ["Qatar", "QAT", "🇶🇦", "AFC"],
    ["Saoedi-Arabië", "KSA", "🇸🇦", "AFC"],
    ["Zuid-Korea", "KOR", "🇰🇷", "AFC"],
    ["Oezbekistan", "UZB", "🇺🇿", "AFC"],
    // OFC (1)
    ["Nieuw-Zeeland", "NZL", "🇳🇿", "OFC"]
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
    var name = t[0], code = t[1], flag = t[2], conf = t[3];
    var sectionId = "team-" + code;
    sections.push({
      id: sectionId,
      title: name,
      kind: "team",
      teamCode: code,
      teamFlag: flag,
      confederation: conf
    });
    teams.push({ code: code, name: name, flag: flag, confederation: conf, sectionId: sectionId });

    for (var n = 1; n <= 20; n++) {
      var type, label;
      if (n === 1) {
        type = "logo";
        label = "Teamlogo (Foil)";
      } else if (n === 2) {
        type = "teamphoto";
        label = "Teamfoto";
      } else {
        type = "player";
        label = name + " speler " + (n - 2);
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
