<template>
  <section class="teacher-layout">
    <nav>
      <div class="info">
        <h5 class="heading-h4">Екатерина Васильевна</h5>
        <span class="description-d1">Преподаватель</span>
      </div>
      <div class="menu">
        <div class="item"><span class="body-b2">Главная страница</span></div>
        <div class="item"><a class="body-b2" href="/journal">Журнал</a></div>
        <div class="item"><span class="body-b2">Конструктор теста</span></div>
      </div>
    </nav>

    <div class="content">
      <header>
        <div class="calendar">
          <img src="@/assets/svg/vuesax_linear_arrow-left.svg" @click="prevMonth" />
          <span>{{ month }}</span>
          <img src="@/assets/svg/vuesax_linear_arrow-right.svg" @click="nextMonth" />
        </div>

        <div class="fillters">
          <UiInput v-model="search" placeholder="Найдите по ФИО" type="text" />
          <div class="select select--default">
            <select class="select__control">
              <option disabled value="">Группы</option>
            </select>
          </div>
        </div>
      </header>

      <div id="jounal">
        <div class="interpreter">
          <div class="№-fio">
            <div class="number">№</div>
            <span>Фамилия Имя Отчество</span>
          </div>

          <div class="date">
            <div
              v-for="day in daysInMonth"
              :key="day"
              class="data body-b2"
              :class="{ today: isToday(day) }"
            >
              {{ day }}
            </div>
          </div>

          <h5 class="body-b3">Средний балл</h5>
        </div>

        <div class="info-journal">
          <div class="list-fio">
            <div class="item">
              <div class="number heading-h5">1</div>
              <span class="body-b3">Заводовский Денис Владимирович</span>
            </div>
            <div class="item">
              <div class="number heading-h5">2</div>
              <span class="body-b3">Полякова Кристина Генадьевна</span>
            </div>
            <div class="item">
              <div class="number heading-h5">3</div>
              <span class="body-b3">Ключников Иван Генадьевич</span>
            </div>
            <div class="item">
              <div class="number heading-h5">4</div>
              <span class="body-b3">Заводовский Артур Констатинович</span>
            </div>
            <div class="item">
              <div class="number heading-h5">5</div>
              <span class="body-b3">Аликеева Ольга Михайловна</span>
            </div>
          </div>

          <!-- твой v-for по students -->
        <div class="info-evaluations">
          <div
            class="evaluations"
            v-for="(student, studentIndex) in students"
            :key="student.id"
          >
            <input
              v-for="(day, dayIndex) in daysInMonth"
              :key="day"
              class="evaluation body-b2"
              type="text"
              maxlength="1"
              :data-row="studentIndex"
              :data-col="dayIndex"
              @keydown="onKeyDown"
              @input="onInput"

            />
          </div>

        </div>

          <!-- list-result ДОЛЖЕН БЫТЬ ВНУТРИ info-journal -->
          <div class="list-result">
            <div class="result body-b3">3,54</div>
            <div class="result body-b3">3,34</div>
            <div class="result body-b3">3,24</div>
            <div class="result body-b3">3,14</div>
            <div class="result body-b3">3,04</div>
          </div>
        </div>
        <!-- конец info-journal -->
      </div>
    </div>
  </section>
</template>

  <script setup>
import {ref, computed} from "vue"

const currentDate = ref(new Date())

const month = computed(() => {
  return currentDate.value.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
});

function prevMonth() {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() - 1);
  currentDate.value = d;
}

function nextMonth() {
  const d = new Date(currentDate.value);
  d.setMonth(d.getMonth() + 1);
  currentDate.value = d;
}
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const lastDay = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: lastDay }, (_, i) => i + 1);
});

function isToday(day) {
  const today = new Date()

  return (
    today.getDate() === day &&
    today.getMonth() === currentDate.value.getMonth() &&
    today.getFullYear() === currentDate.value.getFullYear()
  );
}
function onInput(e) {
  const allowed = ["1", "2", "3", "4", "5", "Н", "Б", "У"];
  const value = e.target.value.toUpperCase();

  e.target.classList.remove("insanity");

  if (!allowed.includes(value)) {
    e.target.value = "";
    return;
  }
  if (value === "Y") {
    value = "Н";
  }

  e.target.value = value;

  if (value === "Н" || value === "2") {
    e.target.classList.add("insanity");
  }
}


  import Navigation from "./navigation.vue";
  import UiInput from "@/components/ui/input.vue";

  
function onKeyDown(e) {
  const key = e.key;
  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) return;

  e.preventDefault();

  const input = e.target;
  const row = Number(input.dataset.row);
  const col = Number(input.dataset.col);

  let nextRow = row;
  let nextCol = col;

  if (key === "ArrowUp") nextRow--;
  if (key === "ArrowDown") nextRow++;
  if (key === "ArrowLeft") nextCol--;
  if (key === "ArrowRight") nextCol++;

  const nextInput = document.querySelector(
    `.evaluation[data-row="${nextRow}"][data-col="${nextCol}"]`
  );

  if (nextInput) {
    nextInput.focus();
  }
}
const students = ref([
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
]);



  </script>
  <style scoped src="@/assets/styles/roles/teacher/jounal.css"></style>
