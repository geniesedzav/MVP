<template>
  <nav>
    <a href="">Преподаватели</a>
    <a href="">группы и студенты</a>
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
    <div class="group-result">
      <div class="course">
        <h3>Курс 1</h3>
        <div class="groups"></div>
      </div>
    </div>
  </section>
</template>

<script scoped>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "@/http-common.js";

import UiInput from "@/components/ui/input.vue";
import UiButton from "@/components/ui/button.vue";
import EditTeacherModal from "./editTeacherModal.vue";
import SubjectsModal from "./subjectsModal.vue";
</script>
