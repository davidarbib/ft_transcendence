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
      twoFactorEnabled: false,
      twoFactorSecret: "",
    },
  }),
});

export const useChanStore = defineStore({
  id: 'channel',
  state: () => ({
    channel: {id: "default", name: "", type: "", password: ""}
  })
})
