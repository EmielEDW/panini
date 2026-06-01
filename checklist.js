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

  // Official album order: by group A→L, within each group by draw position.
  // Groups per the FIFA final draw of 5 Dec 2025.
  // [name, FIFA code, flag emoji, confederation, group]
  var TEAMS = [
    // Group A
    ["Mexico", "MEX", "🇲🇽", "CONCACAF", "A"],
    ["South Africa", "RSA", "🇿🇦", "CAF", "A"],
    ["South Korea", "KOR", "🇰🇷", "AFC", "A"],
    ["Czechia", "CZE", "🇨🇿", "UEFA", "A"],
    // Group B
    ["Canada", "CAN", "🇨🇦", "CONCACAF", "B"],
    ["Bosnia & Herzegovina", "BIH", "🇧🇦", "UEFA", "B"],
    ["Qatar", "QAT", "🇶🇦", "AFC", "B"],
    ["Switzerland", "SUI", "🇨🇭", "UEFA", "B"],
    // Group C
    ["Brazil", "BRA", "🇧🇷", "CONMEBOL", "C"],
    ["Morocco", "MAR", "🇲🇦", "CAF", "C"],
    ["Haiti", "HAI", "🇭🇹", "CONCACAF", "C"],
    ["Scotland", "SCO", "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "UEFA", "C"],
    // Group D
    ["United States", "USA", "🇺🇸", "CONCACAF", "D"],
    ["Paraguay", "PAR", "🇵🇾", "CONMEBOL", "D"],
    ["Australia", "AUS", "🇦🇺", "AFC", "D"],
    ["Türkiye", "TUR", "🇹🇷", "UEFA", "D"],
    // Group E
    ["Germany", "GER", "🇩🇪", "UEFA", "E"],
    ["Curaçao", "CUW", "🇨🇼", "CONCACAF", "E"],
    ["Ivory Coast", "CIV", "🇨🇮", "CAF", "E"],
    ["Ecuador", "ECU", "🇪🇨", "CONMEBOL", "E"],
    // Group F
    ["Netherlands", "NED", "🇳🇱", "UEFA", "F"],
    ["Japan", "JPN", "🇯🇵", "AFC", "F"],
    ["Sweden", "SWE", "🇸🇪", "UEFA", "F"],
    ["Tunisia", "TUN", "🇹🇳", "CAF", "F"],
    // Group G
    ["Belgium", "BEL", "🇧🇪", "UEFA", "G"],
    ["Egypt", "EGY", "🇪🇬", "CAF", "G"],
    ["Iran", "IRN", "🇮🇷", "AFC", "G"],
    ["New Zealand", "NZL", "🇳🇿", "OFC", "G"],
    // Group H
    ["Spain", "ESP", "🇪🇸", "UEFA", "H"],
    ["Cape Verde", "CPV", "🇨🇻", "CAF", "H"],
    ["Saudi Arabia", "KSA", "🇸🇦", "AFC", "H"],
    ["Uruguay", "URU", "🇺🇾", "CONMEBOL", "H"],
    // Group I
    ["France", "FRA", "🇫🇷", "UEFA", "I"],
    ["Senegal", "SEN", "🇸🇳", "CAF", "I"],
    ["Iraq", "IRQ", "🇮🇶", "AFC", "I"],
    ["Norway", "NOR", "🇳🇴", "UEFA", "I"],
    // Group J
    ["Argentina", "ARG", "🇦🇷", "CONMEBOL", "J"],
    ["Algeria", "ALG", "🇩🇿", "CAF", "J"],
    ["Austria", "AUT", "🇦🇹", "UEFA", "J"],
    ["Jordan", "JOR", "🇯🇴", "AFC", "J"],
    // Group K
    ["Portugal", "POR", "🇵🇹", "UEFA", "K"],
    ["DR Congo", "COD", "🇨🇩", "CAF", "K"],
    ["Uzbekistan", "UZB", "🇺🇿", "AFC", "K"],
    ["Colombia", "COL", "🇨🇴", "CONMEBOL", "K"],
    // Group L
    ["England", "ENG", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "UEFA", "L"],
    ["Croatia", "CRO", "🇭🇷", "UEFA", "L"],
    ["Ghana", "GHA", "🇬🇭", "CAF", "L"],
    ["Panama", "PAN", "🇵🇦", "CONCACAF", "L"]
  ];

  var INTRO = [
    "Official emblem",
    "Host nation United States",
    "Host nation Canada",
    "Host nation Mexico",
    "Mascots",
    "World Cup Trophy",
    "Official poster",
    "Official ball",
    "Stadiums"
  ];

  var LEGENDS = [
    "Brazil 1970",
    "Argentina 1986 — Maradona",
    "Italy 1982",
    "France 1998 — Zidane",
    "Brazil 2002 — Ronaldo",
    "Germany 2014",
    "Spain 2010",
    "England 1966",
    "Netherlands — Cruyff",
    "Argentina 2022 — Messi",
    "FIFA Museum"
  ];

  var stickers = [];
  var sections = [];
  var teams = [];

  function add(sticker) {
    stickers.push(sticker);
  }

  // 1) Intro
  sections.push({ id: "intro", title: "Tournament & Intro", kind: "intro" });
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

  // FIFA-code → ISO-3166 alpha-2 (voor echte vlag-afbeeldingen, ipv emoji die in Chrome/Windows als code tonen)
  var ISO2 = {
    MEX: "mx", RSA: "za", KOR: "kr", CZE: "cz", CAN: "ca", BIH: "ba", QAT: "qa", SUI: "ch",
    BRA: "br", MAR: "ma", HAI: "ht", SCO: "gb-sct", USA: "us", PAR: "py", AUS: "au", TUR: "tr",
    GER: "de", CUW: "cw", CIV: "ci", ECU: "ec", NED: "nl", JPN: "jp", SWE: "se", TUN: "tn",
    BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz", ESP: "es", CPV: "cv", KSA: "sa", URU: "uy",
    FRA: "fr", SEN: "sn", IRQ: "iq", NOR: "no", ARG: "ar", ALG: "dz", AUT: "at", JOR: "jo",
    POR: "pt", COD: "cd", UZB: "uz", COL: "co", ENG: "gb-eng", CRO: "hr", GHA: "gh", PAN: "pa"
  };

  // 3) Teams (48 x 20)
  TEAMS.forEach(function (t) {
    var name = t[0], code = t[1], flag = t[2], conf = t[3], group = t[4];
    var iso = ISO2[code] || null;
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
    teams.push({ code: code, name: name, flag: flag, iso: iso, confederation: conf, group: group, sectionId: sectionId });

    for (var n = 1; n <= 20; n++) {
      var type, label;
      if (n === 1) {
        type = "logo";
        label = "Team logo (Foil)";
      } else if (n === 13) {
        type = "teamphoto";
        label = "Team photo";
      } else {
        type = "player";
        // number players sequentially, skipping logo (1) and team photo (13)
        label = name + " player " + (n < 13 ? n - 1 : n - 2);
      }
      add({
        code: code + n,
        number: n,
        name: label,
        country: name,
        countryFlag: flag,
        iso: iso,
        sectionId: sectionId,
        type: type,
        inPacks: true,
        bonus: false
      });
    }
  });

  // 4) Coca-Cola exclusives (niet in pakjes)
  sections.push({ id: "cocacola", title: "Coca-Cola Exclusive", kind: "bonus" });
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
