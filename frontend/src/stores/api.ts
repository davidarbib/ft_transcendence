import { defineStore } from "pinia";

export const apiStore = defineStore("api", {
  state: () => ({
    url: "http://localhost:8090",
  }),
});
