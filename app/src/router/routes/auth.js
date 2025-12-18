import login from "@/modules/login.vue";
import register from '@/modules/register.vue'
const router = [
    {
        path: "/login",
        name: "login",
        component: login,
    },
    {
        path: "/register",
        name: "register",
        component: register,
    }
]
export default router