import { createRouter, createWebHistory } from "vue-router";

// ajouter le path .vue de la page a ajouter

import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";
import GameModeView from "@/views/GameModeView.vue";
import HomeView from "@/views/HomeView.vue";
import MainView from "@/views/MainView.vue";
import PongView from "@/views/PongView.vue";
import ProfilView from "@/views/ProfilView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { // Ajouter toutes les pages de routes.
      path: "/",
      name: "home",
      component: HomeView,
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
      path: "/profil/:pseudo",
      name: "profil",
      component: ProfilView,
      props: true
    },
    {
      path: "/mode",
      name: "game_mode",
      component: GameModeView,
    },
    {
      path: "/:catchAll(.*)",
      name: "error",
      component: ErrorView
    }
  ]
})

export default router;