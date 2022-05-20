<script setup lang="ts">
import LockClosedIcon from "@heroicons/vue/solid";
import Title from "@/components/TitleMax.vue";
import MusicLoop from "../components/MusicLoop.vue";
import { ref } from "vue";
import axios from "axios";
import { apiStore } from "@/stores/api";

let email = ref("");
let password = ref("");

const api = apiStore();
console.log("GITHUB TEST");

const tryLogin = () => {
  axios.post(`${api.url}/login`, {
    email: email.value,
    password: password.value,
  });
};
</script>

<template>
  <div class="login-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop /></div>
    <div class="connect-with-42 primary-button">
      <router-link to="/main" class="b42-submit"> Connect with 42 </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@use "../assets/variables.scss" as v;

.login-section {
  background-image: url("@/assets/sphere.png");
  background-position: center;
  background-repeat: no-repeat;
  display: grid;
  height: 100vh;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 10% 50% 20% 1fr;
  grid-auto-flow: row;

  .logo {
    grid-area: 2 / 2 / 3 / 3;
  }

  .sound {
    text-align: right;
    margin-right: 1rem;
    grid-area: 1 / 3 / 1 / 3;
  }

  .connect-with-42 {
    grid-area: 3 / 2 / 3 / 2;
    margin-top: 2rem;
  }
}
</style>
