export const SUPABASE_URL = "https://jzfnjsbenwjrrrxzwnfe.supabase.co";
export const SUPABASE_KEY = "sb_publishable_ipXQ1eiB4fm024bDAdRr-Q_k6s-XlZY";
export const RING_LEN = 339.29;

export const GOAL_LABELS = {
  weight_loss: "Похудение",
  fat_loss: "Сброс жира",
  muscle_gain: "Набор массы",
  strength: "Набор силовых"
};

export const ACTIVITY_MAP = {
  sedentary: { label: "Сидячий",      coeff: 1.2 },
  light:     { label: "Умеренный",    coeff: 1.375 },
  moderate:  { label: "Средний",      coeff: 1.55 },
  active:    { label: "Активный",     coeff: 1.725 },
  extreme:   { label: "Максимальный", coeff: 1.9 }
};

export const FOODS = [
  { n: "Овсянка сухая",          k: 370, p: 13,  f: 7,   c: 62 },
  { n: "Яйцо куриное",           k: 157, p: 13,  f: 11,  c: 1 },
  { n: "Куриная грудка варёная", k: 165, p: 31,  f: 3.6, c: 0 },
  { n: "Лосось запечённый",      k: 208, p: 20,  f: 13,  c: 0 },
  { n: "Творог 5%",              k: 121, p: 17,  f: 5,   c: 3 },
  { n: "Йогурт греческий 0%",    k: 59,  p: 10,  f: 0.4, c: 3.6 },
  { n: "Рис отварной",           k: 130, p: 2.7, f: 0.3, c: 28 },
  { n: "Гречка отварная",        k: 110, p: 4.2, f: 1.1, c: 21 },
  { n: "Картофель отварной",     k: 82,  p: 2,   f: 0.4, c: 17 },
  { n: "Хлеб ржаной",            k: 259, p: 8.5, f: 1.2, c: 48 },
  { n: "Банан",                  k: 89,  p: 1.1, f: 0.3, c: 23 },
  { n: "Яблоко",                 k: 52,  p: 0.3, f: 0.2, c: 14 },
  { n: "Молоко 2.5%",            k: 52,  p: 2.8, f: 2.5, c: 4.7 },
  { n: "Миндаль",                k: 579, p: 21,  f: 50,  c: 22 }
];

export const MEALS = [
  { id: "breakfast", name: "Завтрак" },
  { id: "lunch",     name: "Обед" },
  { id: "dinner",    name: "Ужин" },
  { id: "snack",     name: "Перекус" }
];

export const PLAN = [
  { name: "Приседания с весом тела", sets: 3, reps: "12" },
  { name: "Отжимания от пола или с колен", sets: 3, reps: "8–12" },
  { name: "Тяга гантели в наклоне", sets: 3, reps: "10 на руку" },
  { name: "Выпады назад", sets: 3, reps: "10 на ногу" },
  { name: "Ягодичный мост", sets: 3, reps: "15" },
  { name: "Планка", sets: 3, reps: "30 сек" }
];
