/* ==========================================================
   SoloFit · BASE / SLEEP
   Трекер сна: отдельная вкладка «Сон». Хранится в данных пользователя (облако).
   Ключ записи — дата пробуждения (YYYY-MM-DD).
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit || !SoloFit.addTab) return;

  var QUALITY = ["", "Плохо", "Так себе", "Нормально", "Хорошо", "Отлично"];
  var draftQ = 3;

  var sec = SoloFit.addTab("sleep", "Сон",
    '<div class="glass card"><h2>Сон</h2><p class="muted" id="sleepRec"></p>' +
    '<div id="sleepBody"></div></div>');

  function uid() { var u = SoloFit.getUser(); return u && u.id ? u.id : "guest"; }
  function key() { return "solofit-sleep-" + uid(); }
  function load() {
    return SoloFit.getRoot().sleep || {};
  }
  function store(data) {
    SoloFit.getRoot().sleep = data;
    SoloFit.save();
  }
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function todayStr() {
    var d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function toMin(t) { var p = (t || "0:0").split(":"); return (+p[0]) * 60 + (+p[1]); }
  function hours(from, to) {
    if (!from || !to) return 0;
    return ((toMin(to) - toMin(from) + 1440) % 1440) / 60;
  }
  function recommendation() {
    var u = SoloFit.getUser();
    var age = parseInt(u && u.user_metadata && u.user_metadata.age, 10) || 20;
    return age < 18 ? "Для твоего возраста норма сна 8–10 часов." : "Норма сна для взрослых 7–9 часов.";
  }

  function render() {
    if (!SoloFit.getUser()) return;
    sec.querySelector("#sleepRec").textContent = recommendation();

    var data = load();
    var dates = Object.keys(data).sort().reverse().slice(0, 7);
    var sum = 0;
    dates.forEach(function (d) { sum += hours(data[d].from, data[d].to); });
    var avg = dates.length ? (sum / dates.length).toFixed(1) + " ч" : "—";

    var qBtns = "";
    for (var q = 1; q <= 5; q++) {
      qBtns += '<button type="button" data-q="' + q + '" aria-selected="' + (q === draftQ) + '">' + q + '</button>';
    }

    var list = dates.map(function (d) {
      var r = data[d];
      return '<li><div>' + d + '</div><span class="kc">' + hours(r.from, r.to).toFixed(1) + ' ч</span>' +
             '<span class="meta">' + QUALITY[r.q] + '</span></li>';
    }).join("");

    sec.querySelector("#sleepBody").innerHTML =
      '<div class="metrics-grid" style="margin-top:12px">' +
      '<label class="fld">Лёг спать<input class="field" type="time" id="sleepFrom" value="23:30"></label>' +
      '<label class="fld">Проснулся<input class="field" type="time" id="sleepTo" value="07:00"></label>' +
      '</div>' +
      '<div class="muted" style="margin-top:14px">Качество сна</div>' +
      '<div class="seg" style="margin-top:6px">' + qBtns + '</div>' +
      '<button class="btn" type="button" data-save="1" style="margin-top:14px">Сохранить ночь</button>' +
      '<div class="stat-box" style="margin-top:14px"><div class="k">Среднее за последние ночи</div><div class="v">' + avg + '</div></div>' +
      (list ? '<ul class="items">' + list + '</ul>' : '<p class="empty">Записей пока нет</p>');
  }

  sec.addEventListener("click", function (e) {
    var qb = e.target.closest("[data-q]");
    if (qb) {
      draftQ = parseInt(qb.getAttribute("data-q"), 10);
      sec.querySelectorAll("[data-q]").forEach(function (b) {
        b.setAttribute("aria-selected", String(b === qb));
      });
      return;
    }
    if (e.target.closest("[data-save]")) {
      var from = sec.querySelector("#sleepFrom").value;
      var to = sec.querySelector("#sleepTo").value;
      if (!from || !to) return;
      var data = load();
      data[todayStr()] = { from: from, to: to, q: draftQ };
      store(data);
      render();
    }
  });

  SoloFit.onAppReady(render);
})();
