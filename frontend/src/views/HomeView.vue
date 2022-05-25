<script setup lang="ts">
import LockClosedIcon from "@heroicons/vue/solid";
import Title from "@/components/TitleMax.vue";
import MusicLoop from "../components/MusicLoop.vue";
import { ref } from "vue";
import axios from "axios";
import { apiStore } from "@/stores/api";
import { useUserStore } from "@/stores/auth";

let email = ref("");
let password = ref("");

const api = apiStore();
const userStore = useUserStore();

const tryLogin = () => {
  axios
    .get(`${api.url}/users/faker`)
    .then((response) => {
      userStore.setLogin(response.data.login);
      userStore.setAuthToken(response.data.authToken);
      userStore.setAvatarRef(response.data.avatarRef);
      userStore.setId(response.data.id);
      userStore.setStatus(response.data.status);
      userStore.setUsername(response.data.username);
      userStore.setLossCount(response.data.lossCount);
      userStore.setWinCount(response.data.winCount);
      userStore.setLogged(true);
      // userStore.print_user();
    })
    .catch((error) => {
      userStore.setLogged(false);
      console.log(error.data);
    });
};
</script>

<template>
  <div class="login-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop /></div>
    <div class="connect-with-42" @click="tryLogin">
      <a to="#" class="b42-submit"> Connect with 42 </a>
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

  @media screen and (min-height: 1160px) {
    .logo {
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }

    .connect-with-42 {
      position: relative;
      top: -8.5rem;
      width: 40%;
      margin: auto;
    }
  }
}
</style>
