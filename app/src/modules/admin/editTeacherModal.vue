<template>
  <div class="modal">
    <div class="modal-window">
      <h2>Редактирование преподавателя</h2>

      <!-- ФИО (только текст) -->
      <div class="teacher-info">
        <p class="teacher-name">
          {{ teacherData.last_name }} {{ teacherData.name }}
          {{ teacherData.patronymic }}
        </p>
      </div>

      <h3>Предметы и группы</h3>

      <!-- Предметы учителя -->
      <div v-for="(subj, index) in subjects" :key="index" class="subject-card">
        <div class="subject-header">
          <!-- Выбор предмета -->
          <select v-model="subj.subject_id">
            <option disabled value="">Выберите предмет</option>
            <option v-for="s in allSubjects" :key="s.id" :value="s.id">
              {{ s.title }}
            </option>
          </select>

          <button class="delete-btn" @click="removeSubject(index)">
            Удалить
          </button>
        </div>

        <!-- Группы (чекбоксы группы организации) -->
        <div class="groups-block">
          <label v-for="g in allGroups" :key="g.id" class="checkbox-row">
            <input type="checkbox" :value="g.id" v-model="subj.group_ids" />
            {{ g.title }}
          </label>
        </div>
      </div>

      <button class="add-subject-btn" @click="addSubject">
        Добавить предмет
      </button>

      <div class="actions">
        <button class="save-btn" @click="save">Сохранить</button>
        <button class="cancel-btn" @click="$emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/http-common.js";

const props = defineProps({
  teacher: Object,
  adminId: Number,
});

const emit = defineEmits(["close", "saved"]);

const teacherData = ref({});
const subjects = ref([]);

const allSubjects = ref([]);
const allGroups = ref([]);

// ======================
// Загружаем данные
// ======================
onMounted(async () => {
  const { data } = await api.get(
    `/admin/${props.adminId}/teacher/${props.teacher.id}/edit`
  );

  teacherData.value = data.teacher;

  // Загружаем предметы преподавателя
  subjects.value = data.subjects.map((s) => ({
    subject_id: s.id,
    group_ids: s.groups.map((g) => g.id),
  }));

  // Предметы и группы организации
  allSubjects.value = data.allSubjects;
  allGroups.value = data.allGroups;
});

// ======================
// Удалить предмет
// ======================
function removeSubject(index) {
  subjects.value.splice(index, 1);
}

// ======================
// Добавить предмет
// ======================
function addSubject() {
  subjects.value.push({
    subject_id: "",
    group_ids: [],
  });
}

// ======================
// Сохранить изменения
// ======================
async function save() {
  try {
    await api.put(`/admin/${props.adminId}/teacher/${props.teacher.id}`, {
      subjects: subjects.value,
    });

    alert("Данные преподавателя успешно обновлены.");

    emit("saved");
    emit("close");
  } catch (e) {
    alert("Ошибка при сохранении данных.");
    console.error(e);
  }

  emit("saved");
}
</script>

<style scoped>
/* Модальное окно */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-window {
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* ФИО */
.teacher-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

/* Карта предмета */
.subject-card {
  border: 1px solid #e5e7eb;
  background: #fafafa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.checkbox-row {
  display: flex;
  gap: 8px;
  margin-bottom: 5px;
}

.add-subject-btn {
  margin-top: 10px;
  background: #e5e7eb;
  padding: 8px 12px;
  border-radius: 8px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.save-btn {
  background: #007bff;
  color: white;
  padding: 10px 14px;
  border-radius: 8px;
}

.cancel-btn {
  background: #e5e7eb;
  padding: 10px 14px;
  border-radius: 8px;
}

.delete-btn {
  background: #ff4d4f;
  padding: 6px 10px;
  color: white;
  border-radius: 8px;
}
</style>
