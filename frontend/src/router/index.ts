import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn } from "@/utils/auth";

import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";
import GameModeView from "@/views/GameModeView.vue";
import HomeView from "@/views/HomeView.vue";
import MainView from "@/views/MainView.vue";
import PongView from "@/views/PongView.vue";
import ProfilView from "@/views/ProfilView.vue";
import MyProfilView from "@/views/MyProfilView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        allowAnonymous: true
      }
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
      path: "/myprofile",
      name: "myprofile",
      component: MyProfilView,
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
      component: ErrorView,
      meta: {
        allowAnonymous: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name == 'home' && isLoggedIn()) {
    next({ path: '/main' })
  }
  else if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      path: '/',
    })
  }
  else {
    next()
  }
})

export default router;
