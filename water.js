/* ==========================================================
   SoloFit · BASE / WATER
   Трекер воды: стакан 250 мл, цель 30 мл на кг веса.
   Данные хранятся в дне пользователя (SoloFit.getDay().water).
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit) return;
  var host = document.getElementById("moduleFood");
  if (!host) return;

  var ML = 250;

  var style = document.createElement("style");
  style.textContent =
    ".water-row{display:flex;align-items:center;gap:10px;margin-top:12px}" +
    ".water-row .add-btn{width:auto;margin:0;padding:10px 14px;flex:0 0 auto}" +
    ".water-count{flex:1;text-align:center;color:var(--muted);font-size:13px}";
  document.head.appendChild(style);

  function target() {
    var u = SoloFit.getUser();
    var w = parseFloat(u && u.user_metadata && u.user_metadata.weight) || 70;
    return Math.max(4, Math.ceil((w * 30) / ML));
  }

  function render() {
    if (!SoloFit.getUser()) { host.innerHTML = ""; return; }
    var n = SoloFit.getDay().water || 0;
    var t = target();
    var pct = Math.min(100, (n / t) * 100);
    host.innerHTML =
      '<article class="glass card" style="margin-top:14px">' +
      '<div class="meal-head"><h2>Вода</h2><span class="sum">' + (n * ML) + ' / ' + (t * ML) + ' мл</span></div>' +
      '<div class="bar-track" style="margin-top:12px"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="water-row">' +
      '<button class="icon-btn" type="button" data-w="-1" aria-label="Убрать стакан">−</button>' +
      '<span class="water-count">' + n + ' из ' + t + ' стаканов</span>' +
      '<button class="add-btn" type="button" data-w="1">+ 250 мл</button>' +
      '</div></article>';
  }

  host.addEventListener("click", function (e) {
    var b = e.target.closest("[data-w]");
    if (!b) return;
    var d = SoloFit.getDay();
    d.water = Math.max(0, (d.water || 0) + parseInt(b.getAttribute("data-w"), 10));
    SoloFit.save();
    render();
  });

  SoloFit.onRender(render);
})();
