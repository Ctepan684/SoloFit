/* ==========================================================
   SoloFit · PROFILE
   Вкладка «Профиль»: аватар, имя, параметры, норма, выход.
   Имя и аватар хранятся в облаке: root.profile = { name, avatar }.
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit || !SoloFit.addTab) return;

  var GOALS = { weight_loss: "Похудение", fat_loss: "Сброс жира", muscle_gain: "Набор массы",
                strength: "Набор силовых", maintenance: "Поддержание веса" };
  var ACT = { sedentary: "Сидячий", light: "Умеренный", moderate: "Средний",
              active: "Активный", extreme: "Максимальный" };
  var EXP = { beginner: "Новичок", intermediate: "Средний", advanced: "Опытный" };

  var style = document.createElement("style");
  style.textContent =
    ".pf-head{display:flex;align-items:center;gap:16px}" +
    ".pf-avatar{width:84px;height:84px;flex:0 0 84px;border-radius:50%;overflow:hidden;display:grid;place-items:center;" +
    "background:#EFEFEF;color:#1C1C1C;font-weight:800;font-size:28px;border:1px solid #E6E6E6}" +
    ".pf-avatar img{width:100%;height:100%;object-fit:cover}" +
    ".pf-name{font-weight:800;font-size:18px}" +
    ".pf-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}" +
    ".pf-actions{display:grid;gap:8px;margin-top:14px}" +
    ".pf-actions .btn,.pf-actions label.btn{text-align:center;display:block;margin:0}";
  document.head.appendChild(style);

  var sec = SoloFit.addTab("profile", "Профиль", '<div class="glass card" id="pfCard"></div>');
  var card = sec.querySelector("#pfCard");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function meta() {
    var u = SoloFit.getUser();
    return (u && u.user_metadata) || {};
  }
  function stat(k, v) {
    return '<div class="stat-box"><div class="k">' + k + '</div><div class="v">' + esc(v) + '</div></div>';
  }

  function render() {
    var user = SoloFit.getUser();
    if (!user) return;
    var m = meta();
    var p = (SoloFit.getRoot().profile) || {};
    var name = p.name || m.name || (user.email || "").split("@")[0];
    var g = SoloFit.getGoal();
    var avatar = p.avatar
      ? '<img src="' + p.avatar + '" alt="">'
      : esc(name.charAt(0).toUpperCase());

    card.innerHTML =
      '<div class="pf-head"><div class="pf-avatar">' + avatar + '</div>' +
      '<div><div class="pf-name">' + esc(name) + '</div>' +
      '<div class="muted">' + esc(GOALS[m.goal] || "") + '</div></div></div>' +
      '<label class="fld" style="margin-top:16px">Имя' +
      '<input class="field" id="pfName" maxlength="40" value="' + esc(name) + '"></label>' +
      '<div class="pf-stats">' +
      stat("Норма", g.kcal + " ккал") +
      stat("Белок", g.p + " г") +
      stat("Вес / рост", (m.weight || "—") + " кг · " + (m.height || "—") + " см") +
      stat("Возраст", (m.age || "—") + " лет") +
      stat("Активность", ACT[m.activity] || "—") +
      stat("Опыт", EXP[m.experience] || "—") +
      '</div>' +
      '<div class="pf-actions">' +
      '<button class="btn" type="button" data-pf="save">Сохранить имя</button>' +
      '<label class="btn ghost" style="cursor:pointer">Сменить фото' +
      '<input type="file" accept="image/*" id="pfFile" style="display:none"></label>' +
      '<button class="btn ghost" type="button" data-pf="params">Изменить параметры</button>' +
      '<button class="btn danger" type="button" data-pf="logout">Выйти из аккаунта</button>' +
      '</div>';
  }

  // Сжимаем фото до 200×200, чтобы не раздувать облачную запись
  function compress(file, cb) {
    var reader = new FileReader();
    reader.onload = function () {
      var img = new Image();
      img.onload = function () {
        var size = 200, c = document.createElement("canvas");
        c.width = c.height = size;
        var side = Math.min(img.width, img.height);
        var sx = (img.width - side) / 2, sy = (img.height - side) / 2;
        c.getContext("2d").drawImage(img, sx, sy, side, side, 0, 0, size, size);
        cb(c.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  sec.addEventListener("click", function (e) {
    var b = e.target.closest("[data-pf]");
    if (!b) return;
    var act = b.getAttribute("data-pf");
    if (act === "save") {
      var val = sec.querySelector("#pfName").value.trim();
      if (!val) return;
      var root = SoloFit.getRoot();
      root.profile = Object.assign({}, root.profile || {}, { name: val });
      SoloFit.save();
      render();
    } else if (act === "params") {
      document.getElementById("editParamsBtn").click();
    } else if (act === "logout") {
      document.getElementById("logoutBtn").click();
    }
  });

  sec.addEventListener("change", function (e) {
    if (e.target.id !== "pfFile" || !e.target.files || !e.target.files[0]) return;
    compress(e.target.files[0], function (dataUrl) {
      var root = SoloFit.getRoot();
      root.profile = Object.assign({}, root.profile || {}, { avatar: dataUrl });
      SoloFit.save();
      render();
    });
  });

  SoloFit.onAppReady(render);
})();
