/*
 * Lokale opslag (localStorage). Bewaart:
 *   - collection: { <code>: { owned: bool, dupes: int } }
 *   - settings:   { packPrice: number, theme: "dark"|"light" }
 * Plus export/import naar JSON-bestand.
 */
(function () {
  "use strict";

  var KEY = "panini-wk2026-v1";

  var state = {
    collection: {},
    settings: { packPrice: window.PaniniChecklist.defaultPackPrice, theme: "dark" }
  };

  function defaultSettings() {
    return { packPrice: window.PaniniChecklist.defaultPackPrice, theme: "dark" };
  }

  var listeners = [];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        state.collection = parsed.collection || {};
        state.settings = Object.assign(defaultSettings(), parsed.settings || {});
      }
    } catch (e) {
      console.warn("Kon opslag niet laden:", e);
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Kon opslag niet bewaren:", e);
    }
    listeners.forEach(function (fn) { fn(); });
  }

  function entry(code) {
    return state.collection[code] || { owned: false, dupes: 0 };
  }

  var Store = {
    onChange: function (fn) { listeners.push(fn); },

    isOwned: function (code) { return !!(state.collection[code] && state.collection[code].owned); },
    dupes: function (code) { return (state.collection[code] && state.collection[code].dupes) || 0; },

    setOwned: function (code, owned) {
      var e = entry(code);
      state.collection[code] = { owned: owned, dupes: owned ? e.dupes : 0 };
      persist();
    },

    toggleOwned: function (code) {
      this.setOwned(code, !this.isOwned(code));
    },

    // dubbels = extra exemplaren bovenop de ene die je in het album plakt
    setDupes: function (code, n) {
      n = Math.max(0, n | 0);
      var e = entry(code);
      // wie dubbels heeft, bezit de sticker sowieso
      state.collection[code] = { owned: n > 0 ? true : e.owned, dupes: n };
      persist();
    },

    addDupe: function (code, delta) {
      this.setDupes(code, this.dupes(code) + delta);
    },

    packPrice: function () { return state.settings.packPrice; },
    setPackPrice: function (p) {
      var v = parseFloat(p);
      state.settings.packPrice = isNaN(v) || v <= 0 ? window.PaniniChecklist.defaultPackPrice : v;
      persist();
    },

    theme: function () { return state.settings.theme === "light" ? "light" : "dark"; },
    setTheme: function (t) {
      state.settings.theme = t === "light" ? "light" : "dark";
      persist();
    },
    toggleTheme: function () {
      this.setTheme(this.theme() === "light" ? "dark" : "light");
    },

    resetAll: function () {
      state.collection = {};
      state.settings = defaultSettings();
      persist();
    },

    exportJSON: function () {
      var data = JSON.stringify(state, null, 2);
      var blob = new Blob([data], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var d = new Date();
      var stamp = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
      a.href = url;
      a.download = "panini-wk2026-backup-" + stamp + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },

    importJSON: function (file, cb) {
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var parsed = JSON.parse(reader.result);
          state.collection = parsed.collection || {};
          state.settings = Object.assign(defaultSettings(), parsed.settings || {});
          persist();
          cb(null);
        } catch (e) {
          cb(e);
        }
      };
      reader.onerror = function () { cb(reader.error); };
      reader.readAsText(file);
    }
  };

  load();
  window.Store = Store;
})();
