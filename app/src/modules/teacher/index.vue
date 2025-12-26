<script setup>
import { ref, onMounted } from "vue";
import api from "@/http-common.js";

const isInitOpen = ref(false);

async function loadTeacherState() {
  try {
    const { data } = await api.get("/teacher/state");

    if (data.role === 3 && !data.teacherInitialized) {
      isInitOpen.value = true;
    }
  } catch (err) {
    console.error("Ошибка загрузки состояния преподавателя", err);
  }
}

function onTeacherInitialized() {
  isInitOpen.value = false;
}

onMounted(async () => {
  await loadTeacherState();
});
</script>

<template>
  <div id="teacher-layout">
    <nav>
      <div class="info">
        <h5 class="heading-h4">Екатерина Васильевна</h5>
        <span class="description-d1">Преподаватель</span>
      </div>
      <div class="menu">
        <div class="item">
          <span class="body-b2">Главная страница</span>
        </div>
        <div class="item">
          <span class="body-b2">Журнал</span>
        </div>
        <div class="item">
          <span class="body-b2">Конструктор теста</span>
        </div>
      </div>
    </nav>
    <div class="position">
      <div class="content">
        <div class="widget-organization">
          <h3 class="heading-h3">Организации</h3>
          <div class="list">
            <div class="tablet">
              <span class="heading-h5">МБОУ СОШ № 5</span>
            </div>
            <div class="tablet">
              <span class="heading-h5">ГПОУ ЯО ЯКУиПТ</span>
            </div>
            <div class="tablet">
              <span class="heading-h5"
                >Московский госудаственный университет</span
              >
            </div>
          </div>
        </div>
        <div class="vertical">
          <div class="horizantal">
            <div class="card-info">
              <h3 class="heading-h3">16 групп</h3>
              <span class="body-b3">Обучаются у вас</span>
            </div>
            <div class="card-info">
              <h3 class="heading-h3">5 тестов</h3>
              <span class="body-b3">Работают сейчас</span>
            </div>
            <div class="card-info">
              <h3 class="heading-h3">4.5 средняя оценка</h3>
              <span class="body-b3">По всем предметам</span>
            </div>
          </div>
          <div class="wighet-tests">
            <div class="heading">
              <h3 class="heading-h3">Созданные тесты</h3>
              <a href="" class="body-b3 link-a">Открыть тесты</a>
            </div>
            <table>
              <thead>
                <tr>
                  <th class="heading-h4 cell">Название</th>
                  <th class="heading-h4 cell">Дата начала</th>
                  <th class="heading-h4 cell">Дата окончания</th>
                  <th class="heading-h4 cell">Время прохождения</th>
                  <th class="heading-h4 cell">Процент завершения</th>
                </tr>
              </thead>
              <tbody>
                <tr class="row">
                  <td class="body-b3 cell">
                    Как использовать модульные глаголы в настоящем разговоре
                  </td>
                  <td class="body-b3 cell">10.10.2024</td>
                  <td class="body-b3 cell">10.10.2025</td>
                  <td class="body-b3 cell">45 минут</td>
                  <td class="body-b3 cell">45%</td>
                </tr>
                <tr class="row">
                  <td class="body-b3 cell">
                    Как использовать модульные глаголы в настоящем разговоре
                  </td>
                  <td class="body-b3 cell">10.10.2024</td>
                  <td class="body-b3 cell">10.10.2025</td>
                  <td class="body-b3 cell">45 минут</td>
                  <td class="body-b3 cell">45%</td>
                </tr>
                <tr class="row">
                  <td class="body-b3 cell">
                    Как использовать модульные глаголы в настоящем разговоре
                  </td>
                  <td class="body-b3 cell">10.10.2024</td>
                  <td class="body-b3 cell">10.10.2025</td>
                  <td class="body-b3 cell">45 минут</td>
                  <td class="body-b3 cell">45%</td>
                </tr>
                <tr class="row">
                  <td class="body-b3 cell">
                    Как использовать модульные глаголы в настоящем разговоре
                  </td>
                  <td class="body-b3 cell">10.10.2024</td>
                  <td class="body-b3 cell">10.10.2025</td>
                  <td class="body-b3 cell">45 минут</td>
                  <td class="body-b3 cell">45%</td>
                </tr>
                <tr class="row">
                  <td class="body-b3 cell">
                    Как использовать модульные глаголы в настоящем разговоре
                  </td>
                  <td class="body-b3 cell">10.10.2024</td>
                  <td class="body-b3 cell">10.10.2025</td>
                  <td class="body-b3 cell">45 минут</td>
                  <td class="body-b3 cell">45%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <InitTeacherModal v-if="isInitOpen" @saved="onTeacherInitialized" />
  </div>
</template>
<style scoped src="@/assets/styles/roles/teacher/index.css"></style>
