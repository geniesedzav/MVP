<script setup>
import { ref, onMounted } from "vue";
import api from "@/http-common.js";
import InitTeacherModal from "./add-information-modal.vue";

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
    <h1>Кабинет преподавателя</h1>

    <InitTeacherModal v-if="isInitOpen" @saved="onTeacherInitialized" />
  </div>
</template>
