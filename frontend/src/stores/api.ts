import { defineStore } from "pinia";

export const apiStore = defineStore("api", {
  state: () => ({
    url: `http://${import.meta.env.VITE_HOST}`,
  }),
});
