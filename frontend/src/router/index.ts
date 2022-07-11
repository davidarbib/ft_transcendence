import { createRouter, createWebHistory } from "vue-router";
import { is2faAuthenticated, is2faEnabled, isLoggedIn } from "@/utils/auth";
import ChatView from "@/views/ChatView.vue";
import ErrorView from "@/views/ErrorView.vue";
import HomeView from "@/views/HomeView.vue";
import MainView from "@/views/MainView.vue";
import PongView from "@/views/PongView.vue";
import ProfileView from "@/views/ProfilView.vue";
import MyProfileView from "@/views/MyProfilView.vue";
import Auth2faView from "@/views/Auth2faView.vue";
import PrivateGameView from "@/views/PrivateGame.vue";
import LobbyView from "@/views/LobbyView.vue";

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
    },
    {
      path: "/privateGame/:inviteId",
      name: "privateGame",
      component: PrivateGameView,
    },
    {
      path: "/auth2fa",
      name: "auth2fa",
      component: Auth2faView,
    },
    {
      path: "/lobby",
      name: "lobby",
      component: LobbyView,
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
  if (to.name == "home" && isLoggedIn()) {
    if (is2faEnabled() && !is2faAuthenticated()) next({ path: "auth2fa" });
    else next({ path: "/main" });
  } else if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({ path: "/" });
  } else next();
});

export default router;
