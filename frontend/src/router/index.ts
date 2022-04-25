import { createRouter, createWebHistory } from "vue-router";

// ajouter le path .vue de la page a ajouter

import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";
import GameModeView from "@/views/GameModeView.vue";
import HomeView from "@/views/HomeView.vue";
import MainView from "@/views/MainView.vue";
import PongView from "@/views/PongView.vue";
import ProfilView from "@/views/ProfilView.vue";
import RegisterView from "@/views/RegisterView.vue";
import StatsView from "@/views/StatsView.vue";
import TutoView from "@/views/TutoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // Ajouter toutes les pages de routes.
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/main",
      name: "main",
      component: MainView,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatView,
    },
    {
      path: "/pong",
      name: "pong",
      component: PongView,
    },
    {
      path: "/profil",
      name: "profil",
      component: ProfilView,
    },
    {
      path: "/tuto",
      name: "tuto",
      component: TutoView,
    },
    {
      path: "/stats",
      name: "stats",
      component: StatsView,
    },
    {
      path: "/mode",
      name: "game_mode",
      component: GameModeView,
    },
    {
      path: "/:catchAll(.*)",
      component: ErrorView
    }
  ]
})

export default router;