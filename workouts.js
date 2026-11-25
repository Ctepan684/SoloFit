/* ==========================================================
   SoloFit · BASE / WORKOUTS
   База тренировок. Менять только этот файл.
   Программа: верх/низ, 4 дня в неделю, HIT:
   2 упражнения на крупные группы, 1 на мелкие, по 2 подхода до отказа.
   ========================================================== */
(function () {
  "use strict";

  var PROGRAM = {
    name: "Верх / низ · HIT",
    note: "4 тренировки в неделю: Верх А → Низ А → Верх Б → Низ Б. Каждый подход до отказа. Прогресс: когда верхняя граница диапазона повторов выполняется уверенно, добавляем вес.",
    days: {
      upper_a: {
        title: "Верх А",
        exercises: [
          { name: "Жим штанги лёжа",               sets: 2, reps: "6–10",  group: "chest" },
          { name: "Тяга верхнего блока к груди",   sets: 2, reps: "8–12",  group: "back" },
          { name: "Жим гантелей сидя",             sets: 2, reps: "8–12",  group: "shoulders" },
          { name: "Подъём штанги на бицепс",       sets: 2, reps: "8–12",  group: "biceps" },
          { name: "Разгибание на трицепс на блоке",sets: 2, reps: "8–12",  group: "triceps" }
        ]
      },
      lower_a: {
        title: "Низ А",
        exercises: [
          { name: "Приседания со штангой",         sets: 2, reps: "6–10",  group: "quads" },
          { name: "Румынская тяга",                sets: 2, reps: "8–12",  group: "hamstrings" },
          { name: "Подъём на носки стоя",          sets: 2, reps: "10–15", group: "calves" }
        ]
      },
      upper_b: {
        title: "Верх Б",
        exercises: [
          { name: "Жим гантелей на наклонной",     sets: 2, reps: "8–12",  group: "chest" },
          { name: "Подтягивания (или тяга гантели)",sets: 2, reps: "6–10", group: "back" },
          { name: "Махи гантелями в стороны",      sets: 2, reps: "10–15", group: "shoulders" },
          { name: "Молотки с гантелями",           sets: 2, reps: "8–12",  group: "biceps" },
          { name: "Отжимания на брусьях / жим узкий", sets: 2, reps: "8–12", group: "triceps" }
        ]
      },
      lower_b: {
        title: "Низ Б",
        exercises: [
          { name: "Жим ногами",                    sets: 2, reps: "8–12",  group: "quads" },
          { name: "Сгибание ног лёжа",             sets: 2, reps: "8–12",  group: "hamstrings" },
          { name: "Подъём на носки сидя",          sets: 2, reps: "10–15", group: "calves" }
        ]
      }
    }
  };

  // Порядок ротации: Верх А → Низ А → Верх Б → Низ Б
  var ORDER = ["upper_a", "lower_a", "upper_b", "lower_b"];

  // Какой день программы ставить на какой день недели (0 = вс)
  var WEEKDAY_MAP = { 1: "upper_a", 2: "lower_a", 4: "upper_b", 5: "lower_b" };

  function getDay(id) {
    return PROGRAM.days[id] || PROGRAM.days[ORDER[0]];
  }

  function todayId() {
    var wd = new Date().getDay();
    return WEEKDAY_MAP[wd] || ORDER[0];
  }

  // Формат, который уже понимает index.html (PLAN = [{name, sets, reps}])
  function toPlan(id) {
    return getDay(id).exercises.map(function (ex) {
      return { name: ex.name, sets: ex.sets, reps: ex.reps };
    });
  }

  window.SOLOFIT_WORKOUTS = {
    program: PROGRAM,
    order: ORDER,
    getDay: getDay,
    todayId: todayId,
    toPlan: toPlan
  };
})();
