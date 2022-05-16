<script setup lang="ts">
import { LockClosedIcon } from "@heroicons/vue/solid";
import Title from "@/components/Title.vue";
import MusicLoop from "../components/MusicLoop.vue";
import { ref } from "vue";

let email = ref("");
let pseudo = ref("");
let password = ref("");
let comfirm_password = ref("");
</script>

<template>
  <div class="register-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop /></div>
    <div class="input">
      <input
        v-model="email"
        id="email-address"
        name="email"
        type="email"
        autocomplete="email"
        required="true"
        class="w-full h-1/4 rounded-t-md focus:outline-none border border-gray-300"
        placeholder="Email address"
      />
      <br />
      <input
        v-model="pseudo"
        id="pseudo"
        name="pseudo"
        type="text"
        autocomplete="current-password"
        required="true"
        class="w-full h-1/4 focus:outline-none border border-gray-300"
        placeholder="Pseudo"
      />
      <br />
      <input
        v-model="password"
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required="true"
        class="w-full h-1/4 focus:outline-none border border-gray-300"
        placeholder="Password"
      />
      <br />
      <input
        v-model="comfirm_password"
        id="comfirm_password"
        name="comfirm_password"
        type="password"
        autocomplete="current-password"
        required="true"
        class="w-full h-1/4 rounded-b-md focus:outline-none border border-gray-300"
        placeholder="Comfirm password"
      />
    </div>
    <div class="register primary-button">
      <router-link to="/" class="b-submit"> register </router-link>
    </div>
    <div class="register-with-42 primary-button">
      <router-link to="/main" class="b42-submit">
        register with 42
      </router-link>
    </div>
  </div>
</template>

<style lang="scss">
.register-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 4.8fr 3fr repeat(2, 0.5fr) 1fr 1fr;
  gap: 2% 0px;
  grid-auto-flow: row;
  grid-template-areas:
    ". logo sound"
    ". input ."
    ". register ."
    ". register-with-42 ."
    ". . .";

  .logo {
    // border: 2px solid red;
    grid-area: logo;
    margin-top: 3rem;
  }

  .sound {
    text-align: right;
    margin-right: 1rem;
    grid-area: sound;
  }

  .input {
    grid-area: input;

    input {
      padding-left: 1rem;
    }
  }

  .sign-in {
    grid-area: sign-in;
  }

  .register {
    grid-area: register;
  }

  .register-with-42 {
    grid-area: register-with-42;
  }
}
</style>
