import { PLAN } from "./data.js";
import { $, day, saveDb, pad, esc } from "./state.js";

export function renderWorkout() {
  let html = "";
  PLAN.forEach((ex, i) => {
    const marks = day().sets[i] || [];
    let done = 0, btns = "";
    for (let s = 0; s < ex.sets; s++) {
      const on = !!marks[s];
      if (on) done++;
      btns += `<button class="set" type="button" aria-pressed="${on}" data-ex="${i}" data-set="${s}">${s + 1}</button>`;
    }
    html += `<div class="ex"><div class="ex-top"><span class="ex-name">${esc(ex.name)}</span>` +
            `<span class="ex-scheme">${ex.sets} × ${ex.reps}</span></div>` +
            `<div class="sets">${btns}</div><div class="progress">${done} из ${ex.sets} подходов</div></div>`;
  });
  $("exercises").innerHTML = html;
}

export function initWorkout() {
  $("exercises").addEventListener("click", (e) => {
    const b = e.target.closest("[data-set]");
    if (!b) return;
    const i = +b.dataset.ex, s = +b.dataset.set;
    const marks = day().sets[i] || (day().sets[i] = []);
    marks[s] = !marks[s];
    saveDb();
    renderWorkout();
  });

  let restLeft = 60, restTimer = null;
  const fmt = (s) => `0${Math.floor(s / 60)}:${pad(s % 60)}`;

  $("restBtn").addEventListener("click", () => {
    if (restTimer) {
      clearInterval(restTimer);
      restTimer = null;
      $("restBtn").textContent = "Старт 60 с";
      $("restTime").textContent = "01:00";
      return;
    }
    restLeft = 60;
    $("restTime").textContent = fmt(restLeft);
    $("restBtn").textContent = "Стоп";
    restTimer = setInterval(() => {
      restLeft -= 1;
      $("restTime").textContent = fmt(Math.max(0, restLeft));
      if (restLeft <= 0) {
        clearInterval(restTimer);
        restTimer = null;
        $("restBtn").textContent = "Старт 60 с";
        $("restTime").textContent = "Готово";
      }
    }, 1000);
  });
}
