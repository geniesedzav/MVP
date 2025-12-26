<template>
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
        <a class="body-b2" href="/journal">Журнал</a>
      </div>
      <div class="item">
        <span class="body-b2">Конструктор теста</span>
      </div>
    </div>
  </nav>
</template>
<style scoped>
nav {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  width: 300px;
  background-color: var(--background-surface1);
  padding: var(--padding-m);
}
nav .info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: var(--gap-vertical-2);
  margin-top: 40px;
}
.item {
  display: flex;
  gap: var(--gap-horizontal-3);
  padding: var(--padding-s);
  border-radius: var(--border-radius-s);
  transition: 0.15;
}
.item:hover {
  background-color: var(--background-surface2);
}
</style>
