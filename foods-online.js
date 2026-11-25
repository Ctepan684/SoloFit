/* ==========================================================
   SoloFit · BASE / FOODS ONLINE
   Поиск продуктов в Open Food Facts: бренд, название, КБЖУ на 100 г.
   Результаты показываются под локальным списком.
   Нажатие открывает то же окно с выбором граммов.
   Источник данных: Open Food Facts (ODbL), указан в окне поиска.
   ========================================================== */
(function () {
  "use strict";
  if (!window.SoloFit || !SoloFit.selectFood) return;
  var input = document.getElementById("search");
  var local = document.getElementById("foodList");
  if (!input || !local) return;

  var box = document.createElement("div");
  box.id = "onlineFoods";
  box.style.cssText = "display:flex;flex-direction:column;gap:6px;max-height:40vh;overflow-y:auto;padding-right:2px";
  local.insertAdjacentElement("afterend", box);

  var cache = {}, timer = null, reqId = 0, results = [];

  function r1(x) { return Math.round((+x || 0) * 10) / 10; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function toFood(p) {
    var n = p.nutriments || {};
    var k = n["energy-kcal_100g"];
    if (k == null && n.energy_100g != null) k = n.energy_100g / 4.184;
    var name = (p.product_name_ru || p.product_name || "").trim();
    if (!name || !k) return null;
    return {
      n: name.slice(0, 80),
      b: (p.brands || "").split(",")[0].trim(),
      k: Math.round(k),
      p: r1(n.proteins_100g),
      f: r1(n.fat_100g),
      c: r1(n.carbohydrates_100g)
    };
  }

  function search(q) {
    var url = "https://world.openfoodfacts.org/cgi/search.pl?action=process&json=1&search_simple=1" +
      "&page_size=25&fields=code,product_name,product_name_ru,brands,nutriments&search_terms=" +
      encodeURIComponent(q);
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) { return (j.products || []).map(toFood).filter(Boolean); });
  }

  function draw(state) {
    var html = "";
    if (state === "loading") html = '<p class="empty">Ищем в Open Food Facts…</p>';
    else if (state === "error") html = '<p class="empty">Не удалось загрузить онлайн-базу. Попробуйте позже.</p>';
    else if (state === "empty") html = '<p class="empty">В онлайн-базе ничего не найдено</p>';
    else if (state === "results") {
      html = '<p class="empty">Онлайн-база</p>' + results.map(function (f, i) {
        return '<button class="food-btn" type="button" data-off="' + i + '">' +
          '<span>' + esc(f.b ? f.b + " " + f.n : f.n) + '</span>' +
          '<span class="meta">' + f.k + ' ккал · Б' + f.p + '</span></button>';
      }).join("") + '<p class="empty">Данные: Open Food Facts (ODbL)</p>';
    }
    box.innerHTML = html;
  }

  function run() {
    var q = input.value.trim();
    if (q.length < 3) { results = []; draw("none"); return; }
    if (cache[q]) {
      results = cache[q];
      draw(results.length ? "results" : "empty");
      return;
    }
    var id = ++reqId;
    draw("loading");
    search(q).then(function (list) {
      if (id !== reqId) return;
      cache[q] = list;
      results = list;
      draw(list.length ? "results" : "empty");
    }).catch(function () {
      if (id === reqId) draw("error");
    });
  }

  input.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(run, 700);
  });

  // Сброс при открытии окна «Добавить»
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest("[data-add]")) {
      box.innerHTML = "";
      results = [];
    }
  });

  box.addEventListener("click", function (e) {
    var b = e.target.closest("[data-off]");
    if (!b) return;
    SoloFit.selectFood(results[+b.getAttribute("data-off")]);
  });
})();
