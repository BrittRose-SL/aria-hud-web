// A.R.I.A. Wearer HUD - shared query-param reader for MOAP panels.
//
// Each HUD prim's LSL script is the only thing that ever writes to this page:
// it rewrites PRIM_MEDIA_CURRENT_URL with fresh query params whenever the
// unit's state changes. This page never calls back out to anything - it just
// renders whatever the URL says, so per-wearer/per-unit isolation comes for
// free from each HUD being a separate in-world object with its own script.
(function (global) {
  function readParams() {
    return new URLSearchParams(window.location.search);
  }

  function get(key, fallback) {
    var v = readParams().get(key);
    if (v === null || v === "") {
      return fallback;
    }
    return v;
  }

  function getFloat(key, fallback) {
    var v = readParams().get(key);
    if (v === null || v === "") {
      return fallback;
    }
    var f = parseFloat(v);
    if (isNaN(f)) {
      return fallback;
    }
    return f;
  }

  function getInt(key, fallback) {
    var v = readParams().get(key);
    if (v === null || v === "") {
      return fallback;
    }
    var n = parseInt(v, 10);
    if (isNaN(n)) {
      return fallback;
    }
    return n;
  }

  function getBool(key, fallback) {
    var v = readParams().get(key);
    if (v === null || v === "") {
      return fallback;
    }
    return v === "1" || v.toLowerCase() === "true";
  }

  // Comma-separated list param, e.g. ?modules=Security,Diagnostics
  function getList(key, fallback) {
    var v = readParams().get(key);
    if (v === null || v === "") {
      return fallback;
    }
    return v.split(",").map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
  }

  function hasAnyParams() {
    var it = readParams().keys();
    return !it.next().done;
  }

  function clampPct(n) {
    return Math.max(0, Math.min(100, n));
  }

  global.AriaHud = {
    get: get,
    getFloat: getFloat,
    getInt: getInt,
    getBool: getBool,
    getList: getList,
    hasAnyParams: hasAnyParams,
    clampPct: clampPct
  };
})(window);
