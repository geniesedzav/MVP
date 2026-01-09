import { createRouter, createWebHistory } from "vue-router";
import auth from "./routes/auth.js";
const routes = [
  {
    path: "/",
    component: () => import("@/modules/login.vue"),
  },
  ...auth,

  //студент
  {
    path: "/student/:id",
    name: "student-main",
    component: () => import("@/modules/student/index.vue"),
    meta: { role: 1 },
  },

  //учитель
  {
    path: "/teacher/:id",
    name: "teacher-main",
    component: () => import("@/modules/teacher/index.vue"),
    meta: { role: 3 },
  },
  {
    path: "/journal",
    name: "journal",
    component: () => import("@/modules/teacher/journal.vue"),
    meta: { role: 3 },
  },

  //админ
  {
    path: "/admin/:id",
    name: "admin-main",
    component: () => import("@/modules/admin/index.vue"),
    meta: { role: 2 },
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const role = Number(localStorage.getItem("role_id"));
  const userid = Number(localStorage.getItem("userid"));

  // // Если нет токена — доступ только на login
  // if (!token && to.path !== "/login") {
  //   return next("/login");
  // }

  // // 1. Проверка роли (meta.role)
  // if (to.meta.role && to.meta.role !== role) {
  //   return next("/login");
  // }

  // 2. Студент → может ходить только по путям /student/:id/*
  if (role === 1 && to.path.startsWith("/student")) {
    if (Number(to.params.id) !== userid) {
      return next(`/student/${userid}`);
    }
  }

  // 3. Учитель → только в /teacher/:id/*
  if (role === 3 && to.path.startsWith("/teacher")) {
    if (Number(to.params.id) !== userid) {
      return next(`/teacher/${userid}`);
    }
  }

  // 4. Админ → только в /admin/:id/*
  if (role === 2 && to.path.startsWith("/admin")) {
    if (Number(to.params.id) !== userid) {
      return next(`/admin/${userid}`);
    }
  }

  next();
});

export default router;
