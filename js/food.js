import { FOODS, MEALS, RING_LEN } from "./data.js";
import { $, state, day, saveDb, round1, esc, closeAllSheets } from "./state.js";

let currentMeal = null;

function totals() {
  const t = { kcal: 0, p: 0, f: 0, c: 0 };
  MEALS.forEach((m) => {
    day().meals[m.id].forEach((it) => {
      t.kcal += it.kcal; t.p += it.p; t.f += it.f; t.c += it.c;
    });
  });
  return t;
}

function setMacro(letter, value, goal) {
  $("bar" + letter).style.width = Math.min(100, (value / goal) * 100) + "%";
  $("val" + letter).textContent = `${round1(value)} / ${goal} г`;
}

export function renderFood() {
  const t = totals();
  const left = state.goal.kcal - Math.round(t.kcal);
  $("kcalLeft").textContent = Math.abs(left);
  $("kcalLabel").textContent = left >= 0 ? "осталось ккал" : "ккал сверх нормы";

  const ratio = Math.min(1, t.kcal / state.goal.kcal);
  $("ring").style.strokeDashoffset = RING_LEN * (1 - ratio);

  setMacro("P", t.p, state.goal.p);
  setMacro("F", t.f, state.goal.f);
  setMacro("C", t.c, state.goal.c);

  let html = "";
  MEALS.forEach((m) => {
    const items = day().meals[m.id];
    const sum = items.reduce((s, it) => s + it.kcal, 0);
    html += `<article class="glass card" style="margin-top:14px">`;
    html += `<div class="meal-head"><h2>${m.name}</h2><span class="sum">${Math.round(sum)} ккал</span></div>`;
    if (items.length) {
      html += `<ul class="items">`;
      items.forEach((it, i) => {
        html += `<li><div>${esc(it.name)} <span class="meta">· ${it.g} г</span></div>` +
                `<span class="kc">${Math.round(it.kcal)}</span>` +
                `<button class="icon-btn" type="button" data-del="${m.id}:${i}" aria-label="Удалить ${esc(it.name)}">✕</button></li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p class="empty">Пока пусто</p>`;
    }
    html += `<button class="add-btn" type="button" data-add="${m.id}">+ Добавить в «${m.name}»</button></article>`;
  });
  $("meals").innerHTML = html;
}

function renderFoodList() {
  const q = $("search").value.trim().toLowerCase();
  const list = FOODS.filter((f) => f.n.toLowerCase().includes(q));
  const html = list.map((f) =>
    `<button class="food-btn" type="button" data-food="${FOODS.indexOf(f)}">` +
    `<span>${esc(f.n)}</span><span class="meta">${f.k} ккал / 100 г</span></button>`
  ).join("");
  $("foodList").innerHTML = html || '<p class="empty">Ничего не найдено</p>';
}

function openSheet(mealId) {
  currentMeal = mealId;
  const meal = MEALS.find((m) => m.id === mealId);
  $("sheetTitle").textContent = `В «${meal.name}»`;
  $("search").value = "";
  $("grams").value = "100";
  renderFoodList();
  $("profileSheet").hidden = true;
  $("sheet").hidden = false;
  $("scrim").hidden = false;
  setTimeout(() => $("search").focus(), 50);
}

export function initFood() {
  $("search").addEventListener("input", renderFoodList);
  $("closeSheet").addEventListener("click", () => { currentMeal = null; closeAllSheets(); });

  $("foodList").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-food]");
    if (!btn || !currentMeal) return;
    const f = FOODS[+btn.dataset.food];
    const g = parseFloat($("grams").value);
    if (!g || g <= 0) { $("grams").focus(); return; }
    const k = g / 100;
    day().meals[currentMeal].push({ name: f.n, g, kcal: f.k * k, p: f.p * k, f: f.f * k, c: f.c * k });
    saveDb();
    currentMeal = null;
    closeAllSheets();
    renderFood();
  });

  $("meals").addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) { openSheet(add.dataset.add); return; }
    const del = e.target.closest("[data-del]");
    if (del) {
      const [mealId, idx] = del.dataset.del.split(":");
      day().meals[mealId].splice(+idx, 1);
      saveDb();
      renderFood();
    }
  });
}
