import { ACTIVITY_MAP } from "./data.js";

export const $ = (id) => document.getElementById(id);
export const pad = (n) => (n < 10 ? "0" + n : "" + n);
export const round1 = (x) => Math.round(x * 10) / 10;
export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const now = new Date();

export const state = {
  now,
  todayKey: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
  user: null,
  draft: { goal: "", height: "", weight: "", age: "", sex: "m", activity: "" },
  goal: { kcal: 2000, p: 130, f: 70, c: 230 },
  db: { days: {} }
};

function storageKey() {
  return "solofit-v2-" + (state.user?.id || "guest");
}

export function loadDb() {
  try {
    state.db = JSON.parse(localStorage.getItem(storageKey())) || { days: {} };
  } catch {
    state.db = { days: {} };
  }
}

export function saveDb() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(state.db));
  } catch {}
}

export function day() {
  if (!state.db.days) state.db.days = {};
  if (!state.db.days[state.todayKey]) {
    state.db.days[state.todayKey] = {
      meals: { breakfast: [], lunch: [], dinner: [], snack: [] },
      sets: {}
    };
  }
  return state.db.days[state.todayKey];
}

export function calcBMI(heightCm, weightKg) {
  const h = parseFloat(heightCm) / 100;
  const w = parseFloat(weightKg);
  if (!h || !w) return 0;
  return Math.round((w / (h * h)) * 10) / 10;
}

export function calcGoal(meta) {
  const w = parseFloat(meta.weight) || 70;
  const h = parseFloat(meta.height) || 175;
  const age = parseFloat(meta.age) || 20;
  const sexOffset = meta.sex === "f" ? -161 : 5;
  const act = ACTIVITY_MAP[meta.activity]?.coeff || 1.55;

  // Формула Миффлина–Сан Жеора с полным учётом возраста и пола
  const bmr = 10 * w + 6.25 * h - 5 * age + sexOffset;
  const tdee = bmr * act;

  let mult = 1.0, pPerKg = 1.8;
  if (meta.goal === "weight_loss") { mult = 0.82; pPerKg = 1.8; }
  else if (meta.goal === "fat_loss") { mult = 0.88; pPerKg = 2.1; }
  else if (meta.goal === "muscle_gain") { mult = 1.12; pPerKg = 2.0; }
  else if (meta.goal === "strength") { mult = 1.08; pPerKg = 2.0; }

  const kcal = Math.max(1200, Math.round((tdee * mult) / 10) * 10);
  const p = Math.round(w * pPerKg);
  const f = Math.round(w * 0.9);
  const c = Math.max(50, Math.round((kcal - p * 4 - f * 9) / 4));
  return { kcal, p, f, c };
}

export function closeAllSheets() {
  $("sheet").hidden = true;
  $("profileSheet").hidden = true;
  $("scrim").hidden = true;
}
