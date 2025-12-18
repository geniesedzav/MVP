import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "@/assets/styles/global.css";

import UiInput from "@/components/ui/input.vue";
import UiButton from "@/components/ui/button.vue";

const app = createApp(App);
app.use(autoAnimatePlugin);
app.use(router); // Используем router

// глобальная регистрация
app.component("UiInput", UiInput);
app.component("UiButton", UiButton);

app.mount("#app"); // Монтируем приложение
