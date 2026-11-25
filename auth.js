/* ==========================================================
   SoloFit · AUTH (регистрация, вход, анкета)
   Экраны: вход/регистрация → цель → параметры → активность.
   Вся разметка и логика экранов здесь. Менять этот файл, а не index.html.
   Ключ капчи Turnstile: вставь свой Site key в константу ниже.
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit) return;

  var TURNSTILE_SITE_KEY = "ВСТАВЬ_TURNSTILE_SITE_KEY";

  var host = document.getElementById("onboardingWrap");
  if (!host) return;
  host.innerHTML = "\n  <div>\n    <div class=\"auth-brand\">SoloFit</div>\n    <p class=\"sub\">Питание и тренировки под вашу цель</p>\n  </div>\n\n  <!-- 1. Вход и регистрация -->\n  <section id=\"authView\" class=\"glass auth-card\" aria-live=\"polite\">\n    <div class=\"seg\" role=\"tablist\" aria-label=\"Выбор действия\">\n      <button type=\"button\" role=\"tab\" id=\"tabLogin\" aria-selected=\"true\" aria-controls=\"formLogin\">Вход</button>\n      <button type=\"button\" role=\"tab\" id=\"tabSignup\" aria-selected=\"false\" aria-controls=\"formSignup\">Регистрация</button>\n    </div>\n\n    <div class=\"cf-turnstile\" data-sitekey=\"ВСТАВЬ_TURNSTILE_SITE_KEY\" data-theme=\"light\" style=\"display:flex;justify-content:center\"></div>\n    <form id=\"formLogin\" novalidate>\n      <label class=\"fld\">Email\n        <input class=\"field\" id=\"loginEmail\" type=\"email\" autocomplete=\"email\" required>\n      </label>\n      <label class=\"fld\">Пароль\n        <input class=\"field\" id=\"loginPassword\" type=\"password\" autocomplete=\"current-password\" required>\n      </label>\n      <div class=\"msg\" id=\"loginMsg\" role=\"alert\"></div>\n      <button class=\"btn\" id=\"loginBtn\" type=\"submit\">Войти</button>\n    </form>\n\n    <form id=\"formSignup\" class=\"hidden\" novalidate>\n      <label class=\"fld\">Имя\n        <input class=\"field\" id=\"signupName\" type=\"text\" autocomplete=\"given-name\" maxlength=\"40\" required>\n      </label>\n      <label class=\"fld\">Email\n        <input class=\"field\" id=\"signupEmail\" type=\"email\" autocomplete=\"email\" required>\n      </label>\n      <label class=\"fld\">Пароль (минимум 6 символов)\n        <input class=\"field\" id=\"signupPassword\" type=\"password\" autocomplete=\"new-password\" minlength=\"6\" required>\n      </label>\n      <div class=\"msg\" id=\"signupMsg\" role=\"alert\"></div>\n      <button class=\"btn\" id=\"signupBtn\" type=\"submit\">Создать аккаунт</button>\n    </form>\n  </section>\n\n  <!-- 2. Шаг 1/3: Выбор цели -->\n  <section id=\"goalView\" class=\"glass auth-card hidden\" aria-live=\"polite\">\n    <div class=\"step-bar\">\n      <span class=\"step-dot active\"></span>\n      <span class=\"step-dot\"></span>\n      <span class=\"step-dot\"></span>\n    </div>\n    <div class=\"step-caption\">Шаг 1 из 3</div>\n    <div class=\"hello\">Какая у вас цель?</div>\n    <p class=\"sub\" style=\"margin:0\">От неё будут зависеть калории и тренировки. Цель можно поменять позже.</p>\n    <div class=\"row\">\n      <button class=\"choice-btn goal-opt\" type=\"button\" data-goal=\"weight_loss\">\n        <span class=\"choice-title\">Похудение</span>\n        <span class=\"choice-desc\">Плавное снижение веса за счёт дефицита калорий</span>\n      </button>\n      <button class=\"choice-btn goal-opt\" type=\"button\" data-goal=\"fat_loss\">\n        <span class=\"choice-title\">Сброс жира</span>\n        <span class=\"choice-desc\">Сушка с сохранением мышц и повышенным белком</span>\n      </button>\n      <button class=\"choice-btn goal-opt\" type=\"button\" data-goal=\"muscle_gain\">\n        <span class=\"choice-title\">Набор мышечной массы</span>\n        <span class=\"choice-desc\">Умеренный профицит для роста мышц</span>\n      </button>\n      <button class=\"choice-btn goal-opt\" type=\"button\" data-goal=\"maintenance\">\n        <span class=\"choice-title\">Поддержание веса</span>\n        <span class=\"choice-desc\">Держим текущий вес и стабильную форму</span>\n      </button>\n      <button class=\"choice-btn goal-opt\" type=\"button\" data-goal=\"strength\">\n        <span class=\"choice-title\">Набор силовых</span>\n        <span class=\"choice-desc\">Энергия и восстановление под тяжёлые тренировки</span>\n      </button>\n    </div>\n    <div class=\"msg\" id=\"goalMsg\" role=\"alert\"></div>\n  </section>\n\n  <!-- 3. Шаг 2/3: Рост, вес, возраст и пол -->\n  <section id=\"metricsView\" class=\"glass auth-card hidden\" aria-live=\"polite\">\n    <div class=\"step-bar\">\n      <span class=\"step-dot done\"></span>\n      <span class=\"step-dot active\"></span>\n      <span class=\"step-dot\"></span>\n    </div>\n    <div class=\"step-caption\">Шаг 2 из 3</div>\n    <div class=\"hello\">Ваши параметры</div>\n    <p class=\"sub\" style=\"margin:0\">Нужны для точного расчёта калорий и БЖУ по формуле Миффлина–Сан Жеора.</p>\n    <form id=\"formMetrics\" novalidate>\n      <div class=\"seg\" role=\"tablist\" aria-label=\"Пол\">\n        <button type=\"button\" role=\"tab\" id=\"sexM\" aria-selected=\"true\">Мужской</button>\n        <button type=\"button\" role=\"tab\" id=\"sexF\" aria-selected=\"false\">Женский</button>\n      </div>\n      <div class=\"muted\" style=\"font-size:13px;font-weight:600\">Опыт в тренировках</div>\n      <div class=\"seg\" id=\"expSeg\" role=\"tablist\" aria-label=\"Опыт в тренировках\" style=\"grid-template-columns:1fr 1fr 1fr\">\n        <button type=\"button\" role=\"tab\" data-exp=\"beginner\" aria-selected=\"false\">Новичок</button>\n        <button type=\"button\" role=\"tab\" data-exp=\"intermediate\" aria-selected=\"false\">Средний</button>\n        <button type=\"button\" role=\"tab\" data-exp=\"advanced\" aria-selected=\"false\">Опытный</button>\n      </div>\n      <div class=\"metrics-grid\">\n        <label class=\"fld\">Рост (см)\n          <input class=\"field\" id=\"inputHeight\" type=\"number\" inputmode=\"numeric\" min=\"100\" max=\"250\" placeholder=\"175\" required>\n        </label>\n        <label class=\"fld\">Вес (кг)\n          <input class=\"field\" id=\"inputWeight\" type=\"number\" inputmode=\"decimal\" step=\"0.1\" min=\"30\" max=\"250\" placeholder=\"70\" required>\n        </label>\n      </div>\n      <label class=\"fld\">Возраст (лет)\n        <input class=\"field\" id=\"inputAge\" type=\"number\" inputmode=\"numeric\" min=\"10\" max=\"100\" placeholder=\"17\" required>\n      </label>\n\n      <div id=\"ageWarnBox\" class=\"warn-box hidden\">\n        <div id=\"warnStep1\">\n          <div class=\"warn-title\">Рекомендация по здоровью</div>\n          <p id=\"warnBmiText\" class=\"warn-text\"></p>\n          <div class=\"row\">\n            <button class=\"btn\" id=\"warnSwitchBtn\" type=\"button\">Перейти на «Сброс жира»</button>\n            <button class=\"btn ghost\" id=\"warnDeclineBtn\" type=\"button\">Нет, оставить «Похудение»</button>\n          </div>\n        </div>\n        <div id=\"warnStep2\" class=\"hidden\">\n          <div class=\"warn-title\">Внимание: риск для гормонов</div>\n          <p class=\"warn-text\">Жёсткий дефицит калорий до 18 лет при нормальном или низком весе может нарушить выработку гормонов, замедлить рост и восстановление. Всё равно продолжить?</p>\n          <div class=\"row\">\n            <button class=\"btn\" id=\"warnSwitchBtn2\" type=\"button\">Выбрать «Сброс жира»</button>\n            <button class=\"btn danger\" id=\"warnContinueRiskBtn\" type=\"button\">Продолжить на свой риск</button>\n          </div>\n        </div>\n      </div>\n\n      <div class=\"msg\" id=\"metricsMsg\" role=\"alert\"></div>\n      <div class=\"btn-row\">\n        <button class=\"btn ghost\" id=\"metricsBack\" type=\"button\">Назад</button>\n        <button class=\"btn\" id=\"metricsNext\" type=\"submit\">Далее</button>\n      </div>\n    </form>\n  </section>\n\n  <!-- 4. Шаг 3/3: Ежедневная активность -->\n  <section id=\"activityView\" class=\"glass auth-card hidden\" aria-live=\"polite\">\n    <div class=\"step-bar\">\n      <span class=\"step-dot done\"></span>\n      <span class=\"step-dot done\"></span>\n      <span class=\"step-dot active\"></span>\n    </div>\n    <div class=\"step-caption\">Шаг 3 из 3</div>\n    <div class=\"hello\">Ежедневная активность</div>\n    <p class=\"sub\" style=\"margin:0\">Выберите уровень, который ближе всего к вашему обычному дню.</p>\n\n    <div class=\"row\" id=\"activityList\">\n      <button class=\"choice-btn act-opt\" type=\"button\" data-activity=\"sedentary\">\n        <div class=\"choice-top\">\n          <span class=\"choice-title\">1. Сидячий</span>\n          <span class=\"choice-badge\">до 3 тыс. шагов</span>\n        </div>\n        <span class=\"choice-desc\">Почти весь день за столом, компом или дома, без тренировок и лишней ходьбы</span>\n      </button>\n\n      <button class=\"choice-btn act-opt\" type=\"button\" data-activity=\"light\">\n        <div class=\"choice-top\">\n          <span class=\"choice-title\">2. Умеренный</span>\n          <span class=\"choice-badge\">3–5 тыс. шагов</span>\n        </div>\n        <span class=\"choice-desc\">Около 3–5 тысяч шагов в день, спокойная работа/учёба или редкие прогулки</span>\n      </button>\n\n      <button class=\"choice-btn act-opt\" type=\"button\" data-activity=\"moderate\">\n        <div class=\"choice-top\">\n          <span class=\"choice-title\">3. Средний</span>\n          <span class=\"choice-badge\">6–8 тыс. шагов</span>\n        </div>\n        <span class=\"choice-desc\">Учёба или работа + обычные заботы по дому и регулярные перемещения пешком</span>\n      </button>\n\n      <button class=\"choice-btn act-opt\" type=\"button\" data-activity=\"active\">\n        <div class=\"choice-top\">\n          <span class=\"choice-title\">4. Активный</span>\n          <span class=\"choice-badge\">Рутина + зал</span>\n        </div>\n        <span class=\"choice-desc\">Учёба/работа + домашняя рутина + стабильные тренировки в зале</span>\n      </button>\n\n      <button class=\"choice-btn act-opt\" type=\"button\" data-activity=\"extreme\">\n        <div class=\"choice-top\">\n          <span class=\"choice-title\">5. Максимальный</span>\n          <span class=\"choice-badge\">Хардкор</span>\n        </div>\n        <span class=\"choice-desc\">Тяжёлая физическая работа, где весь день в движении + тренировки в зале</span>\n      </button>\n    </div>\n\n    <div class=\"msg\" id=\"activityMsg\" role=\"alert\"></div>\n    <div class=\"btn-row\">\n      <button class=\"btn ghost\" id=\"activityBack\" type=\"button\">Назад</button>\n      <button class=\"btn\" id=\"activitySave\" type=\"button\">Запустить SoloFit</button>\n    </div>\n  </section>\n\n<!-- Окно после подтверждения почты -->\n<div class=\"glass sheet\" id=\"confirmSheet\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"confirmTitle\" hidden>\n  <div class=\"hello\" id=\"confirmTitle\" style=\"text-align:left\">Аккаунт зарегистрирован</div>\n  <p class=\"sub\" style=\"margin:0 0 4px;text-align:left\">Почта подтверждена. Теперь войдите в SoloFit.</p>\n  <button class=\"btn\" id=\"confirmLoginBtn\" type=\"button\">Войти</button>\n</div>\n\n".replace("ВСТАВЬ_TURNSTILE_SITE_KEY", TURNSTILE_SITE_KEY);

  var sb = SoloFit.sb;
  var $ = function (id) { return document.getElementById(id); };

  var GOAL_LABELS = {
    weight_loss: "Похудение",
    fat_loss: "Сброс жира",
    muscle_gain: "Набор массы",
    strength: "Набор силовых",
    maintenance: "Поддержание веса"
  };
  var ACTIVITY_KEYS = { sedentary: 1, light: 1, moderate: 1, active: 1, extreme: 1 };

  var draft = { goal: "", height: "", weight: "", age: "", sex: "m", activity: "", experience: "" };
  var confirmFlow = !!SoloFit.isConfirm;   // пришли по ссылке из письма
  var loadedId = null;                     // id пользователя, чьи данные уже открыты
  var captchaTries = 0;
  var captchaReady = false;

  // ---------- helpers ----------
  function setMsg(id, text, kind) {
    var el = $(id);
    if (!el) return;
    el.textContent = text;
    el.className = "msg show " + kind;
  }
  function clearMsg(id) {
    var el = $(id);
    if (!el) return;
    el.textContent = "";
    el.className = "msg";
  }
  function setBusy(btnId, busy, idleText) {
    var b = $(btnId);
    b.disabled = busy;
    b.textContent = busy ? "Подождите..." : idleText;
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
  function calcBMI(heightCm, weightKg) {
    var h = parseFloat(heightCm) / 100;
    var w = parseFloat(weightKg);
    if (!h || !w) return 0;
    return Math.round((w / (h * h)) * 10) / 10;
  }
  function humanError(err) {
    var m = ((err && err.message) || "").toLowerCase();
    if (m.indexOf("invalid login") !== -1) return "Неверная почта или пароль.";
    if (m.indexOf("email not confirmed") !== -1) return "Подтвердите почту: мы отправили письмо со ссылкой.";
    if (m.indexOf("already registered") !== -1 || m.indexOf("already been registered") !== -1) return "Этот email уже зарегистрирован. Попробуйте войти.";
    if (m.indexOf("password") !== -1 && m.indexOf("6") !== -1) return "Пароль должен быть не короче 6 символов.";
    if (m.indexOf("rate limit") !== -1 || m.indexOf("too many") !== -1) return "Слишком много попыток. Подождите немного.";
    if (m.indexOf("captcha") !== -1) return "Проверка «Я не робот» не пройдена. Обновите страницу и попробуйте снова.";
    if (m.indexOf("network") !== -1 || m.indexOf("failed to fetch") !== -1) return "Нет связи с сервером. Проверьте интернет.";
    return "Что-то пошло не так. Попробуйте ещё раз.";
  }

  // ---------- капча Turnstile ----------
  // Виджет вставлен через innerHTML, поэтому рендерим его сами, когда загрузится скрипт
  function renderCaptcha() {
    if (captchaReady || !window.turnstile) return;
    var box = host.querySelector(".cf-turnstile");
    if (!box) return;
    try {
      turnstile.render(box, { sitekey: TURNSTILE_SITE_KEY, theme: "light" });
      captchaReady = true;
    } catch (e) { console.warn("captcha:", e); }
  }
  function getCaptcha() {
    try { return window.turnstile ? turnstile.getResponse() : ""; } catch (e) { return ""; }
  }
  function resetCaptcha() {
    try { if (window.turnstile) turnstile.reset(); } catch (e) {}
  }
  renderCaptcha();
  var captchaTimer = setInterval(function () {
    renderCaptcha();
    captchaTries++;
    if (captchaReady || captchaTries > 40) clearInterval(captchaTimer);
  }, 300);

  // ---------- экраны ----------
  function hideAgeWarn() {
    $("ageWarnBox").classList.add("hidden");
    $("warnStep1").classList.remove("hidden");
    $("warnStep2").classList.add("hidden");
  }
  function showScreen(viewId) {
    $("appWrap").classList.add("hidden");
    $("tabbar").classList.add("hidden");
    host.classList.remove("hidden");
    ["authView", "goalView", "metricsView", "activityView"].forEach(function (id) {
      $(id).classList.toggle("hidden", id !== viewId);
    });
    hideAgeWarn();
    window.scrollTo({ top: 0 });
  }
  function selectTab(which) {
    var login = which === "login";
    $("tabLogin").setAttribute("aria-selected", String(login));
    $("tabSignup").setAttribute("aria-selected", String(!login));
    $("formLogin").classList.toggle("hidden", !login);
    $("formSignup").classList.toggle("hidden", login);
    clearMsg("loginMsg");
    clearMsg("signupMsg");
  }
  function syncUI() {
    document.querySelectorAll(".goal-opt").forEach(function (b) {
      b.classList.toggle("selected", b.getAttribute("data-goal") === draft.goal);
    });
    $("inputHeight").value = draft.height || "";
    $("inputWeight").value = draft.weight || "";
    $("inputAge").value = draft.age || "";
    var isF = draft.sex === "f";
    $("sexM").setAttribute("aria-selected", String(!isF));
    $("sexF").setAttribute("aria-selected", String(isF));
    document.querySelectorAll(".act-opt").forEach(function (b) {
      b.classList.toggle("selected", b.getAttribute("data-activity") === draft.activity);
    });
    document.querySelectorAll("#expSeg [data-exp]").forEach(function (b) {
      b.setAttribute("aria-selected", String(b.getAttribute("data-exp") === draft.experience));
    });
  }

  // Решает, какой экран показать после входа/выхода
  async function route(user) {
    if (!user) {
      loadedId = null;
      selectTab("login");
      return showScreen("authView");
    }
    if (confirmFlow && sb) {
      await sb.auth.signOut();
      confirmFlow = false;
      showScreen("authView");
      $("confirmSheet").hidden = false;
      return;
    }
    if (user.id === loadedId) return;

    var meta = user.user_metadata || {};
    draft = {
      goal: meta.goal || "",
      height: meta.height || "",
      weight: meta.weight || "",
      age: meta.age || "",
      sex: meta.sex || "m",
      activity: meta.activity || "",
      experience: meta.experience || ""
    };
    syncUI();
    if (!draft.goal || !GOAL_LABELS[draft.goal]) return showScreen("goalView");
    if (!draft.height || !draft.weight || !draft.age || !draft.experience) return showScreen("metricsView");
    if (!draft.activity || !ACTIVITY_KEYS[draft.activity]) return showScreen("activityView");
    loadedId = user.id;
    await SoloFit.showApp(user);
  }

  // ---------- вход и регистрация ----------
  $("tabLogin").addEventListener("click", function () { selectTab("login"); });
  $("tabSignup").addEventListener("click", function () { selectTab("signup"); });

  $("formLogin").addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMsg("loginMsg");
    if (!sb) return setMsg("loginMsg", "Библиотека Supabase не загрузилась. Проверьте интернет.", "err");
    var email = $("loginEmail").value.trim();
    var password = $("loginPassword").value;
    if (!validEmail(email)) return setMsg("loginMsg", "Введите корректный email.", "err");
    if (!password) return setMsg("loginMsg", "Введите пароль.", "err");
    var captcha = getCaptcha();
    if (!captcha) return setMsg("loginMsg", "Подтвердите, что вы не робот.", "err");

    setBusy("loginBtn", true, "Войти");
    var res = await sb.auth.signInWithPassword({ email: email, password: password, options: { captchaToken: captcha } });
    resetCaptcha();
    setBusy("loginBtn", false, "Войти");
    if (res.error) return setMsg("loginMsg", humanError(res.error), "err");
    await route(res.data.user);
  });

  $("formSignup").addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMsg("signupMsg");
    if (!sb) return setMsg("signupMsg", "Библиотека Supabase не загрузилась. Проверьте интернет.", "err");
    var name = $("signupName").value.trim();
    var email = $("signupEmail").value.trim();
    var password = $("signupPassword").value;
    if (!name) return setMsg("signupMsg", "Введите имя.", "err");
    if (!validEmail(email)) return setMsg("signupMsg", "Введите корректный email.", "err");
    if (password.length < 6) return setMsg("signupMsg", "Пароль должен быть не короче 6 символов.", "err");
    var captcha = getCaptcha();
    if (!captcha) return setMsg("signupMsg", "Подтвердите, что вы не робот.", "err");

    setBusy("signupBtn", true, "Создать аккаунт");
    var res = await sb.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { name: name },
        captchaToken: captcha,
        emailRedirectTo: window.location.origin + window.location.pathname
      }
    });
    resetCaptcha();
    setBusy("signupBtn", false, "Создать аккаунт");
    if (res.error) return setMsg("signupMsg", humanError(res.error), "err");
    if (res.data.session) return await route(res.data.user);
    setMsg("signupMsg", "Аккаунт создан. Подтвердите почту " + email + " и войдите.", "ok");
    $("formSignup").reset();
  });

  $("confirmLoginBtn").addEventListener("click", function () {
    $("confirmSheet").hidden = true;
    selectTab("login");
  });

  // ---------- анкета: цель → параметры → активность ----------
  $("sexM").addEventListener("click", function () { draft.sex = "m"; syncUI(); });
  $("sexF").addEventListener("click", function () { draft.sex = "f"; syncUI(); });

  document.querySelectorAll("#expSeg [data-exp]").forEach(function (b) {
    b.addEventListener("click", function () {
      draft.experience = b.getAttribute("data-exp");
      syncUI();
    });
  });

  document.querySelectorAll(".goal-opt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      draft.goal = btn.getAttribute("data-goal");
      syncUI();
      showScreen("metricsView");
      setTimeout(function () { $("inputHeight").focus(); }, 60);
    });
  });

  $("metricsBack").addEventListener("click", function () { showScreen("goalView"); });

  $("formMetrics").addEventListener("submit", function (e) {
    e.preventDefault();
    clearMsg("metricsMsg");
    var h = parseFloat($("inputHeight").value);
    var w = parseFloat($("inputWeight").value);
    var age = parseInt($("inputAge").value, 10);

    if (!h || h < 100 || h > 250) return setMsg("metricsMsg", "Введите рост от 100 до 250 см.", "err");
    if (!w || w < 30 || w > 250) return setMsg("metricsMsg", "Введите вес от 30 до 250 кг.", "err");
    if (!age || age < 10 || age > 100) return setMsg("metricsMsg", "Введите возраст от 10 до 100 лет.", "err");
    if (!draft.experience) return setMsg("metricsMsg", "Выберите опыт в тренировках.", "err");

    draft.height = Math.round(h);
    draft.weight = Math.round(w * 10) / 10;
    draft.age = age;

    var bmi = calcBMI(draft.height, draft.weight);
    if (age < 18 && draft.goal === "weight_loss" && bmi < 25) {
      var status = bmi < 18.5 ? "ниже нормы" : "в норме";
      $("warnBmiText").textContent =
        "Тебе " + age + " лет, а твой ИМТ — " + bmi + " (" + status + "). В этом возрасте лучше не уходить в жёсткое похудение. Предлагаем выбрать «Сброс жира» — более мягкий дефицит с акцентом на белок и сохранение мышц.";
      $("ageWarnBox").classList.remove("hidden");
      $("warnStep1").classList.remove("hidden");
      $("warnStep2").classList.add("hidden");
      return;
    }
    syncUI();
    showScreen("activityView");
  });

  function switchToFatLoss() {
    draft.goal = "fat_loss";
    hideAgeWarn();
    syncUI();
    showScreen("activityView");
  }
  $("warnSwitchBtn").addEventListener("click", switchToFatLoss);
  $("warnSwitchBtn2").addEventListener("click", switchToFatLoss);
  $("warnDeclineBtn").addEventListener("click", function () {
    $("warnStep1").classList.add("hidden");
    $("warnStep2").classList.remove("hidden");
  });
  $("warnContinueRiskBtn").addEventListener("click", function () {
    hideAgeWarn();
    syncUI();
    showScreen("activityView");
  });

  document.querySelectorAll(".act-opt").forEach(function (btn) {
    btn.addEventListener("click", function () {
      clearMsg("activityMsg");
      draft.activity = btn.getAttribute("data-activity");
      syncUI();
    });
  });

  $("activityBack").addEventListener("click", function () { showScreen("metricsView"); });

  $("activitySave").addEventListener("click", async function () {
    clearMsg("activityMsg");
    if (!draft.activity || !ACTIVITY_KEYS[draft.activity]) {
      return setMsg("activityMsg", "Выберите один из 5 уровней активности.", "err");
    }
    setBusy("activitySave", true, "Запустить SoloFit");
    var res = await sb.auth.updateUser({ data: draft });
    setBusy("activitySave", false, "Запустить SoloFit");
    if (res.error) return setMsg("activityMsg", "Ошибка сохранения: " + res.error.message, "err");
    loadedId = res.data.user.id;
    await SoloFit.showApp(res.data.user);
  });

  // ---------- публичный API ----------
  SoloFit.auth = {
    edit: function () { syncUI(); showScreen("goalView"); },   // «Изменить параметры» из профиля
    route: route
  };
  SoloFit.onAuth(route);

  if (!sb) setMsg("loginMsg", "Библиотека Supabase не загрузилась. Проверьте интернет.", "err");
})();
