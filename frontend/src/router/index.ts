import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn, is2faRequired } from "@/utils/auth";

import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";
import GameModeView from "@/views/GameModeView.vue";
import HomeView from "@/views/HomeView.vue";
import MainView from "@/views/MainView.vue";
import PongView from "@/views/PongView.vue";
import ProfileView from "@/views/ProfilView.vue";
import MyProfileView from "@/views/MyProfilView.vue";
import Auth2faView from "@/views/Auth2faView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        allowAnonymous: true,
      },
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
      path: "/my_profile",
      name: "my_profile",
      component: MyProfileView,
    },
    {
      path: "/profile/:pseudo",
      name: "profile",
      component: ProfileView,
      props: true,
    },
    {
      path: "/mode",
      name: "game_mode",
      component: GameModeView,
    },
    {
      path: "/auth2fa",
      name: "auth2fa",
      component: Auth2faView,
      meta: {
        allowAnonymous: true,
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "error",
      component: ErrorView,
      meta: {
        allowAnonymous: true,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // is2faRequired().then((status) => {
  //   if (!status) {
  //     next();
  //   } else {
  //     console.log("Status is true !");
  //     if (to.name == "home" && isLoggedIn()) {
  //       next({ path: "/auth2fa" });
  //     } else if (!to.meta.allowAnonymous && !isLoggedIn()) {
  //       next({ path: "/" });
  //     }
  //   }
  // });
  if (to.name == "home" && isLoggedIn()) {
    next({ path: "/main" });
  } else if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      path: "/",
    });
  } else {
    next();
  }
});

export default router;
