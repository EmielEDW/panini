/* Panini WK 2026 tracker — UI + logica (vanilla JS, geen build nodig). */
(function () {
  "use strict";

  var CL = window.PaniniChecklist;
  var Store = window.Store;
  var app = document.getElementById("app");

  // ---- afgeleide data ----
  var baseStickers = CL.stickers.filter(function (s) { return !s.bonus; });
  var bonusStickers = CL.stickers.filter(function (s) { return s.bonus; });
  var byCode = {};
  CL.stickers.forEach(function (s) { byCode[s.code] = s; });

  var stickersBySection = {};
  CL.stickers.forEach(function (s) {
    (stickersBySection[s.sectionId] = stickersBySection[s.sectionId] || []).push(s);
  });

  // ---- router-state ----
  var view = "dashboard";
  var currentTeam = null;
  var missingFilter = "all"; // all | <confederatie>

  // ---- helpers ----
  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function ownedCount(list) {
    var n = 0;
    list.forEach(function (s) { if (Store.isOwned(s.code)) n++; });
    return n;
  }

  function pct(have, total) {
    return total === 0 ? 0 : Math.round((have / total) * 100);
  }

  function teamStats(team) {
    var list = stickersBySection[team.sectionId];
    var have = ownedCount(list);
    return { have: have, total: list.length, complete: have === list.length };
  }

  function totalDupes() {
    var n = 0;
    CL.stickers.forEach(function (s) { n += Store.dupes(s.code); });
    return n;
  }

  function progressBar(have, total) {
    var p = pct(have, total);
    var cls = p === 100 ? "full" : p >= 60 ? "mid" : "low";
    return '<div class="bar"><div class="bar-fill ' + cls + '" style="width:' + p + '%"></div></div>';
  }

  // coupon-collector: verwacht aantal getrokken stickers om de laatste m van n te halen = n * H_m
  function expectedStickers(n, m) {
    if (m <= 0) return 0;
    var h = 0;
    for (var k = 1; k <= m; k++) h += 1 / k;
    return n * h;
  }

  // ---- navigatie ----
  function nav(v, team) {
    view = v;
    if (team !== undefined) currentTeam = team;
    render();
    window.scrollTo(0, 0);
  }

  var TABS = [
    ["dashboard", "📊 Dashboard"],
    ["teams", "🌍 Teams"],
    ["missing", "🔎 Wat mis ik"],
    ["dupes", "🔁 Dubbels"],
    ["stats", "📈 Stats"],
    ["calc", "🧮 Calculator"]
  ];

  function header() {
    var baseHave = ownedCount(baseStickers);
    var tabs = TABS.map(function (t) {
      var active = (view === t[0] || (view === "team" && t[0] === "teams")) ? " active" : "";
      return '<button class="tab' + active + '" data-nav="' + t[0] + '">' + t[1] + "</button>";
    }).join("");
    return (
      '<header class="topbar">' +
        '<div class="brand"><span class="ball">⚽</span><div><h1>Panini WK 2026</h1>' +
        '<span class="sub">' + baseHave + " / " + CL.baseCount + " stickers — " + pct(baseHave, CL.baseCount) + "% compleet</span></div></div>" +
        '<div class="actions">' +
          '<button class="btn" data-action="theme" title="Wissel thema">' + (Store.theme() === "light" ? "🌙 Donker" : "☀︎ Licht") + "</button>" +
          '<button class="btn" data-action="export">⬇︎ Backup</button>' +
          '<button class="btn" data-action="import">⬆︎ Inladen</button>' +
          '<input type="file" id="import-file" accept="application/json" hidden>' +
        "</div>" +
      "</header>" +
      '<nav class="tabs">' + tabs + "</nav>"
    );
  }

  // ---- views ----
  function viewDashboard() {
    var baseHave = ownedCount(baseStickers);
    var teamsComplete = CL.teams.filter(function (t) { return teamStats(t).complete; }).length;
    var dupes = totalDupes();
    var bonusHave = ownedCount(bonusStickers);
    var missing = CL.baseCount - baseHave;

    var nearly = CL.teams
      .map(function (t) { return { t: t, s: teamStats(t) }; })
      .filter(function (x) { return !x.s.complete && x.s.have > 0; })
      .sort(function (a, b) { return (b.s.have / b.s.total) - (a.s.have / a.s.total); })
      .slice(0, 6);

    var cards =
      card("Album compleet", pct(baseHave, CL.baseCount) + "%", baseHave + " / " + CL.baseCount) +
      card("Nog nodig", String(missing), "stickers te gaan") +
      card("Teams compleet", teamsComplete + " / 48", "volledige landen") +
      card("Dubbels", String(dupes), "om te ruilen") +
      card("Bonus", bonusHave + " / " + bonusStickers.length, "Coca-Cola + Extra");

    var nearlyHtml = nearly.length
      ? nearly.map(function (x) {
          return '<button class="mini-team" data-team="' + x.t.code + '">' +
            '<span class="flag">' + x.t.flag + "</span>" +
            '<span class="mt-name">' + esc(x.t.name) + "</span>" +
            '<span class="mt-count">' + x.s.have + "/" + x.s.total + "</span>" +
            progressBar(x.s.have, x.s.total) + "</button>";
        }).join("")
      : '<p class="muted">Nog niets afgevinkt. Ga naar <b>Teams</b> om te beginnen.</p>';

    return (
      '<section class="grid-cards">' +
        '<div class="big-progress">' +
          "<h2>Voortgang van het boek</h2>" +
          progressBar(baseHave, CL.baseCount) +
          '<p class="muted">' + baseHave + " van " + CL.baseCount + " stickers — nog " + missing + " te gaan</p>" +
        "</div>" +
        '<div class="cards">' + cards + "</div>" +
      "</section>" +
      '<section class="panel"><h2>Bijna compleet</h2><div class="mini-teams">' + nearlyHtml + "</div></section>"
    );
  }

  function card(title, big, sub) {
    return '<div class="stat-card"><div class="sc-title">' + esc(title) + '</div><div class="sc-big">' + esc(big) + '</div><div class="sc-sub">' + esc(sub) + "</div></div>";
  }

  function viewTeams() {
    var rows = CL.teams.map(function (t) {
      var s = teamStats(t);
      var cls = s.complete ? "complete" : s.have === 0 ? "empty" : "partial";
      return '<button class="team-card ' + cls + '" data-team="' + t.code + '">' +
        '<div class="tc-head"><span class="flag">' + t.flag + '</span><span class="tc-name">' + esc(t.name) + "</span>" +
        (s.complete ? '<span class="badge-ok">✓</span>' : "") + "</div>" +
        '<div class="tc-count">' + s.have + " / " + s.total + "</div>" +
        progressBar(s.have, s.total) +
        '<div class="tc-conf">' + t.confederation + "</div>" +
        "</button>";
    }).join("");
    return '<section class="panel"><h2>Teams (48)</h2><div class="teams-grid">' + rows + "</div></section>" + bonusSectionsHtml();
  }

  function bonusSectionsHtml() {
    return ["cocacola", "extra"].map(function (id) {
      var sec = CL.sections.filter(function (s) { return s.id === id; })[0];
      var list = stickersBySection[id];
      var have = ownedCount(list);
      return '<section class="panel"><h2>' + esc(sec.title) + " <small>" + have + "/" + list.length + "</small></h2>" +
        '<div class="sticker-grid">' + list.map(stickerTile).join("") + "</div></section>";
    }).join("");
  }

  function viewTeamDetail() {
    var team = CL.teams.filter(function (t) { return t.code === currentTeam; })[0];
    if (!team) return viewTeams();
    var list = stickersBySection[team.sectionId];
    var s = teamStats(team);
    return (
      '<section class="panel">' +
        '<div class="detail-head">' +
          '<button class="btn ghost" data-nav="teams">← Teams</button>' +
          "<h2>" + team.flag + " " + esc(team.name) + ' <small>' + s.have + "/" + s.total + "</small></h2>" +
          '<div class="detail-actions">' +
            '<button class="btn" data-bulk="all" data-team="' + team.code + '">Alles afvinken</button>' +
            '<button class="btn ghost" data-bulk="none" data-team="' + team.code + '">Wissen</button>' +
          "</div>" +
        "</div>" +
        progressBar(s.have, s.total) +
        '<p class="muted">Klik een sticker om aan/af te vinken. Gebruik − / + voor dubbels. Klik ✎ om de naam aan te passen.</p>' +
        '<div class="sticker-grid">' + list.map(stickerTile).join("") + "</div>" +
      "</section>"
    );
  }

  function stickerTile(s) {
    var owned = Store.isOwned(s.code);
    var dupes = Store.dupes(s.code);
    var name = Store.name(s.code, s.name);
    var typeTag = s.type === "logo" ? "Logo" : s.type === "teamphoto" ? "Foto" : s.type === "legend" ? "Legend" : s.type === "special" ? "Special" : s.type === "intro" ? "Intro" : "";
    return (
      '<div class="tile ' + (owned ? "owned" : "missing") + '" data-toggle="' + s.code + '">' +
        '<button class="edit-name" data-edit="' + s.code + '" title="Naam aanpassen">✎</button>' +
        '<div class="tile-num">' + esc(s.code) + (typeTag ? ' <span class="tag">' + typeTag + "</span>" : "") + "</div>" +
        '<div class="tile-name">' + esc(name) + "</div>" +
        '<div class="tile-foot">' +
          '<div class="dupe-ctl' + (dupes > 0 ? " has" : "") + '" title="Dubbels (extra exemplaren)">' +
            '<button class="dupe-btn" data-dupe="-' + s.code + '" title="Dubbel eraf">−</button>' +
            '<span class="dupe-val">' + dupes + "</span>" +
            '<button class="dupe-btn" data-dupe="+' + s.code + '" title="Dubbel erbij">+</button>' +
          "</div>" +
          '<div class="tile-check">' + (owned ? "✓" : "") + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function viewMissing() {
    var confs = ["all", "UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];
    var filterBtns = confs.map(function (c) {
      return '<button class="chip' + (missingFilter === c ? " active" : "") + '" data-filter="' + c + '">' + (c === "all" ? "Alles" : c) + "</button>";
    }).join("");

    var teamsToShow = CL.teams.filter(function (t) { return missingFilter === "all" || t.confederation === missingFilter; });
    var blocks = [];
    var totalMissing = 0;

    teamsToShow.forEach(function (t) {
      var miss = stickersBySection[t.sectionId].filter(function (s) { return !Store.isOwned(s.code); });
      totalMissing += miss.length;
      if (miss.length === 0) return;
      blocks.push(
        '<div class="miss-block"><h3>' + t.flag + " " + esc(t.name) + ' <small>' + miss.length + " missend</small></h3>" +
        '<ul class="miss-list">' + miss.map(function (s) {
          return "<li><span class='mc'>" + esc(s.code) + "</span> " + esc(Store.name(s.code, s.name)) + "</li>";
        }).join("") + "</ul></div>"
      );
    });

    if (missingFilter === "all") {
      ["intro", "legends"].forEach(function (id) {
        var miss = stickersBySection[id].filter(function (s) { return !Store.isOwned(s.code); });
        totalMissing += miss.length;
        if (!miss.length) return;
        var sec = CL.sections.filter(function (x) { return x.id === id; })[0];
        blocks.unshift(
          '<div class="miss-block"><h3>' + esc(sec.title) + ' <small>' + miss.length + " missend</small></h3>" +
          '<ul class="miss-list">' + miss.map(function (s) {
            return "<li><span class='mc'>" + esc(s.code) + "</span> " + esc(Store.name(s.code, s.name)) + "</li>";
          }).join("") + "</ul></div>"
        );
      });
    }

    var body = blocks.length ? blocks.join("") : '<p class="muted">Niks meer missend in deze selectie! 🎉</p>';
    return (
      '<section class="panel">' +
        '<div class="detail-head"><h2>Wat mis ik nog <small>' + totalMissing + " stickers</small></h2>" +
          '<button class="btn" data-action="copy-missing">📋 Kopieer lijst</button></div>' +
        '<div class="chips">' + filterBtns + "</div>" +
        '<div class="miss-wrap">' + body + "</div>" +
      "</section>"
    );
  }

  function viewDupes() {
    var dupeStickers = CL.stickers.filter(function (s) { return Store.dupes(s.code) > 0; });
    var total = dupeStickers.reduce(function (a, s) { return a + Store.dupes(s.code); }, 0);
    var rows = dupeStickers.length
      ? dupeStickers.map(function (s) {
          return '<div class="dupe-row"><span class="mc">' + esc(s.code) + "</span><span class='dr-name'>" + esc(Store.name(s.code, s.name)) + "</span>" +
            '<span class="stepper"><button class="btn ghost" data-dupe="-' + s.code + '">−</button>' +
            "<b>" + Store.dupes(s.code) + "</b>" +
            '<button class="btn ghost" data-dupe="+' + s.code + '">+</button></span></div>';
        }).join("")
      : '<p class="muted">Nog geen dubbels ingevoerd. Voeg ze toe via een team-sticker of zoek hieronder.</p>';

    return (
      '<section class="panel">' +
        "<h2>Dubbels <small>" + total + " stuks om te ruilen</small></h2>" +
        '<div class="dupe-add"><input id="dupe-search" placeholder="Zoek sticker-code (bv. ARG5) of naam…">' +
          '<button class="btn" data-action="copy-dupes">📋 Kopieer ruillijst</button></div>' +
        '<div id="dupe-search-results" class="search-results"></div>' +
        '<div class="dupe-list">' + rows + "</div>" +
      "</section>"
    );
  }

  function viewStats() {
    var sectionRows = [];
    function row(title, list) {
      var have = ownedCount(list);
      return '<div class="stat-row"><div class="sr-head"><span>' + esc(title) + "</span><span>" + have + "/" + list.length + "</span></div>" + progressBar(have, list.length) + "</div>";
    }
    sectionRows.push(row("Intro", stickersBySection["intro"]));
    sectionRows.push(row("Legends", stickersBySection["legends"]));
    sectionRows.push(row("Coca-Cola (bonus)", stickersBySection["cocacola"]));
    sectionRows.push(row("Extra (bonus)", stickersBySection["extra"]));

    var confs = ["UEFA", "CONMEBOL", "CONCACAF", "CAF", "AFC", "OFC"];
    var confRows = confs.map(function (c) {
      var list = [];
      CL.teams.filter(function (t) { return t.confederation === c; }).forEach(function (t) {
        list = list.concat(stickersBySection[t.sectionId]);
      });
      return row(c, list);
    }).join("");

    var sortedTeams = CL.teams
      .map(function (t) { return { t: t, s: teamStats(t) }; })
      .sort(function (a, b) { return (a.s.have / a.s.total) - (b.s.have / b.s.total); });
    var worst = sortedTeams.slice(0, 5).map(function (x) {
      return '<li><button class="link" data-team="' + x.t.code + '">' + x.t.flag + " " + esc(x.t.name) + "</button> — " + x.s.have + "/" + x.s.total + "</li>";
    }).join("");

    return (
      '<section class="panel"><h2>Per sectie</h2>' + sectionRows.join("") + "</section>" +
      '<section class="panel"><h2>Per confederatie</h2>' + confRows + "</section>" +
      '<section class="panel"><h2>Grootste gaten</h2><ul class="gap-list">' + worst + "</ul></section>"
    );
  }

  function viewCalc() {
    // Pool = stickers die in normale pakjes zitten (alle base 980). Bonus (CC/Extra) tellen niet mee.
    var pool = baseStickers.length; // 980
    var have = ownedCount(baseStickers);
    var missing = pool - have;
    var price = Store.packPrice();

    var expDraws = expectedStickers(pool, missing);
    var packsNoTrade = Math.ceil(expDraws / CL.packSize);
    var packsTrade = Math.ceil(missing / CL.packSize);
    var costNoTrade = packsNoTrade * price;
    var costTrade = packsTrade * price;

    function money(v) { return "€" + v.toFixed(2).replace(".", ","); }

    var done = missing === 0;
    return (
      '<section class="panel">' +
        "<h2>Pakjes-calculator</h2>" +
        '<p class="muted">Schatting op basis van je huidige voortgang. "Zonder ruilen" gebruikt de coupon-collector-formule (elk pakje is willekeurig, dubbels stapelen op). "Met ruilen" gaat ervan uit dat je elke dubbel 1-op-1 ruilt.</p>' +
        '<div class="calc-input"><label>Prijs per pakje (' + CL.packSize + ' stickers): €' +
          '<input id="pack-price" type="number" min="0.1" step="0.05" value="' + price + '"></label></div>' +
        '<div class="calc-grid">' +
          card("Nog nodig", String(missing), "van " + pool + " stickers") +
          card("Zonder ruilen", done ? "—" : packsNoTrade + " pakjes", done ? "compleet!" : money(costNoTrade)) +
          card("Met ruilen (1:1)", done ? "—" : packsTrade + " pakjes", done ? "compleet!" : money(costTrade)) +
        "</div>" +
        (done ? '<p class="done">🎉 Je album is compleet!</p>' :
          '<p class="muted">Zonder ruilen verwacht je ±' + Math.round(expDraws) + ' losse stickers te trekken (incl. dubbels) om de laatste ' + missing + ' te vinden. Ruilen scheelt enorm: van ' + money(costNoTrade) + " naar " + money(costTrade) + ".</p>") +
      "</section>"
    );
  }

  // ---- render ----
  function render() {
    var body;
    switch (view) {
      case "teams": body = viewTeams(); break;
      case "team": body = viewTeamDetail(); break;
      case "missing": body = viewMissing(); break;
      case "dupes": body = viewDupes(); break;
      case "stats": body = viewStats(); break;
      case "calc": body = viewCalc(); break;
      default: body = viewDashboard();
    }
    app.innerHTML = header() + '<main class="content">' + body + "</main>";
  }

  // ---- search voor dubbels ----
  function renderDupeSearch(q) {
    var box = document.getElementById("dupe-search-results");
    if (!box) return;
    q = q.trim().toLowerCase();
    if (q.length < 2) { box.innerHTML = ""; return; }
    var matches = CL.stickers.filter(function (s) {
      return s.code.toLowerCase().indexOf(q) === 0 ||
        Store.name(s.code, s.name).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 12);
    box.innerHTML = matches.map(function (s) {
      return '<div class="dupe-row"><span class="mc">' + esc(s.code) + "</span><span class='dr-name'>" + esc(Store.name(s.code, s.name)) + "</span>" +
        '<span class="stepper"><button class="btn ghost" data-dupe="-' + s.code + '">−</button><b>' + Store.dupes(s.code) +
        '</b><button class="btn ghost" data-dupe="+' + s.code + '">+</button></span></div>';
    }).join("") || '<p class="muted">Geen sticker gevonden.</p>';
  }

  // ---- export-lijsten ----
  function copyToClipboard(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, function () { fallbackCopy(text, okMsg); });
    } else {
      fallbackCopy(text, okMsg);
    }
  }
  function fallbackCopy(text, okMsg) {
    var ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); toast(okMsg); } catch (e) { toast("Kopiëren niet gelukt"); }
    document.body.removeChild(ta);
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 10);
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 1800);
  }

  function missingText() {
    var lines = ["Panini WK 2026 — nog nodig:"];
    CL.sections.forEach(function (sec) {
      var miss = stickersBySection[sec.id].filter(function (s) { return !Store.isOwned(s.code); });
      if (!miss.length) return;
      lines.push("");
      lines.push("# " + sec.title + " (" + miss.length + ")");
      miss.forEach(function (s) { lines.push(s.code + " - " + Store.name(s.code, s.name)); });
    });
    return lines.join("\n");
  }
  function dupesText() {
    var lines = ["Panini WK 2026 — dubbels om te ruilen:"];
    CL.stickers.forEach(function (s) {
      var d = Store.dupes(s.code);
      if (d > 0) lines.push(s.code + " - " + Store.name(s.code, s.name) + " (x" + d + ")");
    });
    return lines.join("\n");
  }

  // ---- event delegation ----
  app.addEventListener("click", function (e) {
    // klik op de dubbel-teller (niet de knop) mag de sticker niet aan/af vinken
    if (e.target.closest(".dupe-ctl") && !e.target.closest("[data-dupe]")) return;
    var el = e.target.closest("[data-nav],[data-team],[data-toggle],[data-edit],[data-bulk],[data-dupe],[data-filter],[data-action]");
    if (!el) return;

    if (el.hasAttribute("data-edit")) {
      e.stopPropagation();
      var code = el.getAttribute("data-edit");
      var s = byCode[code];
      var current = Store.name(code, s.name);
      var v = window.prompt("Naam voor " + code + ":", current);
      if (v !== null) { Store.setName(code, v); render(); }
      return;
    }
    if (el.hasAttribute("data-toggle")) {
      Store.toggleOwned(el.getAttribute("data-toggle"));
      render();
      return;
    }
    if (el.hasAttribute("data-bulk")) {
      var teamCode = el.getAttribute("data-team");
      var team = CL.teams.filter(function (t) { return t.code === teamCode; })[0];
      var all = el.getAttribute("data-bulk") === "all";
      stickersBySection[team.sectionId].forEach(function (s) { Store.setOwned(s.code, all); });
      render();
      return;
    }
    if (el.hasAttribute("data-dupe")) {
      var raw = el.getAttribute("data-dupe");
      var delta = raw[0] === "-" ? -1 : 1;
      Store.addDupe(raw.slice(1), delta);
      // bij dubbels-zoeken: enkel resultaten + lijst verversen ipv volledige re-render zou kunnen,
      // maar volledige render houdt alles consistent.
      var q = document.getElementById("dupe-search");
      var qv = q ? q.value : null;
      render();
      if (qv) { var nq = document.getElementById("dupe-search"); if (nq) { nq.value = qv; renderDupeSearch(qv); } }
      return;
    }
    if (el.hasAttribute("data-team")) { nav("team", el.getAttribute("data-team")); return; }
    if (el.hasAttribute("data-filter")) { missingFilter = el.getAttribute("data-filter"); render(); return; }
    if (el.hasAttribute("data-nav")) { nav(el.getAttribute("data-nav")); return; }

    if (el.hasAttribute("data-action")) {
      var act = el.getAttribute("data-action");
      if (act === "theme") { Store.toggleTheme(); applyTheme(); render(); }
      else if (act === "export") Store.exportJSON();
      else if (act === "import") { var f = document.getElementById("import-file"); if (f) f.click(); }
      else if (act === "copy-missing") copyToClipboard(missingText(), "Mislijst gekopieerd!");
      else if (act === "copy-dupes") copyToClipboard(dupesText(), "Ruillijst gekopieerd!");
      return;
    }
  });

  app.addEventListener("change", function (e) {
    if (e.target.id === "import-file" && e.target.files && e.target.files[0]) {
      Store.importJSON(e.target.files[0], function (err) {
        if (err) { alert("Inladen mislukt: ongeldig bestand."); return; }
        toast("Backup ingeladen!");
        render();
      });
    }
    if (e.target.id === "pack-price") { Store.setPackPrice(e.target.value); render(); }
  });

  app.addEventListener("input", function (e) {
    if (e.target.id === "dupe-search") renderDupeSearch(e.target.value);
  });

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", Store.theme());
  }

  applyTheme();
  render();
})();
