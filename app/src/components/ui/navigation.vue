<script setup>

</script>

<template>
  <div class="navbar">
    <template v-if="role === 3">
      <div class="user-fio">
        <div class="user-img">
          <div class="fio">
            <span>Екатерина Васильевна</span>
            <span>Преподаватель</span>
          </div>
        </div>
      </div>
      <nav>
        <div class="chapter">
          <span>Главная страница</span>
        </div>
        <div class="chapter">
          <span>Журнал</span>
        </div>
        <div class="chapter">
          <span>Конструктор теста</span>
        </div>
      </nav>
    </template>
    <template v-if="role === 2">
      <div class="user-fio">
        <div class="user-img">
          <div class="fio">
            <span>ЯКУиПТ</span>
            <span>Админ</span>
          </div>
        </div>
      </div>
      <nav>
        <div class="chapter">
          <span>Преподаватели</span>
        </div>
        <div class="chapter">
          <span>Группы</span>
        </div>
        <div class="chapter">
          <span>Студенты</span>
        </div>
      </nav>
    </template>
  </div>
</template>

<style scoped>

</style>