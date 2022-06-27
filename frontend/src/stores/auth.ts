import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    user: {
      id: "default",
      login: "",
      username: "",
      status: "online",
      authToken: null,
      avatarRef: null,
      lossCount: "0",
      winCount: "0",
      twoFactorEnabled: true,
      twoFactorSecret: "",
    },
  }),
});
