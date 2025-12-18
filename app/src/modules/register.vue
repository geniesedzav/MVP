<template>
  <div id="app-content">
    <form class="form">
      <h1 class="heading-h1">Регистрация</h1>

      <div class="contant">
        <UiInput
          label="Логин"
          placeholder="Придумайте никнейм"
          required
          type="text"
          v-model="form.login"
        />

        <UiInput
          label="Пароль"
          placeholder="Пароль от аккаунта"
          required
          type="password"
          v-model="form.password"
        />

        <div class="select select--default">
          <select class="select__control" v-model="form.role">
            <option disabled value="">Роль</option>
            <option value="студент">Ученик</option>
            <option value="учитель">преподаватель</option>
            <option value="администратор">Админ</option>
          </select>
          <span class="select__icon">▾</span>
        </div>
      </div>

      <div class="content-button">
        <div class="button-info">
          <UiButton @click="sendForm"> регистрация </UiButton>
          <p class="body-b3">
            При нажатии на кнопку, вы соглашаетесь на политику
            <a href="">конфиденциальности</a>
          </p>
        </div>
        <span class="body-b3">Есть аккаунт? <a href="">Вход</a></span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import api from "@/http-common.js";
import UiInput from "@/components/ui/input.vue";
import UiButton from "@/components/ui/button.vue";

const form = reactive({
  login: "",
  password: "",
  role: "",
});

async function sendForm() {
  try {
    console.log("Регистрация...", form);

    // 1. Регистрация
    const registerRes = await api.post("/auth/register", {
      login: form.login,
      password: form.password,
      role: form.role,
    });

    // 2. Авторизация
    const loginRes = await api.post("/auth/login", {
      login: form.login,
      password: form.password,
    });

    const token = loginRes.data.token;
    const user = loginRes.data.user;

    if (!token) {
      alert("Ошибка: токен не получен");
      return;
    }

    localStorage.setItem("token", token);

    alert("Регистрация прошла успешно!");
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("data:", err.response?.data);
    console.log("message:", err.message);
  }
}
</script>
<style scoped src="@/assets/styles/auth/register.css"></style>
