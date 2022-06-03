<script setup lang="ts">
import LockClosedIcon from "@heroicons/vue/solid";
import Title from "@/components/TitleMax.vue";
import MusicLoop from "../components/MusicLoop.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { apiStore } from "@/stores/api";
import { useUserStore } from "@/stores/auth";
import { useRouter } from "vue-router";

let email = ref("");
let password = ref("");
const router = useRouter();

const api = apiStore();
const userStore = useUserStore();
</script>

<template>
  <div class="login-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop /></div>
    <div class="connect-with-discord" @click="tryLogin">
      <a href="http://localhost:8090/auth/discordLogin" class="primary-button">
        Connect with Discord
      </a>
    </div>
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
  grid-template-rows: 10% 40% 20% 20% 1fr;
  grid-auto-flow: row;

  .logo {
    grid-area: 2 / 2 / 3 / 3;
  }

  .sound {
    text-align: right;
    margin-right: 1rem;
    grid-area: 1 / 3 / 1 / 3;
  }

  .connect-with-discord {
    grid-area: 3 / 2 / 3 / 2;
    margin-top: 0.5rem;
  }

  .connect-with-42 {
    grid-area: 4 / 2 / 4 / 2;
    margin-top: -2.5rem;
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
