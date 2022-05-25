import { defineStore } from "pinia";

export const authStore = defineStore({
  id: "authStore",
  state: () => ({
      token: String,
      login: String,
      username: String,
      lossCount: Number,
      winCount: Number,
      logged: Boolean,
      id: String,
      status: String,
      avatarRef: String,
      authToken: String
  }),
});