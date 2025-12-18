<template>
  <div class="modal-overlay">
    <div class="modal-window">
      <!-- твой текущий контент модалки -->
      <h2 class="heading-h2">Предметы</h2>

      <div class="list">
        <div
          class="subject-row"
          v-for="(subject, index) in localSubjects"
          :key="index"
        >
          <UiInput
            class="subject-input"
            v-model="subject.title"
            placeholder="Название предмета"
          />
          <button class="remove-btn" @click="removeSubject(index)">✕</button>
        </div>
      </div>
      <a
        href=""
        class="heading-h4"
        style="color: var(--accent-default)"
        @click.prevent="addSubject"
        >Добавить предмет</a
      >
      <div class="actions">
        <UiButton variant="secondary" @click="$emit('close')">
          Отменить
        </UiButton>
        <UiButton @click="save"> Сохранить </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "@/http-common.js";
import UiInput from "@/components/ui/input.vue";
import UiButton from "@/components/ui/button.vue";

const props = defineProps({
  subjects: {
    type: Array,
    required: true,
  },
  adminId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["close", "saved"]);

// Локальная копи
const localSubjects = ref([]);

watch(
  () => props.subjects,
  (val) => {
    localSubjects.value = val.map((s) => ({ ...s }));
  },
  { immediate: true }
);

function addSubject() {
  localSubjects.value.push({ title: "" });
}

function removeSubject(index) {
  localSubjects.value.splice(index, 1);
}

async function save() {
  try {
    await api.put(`/admin/${props.adminId}/subjects`, {
      subjects: localSubjects.value,
    });
    emit("saved");
  } catch (err) {
    console.error("Ошибка сохранения предметов", err);
  }
}
</script>
<style scoped>
/* Затемнённый фон */
.modal-overlay {
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

/* Окно модалки */
.modal-window {
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Дополнительно — чтобы список красиво жил */
.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
}

.subject-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subject-input {
  flex: 1;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}
</style>
