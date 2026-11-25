/* ==========================================================
   SoloFit · NAV (нижняя навигация)
   Порядок, подписи и видимость вкладок задаются ЗДЕСЬ.
   Вкладки создаются модулями через SoloFit.addTab(id, ...).
   Этот файл подключать последним.
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit) return;

  var CONFIG = [
    { id: "food",    label: "Питание" },
    { id: "train",   label: "Тренировка" },
    { id: "sleep",   label: "Сон" },
    { id: "profile", label: "Профиль" },
    { id: "support", label: "Поддержка" }
  ];

  var bar = document.getElementById("tabbar");
  if (!bar) return;

  var style = document.createElement("style");
  style.textContent = "#tabbar button{font-size:12px;padding:10px 4px;white-space:nowrap}";
  document.head.appendChild(style);

  function buttonsById() {
    var map = {};
    Array.prototype.forEach.call(bar.querySelectorAll("[data-tab]"), function (b) {
      map[b.getAttribute("data-tab")] = b;
    });
    return map;
  }

  function apply() {
    var map = buttonsById();
    var shown = 0;
    CONFIG.forEach(function (item) {
      var b = map[item.id];
      if (!b) return;
      b.textContent = item.label;
      bar.appendChild(b);                     // порядок вкладок
      b.style.display = item.hidden ? "none" : "";
      if (!item.hidden) shown++;
    });
    if (shown) bar.style.gridTemplateColumns = "repeat(" + shown + ", 1fr)";
  }

  // Управление из других модулей: SoloFit.nav.setVisible('support', false)
  SoloFit.nav = {
    config: CONFIG,
    apply: apply,
    setVisible: function (id, on) {
      CONFIG.forEach(function (item) { if (item.id === id) item.hidden = !on; });
      apply();
    }
  };

  apply();
  SoloFit.onAppReady(apply);
})();
