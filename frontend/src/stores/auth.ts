import { defineStore } from "pinia";

export const authJwtStore = defineStore({
  id: "authToken",
  state: () => ({
      token: "",
      logged: false,
      user_id: 0,
      status: "online"
  }),
});