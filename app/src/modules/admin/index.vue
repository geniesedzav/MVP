<template>
  <div id="app-content">
    <nav>
      <a href="">Преподаватели</a>
      <a href="">Групппы</a>
      <a href="">Предметы</a>
    </nav>
    <section class="content">
      <header>
        <div class="filters">
          <UiButton
            color="neutral"
            variant="secondary"
            size="l"
            @click="resetFilters"
            id="filter_button"
          >
            Сбросить фильтры
          </UiButton>
          <div id="search">
            <UiInput
              v-model="search"
              placeholder="Найдите по ФИО"
              required
              type="text"
            />
          </div>

          <div class="select select--default">
            <select class="select__control" v-model="groupFilter">
              <option disabled value="">Найти по группам</option>
              <option v-for="g in allGroups" :key="g" :value="g">
                {{ g }}
              </option>
            </select>
            <span class="select__icon">▾</span>
          </div>
          <div class="select select--default">
            <select class="select__control" v-model="subjectFilter">
              <option disabled value="">Найти по предмету</option>
              <option v-for="s in allSubjects" :key="s" :value="s">
                {{ s }}
              </option>
            </select>
            <span class="select__icon">▾</span>
          </div>
        </div>
        <div class="buttons-nav">
          <UiButton @click="" id="btn">Добавить преподавателя</UiButton>
          <UiButton @click="openSubjects" id="btn" variant="secondary"
            >Предметы</UiButton
          >
        </div>
      </header>
      <div class="teacher_result">
        <div
          class="result_list"
          v-for="teacher in filteredTeachers"
          :key="teacher.id"
        >
          <div class="main_info">
            <div class="account">
              <div class="avatar"></div>
              <div class="avatar_text">
                <h3 class="heading-h3">
                  {{ teacher.last_name }} {{ teacher.name }}
                  {{ teacher.patronymic }}
                </h3>
                <span class="body-b3">{{ teacher.role }}</span>
              </div>
            </div>
            <div class="subjects">
              <div
                class="card_subject"
                v-for="subject in teacher.subjects"
                :key="subject.title"
              >
                <h4 class="heading-h4">{{ subject.title }}</h4>
                <span class="body-b2">{{ subject.groups.join(", ") }}</span>
              </div>
            </div>
          </div>
          <div class="buttons">
            <UiButton
              @click="openEdit(teacher)"
              color="neutral"
              variant="primary"
              size="l"
              class="body-b1"
              >Редактировать
            </UiButton>

            <UiButton
              @click=""
              color="neutral"
              variant="secondary"
              size="l"
              class="body-b1"
              >Уволить</UiButton
            >
          </div>
        </div>
      </div>
    </section>
    <EditTeacherModal
      v-if="isEditOpen"
      :teacher="selectedTeacher"
      :admin-id="Number(adminId)"
      @saved="onTeacherUpdated"
      @close="isEditOpen = false"
    />
    <SubjectsModal
      v-if="isSubjectsOpen"
      :subjects="subjects"
      :admin-id="Number(adminId)"
      @close="isSubjectsOpen = false"
      @saved="onSubjectsSaved"
    />
  </div>
</template>
<style scoped src="@/assets/styles/roles/admin/index.css"></style>
<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "@/http-common.js";

import UiInput from "@/components/ui/input.vue";
import UiButton from "@/components/ui/button.vue";
import EditTeacherModal from "./editTeacherModal.vue";
import SubjectsModal from "./subjectsModal.vue";

const isSubjectsOpen = ref(false);
const subjects = ref([]);
const route = useRoute();
const adminId = route.params.id;

const teachers = ref([]);

const search = ref("");
const subjectFilter = ref("");
const groupFilter = ref("");

// =============================
// ВСПОМОГАТЕЛЬНЫЕ СПИСКИ
// =============================
const allSubjects = computed(() => {
  const set = new Set();
  teachers.value.forEach((t) => {
    t.subjects.forEach((s) => set.add(s.title));
  });
  return [...set];
});

const allGroups = computed(() => {
  const set = new Set();
  teachers.value.forEach((t) => {
    t.subjects.forEach((s) => {
      s.groups.forEach((g) => set.add(g));
    });
  });
  return [...set];
});

// =============================
// ФИЛЬТРАЦИЯ
// =============================
const filteredTeachers = computed(() => {
  let list = [...teachers.value];

  // === 1. По ФИО ===
  if (search.value.trim() !== "") {
    const q = search.value.toLowerCase();
    list = list.filter((t) => {
      const full = `${t.last_name} ${t.name} ${t.patronymic}`.toLowerCase();
      return full.includes(q);
    });
  }

  // === 2. По предмету ===
  if (subjectFilter.value !== "") {
    list = list.filter((t) =>
      t.subjects.some((s) => s.title === subjectFilter.value)
    );
  }

  // === 3. По группе ===
  if (groupFilter.value !== "") {
    list = list.filter((t) =>
      t.subjects.some((s) => s.groups.includes(groupFilter.value))
    );
  }

  // === 4. Сортировка по Фамилии ===
  list.sort((a, b) => a.last_name.localeCompare(b.last_name));

  return list;
});

function resetFilters() {
  search.value = "";
  subjectFilter.value = "";
  groupFilter.value = "";
}
const isEditOpen = ref(false);
const selectedTeacher = ref(null);

function openEdit(teacher) {
  selectedTeacher.value = teacher;
  isEditOpen.value = true;
}
async function loadTeachers() {
  try {
    const { data } = await api.get(`/admin/${adminId}/teachers`);
    teachers.value = data;
  } catch (err) {
    console.error("Ошибка загрузки преподавателей:", err);
  }
}
async function onTeacherUpdated() {
  await loadTeachers();
  isEditOpen.value = false;
}
// =============================
// ЗАГРУЗКА ДАННЫХ
// =============================
onMounted(async (loadTeachers) => {
  try {
    const { data } = await api.get(`/admin/${adminId}/teachers`);
    teachers.value = data;
  } catch (err) {
    console.error("Ошибка загрузки преподавателей:", err);
  }
});

async function openSubjects() {
  try {
    const { data } = await api.get(`/admin/${adminId}/subjects`);
    subjects.value = data;
    isSubjectsOpen.value = true;
  } catch (err) {
    console.error("Ошибка загрузки предметов", err);
  }
}
async function onSubjectsSaved() {
  isSubjectsOpen.value = false;
}
</script>
