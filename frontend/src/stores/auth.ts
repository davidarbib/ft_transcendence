import { defineStore } from "pinia";

export const authJwtStore = defineStore({
  id: "authToken",
  state: () => ({
      token: "",
      logged: false
  }),
});