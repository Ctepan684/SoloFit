/* ==========================================================
   SoloFit · SUPPORT
   Вкладка «Поддержка»: частые вопросы и форма обращения.
   Поменяй SUPPORT_EMAIL на свою почту.
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit || !SoloFit.addTab) return;

  var SUPPORT_EMAIL = "support@example.com"; // ← поставь свою почту

  var FAQ = [
    ["Как добавить продукт?",
     "Нажми «+ Добавить» в нужном приёме пищи и найди продукт поиском. Если его нет, попробуй онлайн-базу под поиском или создай свой через «+ Свой»."],
    ["Как искать продукт?",
     "Онлайн-база ищет по фразе целиком, поэтому пиши название полностью или вместе с брендом. Например: «Простоквашино творог»."],
    ["Где хранятся мои данные?",
     "В твоём аккаунте в облаке. Дневник, вода, сон и профиль доступны с любого устройства после входа."],
    ["Как изменить цель или параметры?",
     "Вкладка «Профиль» → «Изменить параметры». Норма калорий пересчитается автоматически."],
    ["Зачем проверка «Я не робот»?",
     "Чтобы защитить приложение от ботов и массовых регистраций."],
    ["Откуда продукты из онлайн-базы?",
     "Из Open Food Facts, открытой базы по лицензии ODbL. Данные могут быть неполными или неточными, проверяй по упаковке."]
  ];

  var faqHtml = FAQ.map(function (item) {
    return '<details class="sp-item"><summary>' + item[0] + '</summary>' +
           '<p class="muted" style="margin:8px 0 0">' + item[1] + '</p></details>';
  }).join("");

  var style = document.createElement("style");
  style.textContent =
    ".sp-item{padding:12px 0;border-bottom:1px solid #E6E6E6}" +
    ".sp-item summary{cursor:pointer;font-weight:700;list-style:none}" +
    ".sp-item summary::-webkit-details-marker{display:none}";
  document.head.appendChild(style);

  var sec = SoloFit.addTab("support", "Поддержка",
    '<div class="glass card"><h2>Поддержка</h2>' +
    '<p class="muted">Ответы на частые вопросы и связь с нами.</p>' +
    '<div style="margin-top:8px">' + faqHtml + '</div>' +
    '<h2 style="margin-top:18px">Написать нам</h2>' +
    '<label class="fld" style="margin-top:8px">Опишите проблему или предложение' +
    '<textarea class="field" id="spText" rows="4" style="resize:vertical"></textarea></label>' +
    '<button class="btn" type="button" data-sp="send" style="margin-top:12px">Отправить</button>' +
    '</div>');

  sec.addEventListener("click", function (e) {
    if (!e.target.closest("[data-sp='send']")) return;
    var text = sec.querySelector("#spText").value.trim();
    if (!text) return;
    var user = SoloFit.getUser();
    var who = user && user.email ? "\n\nОт: " + user.email : "";
    var href = "mailto:" + SUPPORT_EMAIL +
      "?subject=" + encodeURIComponent("SoloFit: обращение") +
      "&body=" + encodeURIComponent(text + who);
    window.location.href = href;
  });
})();
