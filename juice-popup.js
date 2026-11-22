// Gentle "buy the developer a juice" card for the UASU and KUSU calculators.
// Shows ONCE per visit, about 45 s after the visitor's first real input (so they are looking at their results),
// only while the tab is visible and only if the juice box isn't already open. Nothing is stored; it resets on reload.
(function () {
  var script = document.currentScript, prefix = (script && script.getAttribute("data-prefix")) || "";
  var DELAY = 45000, shown = false, armed = false, timer = null;
  function count(path, title) { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: prefix + path, title: title, event: true }); } catch (e) {} }
  function opener() { return document.getElementById("tipBtn") || document.querySelector(".tip-btn"); }
  function box() { return document.getElementById("tipRev") || document.getElementById("tipInfoBox"); }
  function boxOpen() { var b = box(); return !!b && !b.hidden && getComputedStyle(b).display !== "none"; }
  var css = document.createElement("style");
  css.textContent =
    ".jp{position:fixed;left:50%;bottom:16px;transform:translate(-50%,140%);width:min(420px,calc(100% - 24px));z-index:9999;" +
    "background:#fffaf0;border:1px solid #e6cf93;border-top:4px solid #c9962b;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.18);" +
    "padding:14px 16px 12px;font:inherit;color:#3d3420;transition:transform .45s ease;text-align:left}" +
    ".jp.on{transform:translate(-50%,0)}.jp h4{margin:0 26px 4px 0;font-size:16px;color:#5a4207}" +
    ".jp p{margin:0 0 10px;font-size:14px;line-height:1.4}.jp .jp-x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:20px;line-height:1;color:#8a7a55;cursor:pointer}" +
    ".jp .jp-row{display:flex;gap:8px;flex-wrap:wrap}.jp .jp-go{background:#2d6a4f;color:#fff;border:0;border-radius:999px;padding:9px 16px;font:inherit;font-weight:600;cursor:pointer}" +
    ".jp .jp-no{background:none;border:1px solid #d9c99c;color:#6b6250;border-radius:999px;padding:9px 14px;font:inherit;cursor:pointer}" +
    "@media print{.jp{display:none!important}}";
  document.head.appendChild(css);
  function socialLine() {
    var L = (window.JUICE_THANKS || []).filter(function (t) { return t && t.name; });
    if (!L.length) return "A juice is about KES 100. Buy as many as you like.";
    var names = L.slice(-2).reverse().map(function (t) { return String(t.name).replace(/[<>&"']/g, ""); });
    var more = L.length - names.length;
    return "Join " + names.join(names.length === 2 && !more ? " and " : ", ") + (more > 0 ? " and " + more + " other" + (more > 1 ? "s" : "") : "") +
      " who've bought the developer a juice. A juice is about KES 100.";
  }
  function close(card) { card.classList.remove("on"); setTimeout(function () { card.remove(); }, 500); document.removeEventListener("keydown", esc); }
  function esc(e) { if (e.key === "Escape") { var c = document.querySelector(".jp"); if (c) close(c); } }
  function show() {
    if (shown || boxOpen() || !opener()) return;
    if (document.visibilityState !== "visible") { document.addEventListener("visibilitychange", function v() { if (document.visibilityState === "visible") { document.removeEventListener("visibilitychange", v); setTimeout(show, 3000); } }); return; }
    shown = true;
    var card = document.createElement("div"); card.className = "jp"; card.setAttribute("role", "dialog"); card.setAttribute("aria-live", "polite"); card.setAttribute("aria-label", "Buy the developer a juice");
    card.innerHTML = '<button type="button" class="jp-x" aria-label="Close">×</button><h4>Found your figures useful? 🧃</h4><p></p>' +
      '<div class="jp-row"><button type="button" class="jp-go">Buy the developer a juice</button><button type="button" class="jp-no">Not now</button></div>';
    card.querySelector("p").textContent = socialLine();
    document.body.appendChild(card); requestAnimationFrame(function () { requestAnimationFrame(function () { card.classList.add("on"); }); });
    document.addEventListener("keydown", esc);
    count("juice-popup-shown", "Juice pop-up shown");
    card.querySelector(".jp-x").onclick = card.querySelector(".jp-no").onclick = function () { close(card); };
    card.querySelector(".jp-go").onclick = function () {
      count("juice-popup-click", "Juice pop-up: buy a juice"); close(card);
      if (!boxOpen()) opener().click();
      var b = box(); if (b) b.scrollIntoView({ behavior: "smooth", block: "center" });
    };
  }
  function arm(e) { if (armed || !e.isTrusted) return; armed = true; timer = setTimeout(show, DELAY); }
  document.addEventListener("input", arm, true); document.addEventListener("change", arm, true);
  window.addEventListener("pagehide", function () { clearTimeout(timer); var c = document.querySelector(".jp"); if (c) c.remove(); });
})();
