<script setup lang="ts">
import LockClosedIcon from "@heroicons/vue/solid";
import Title from "@/components/Title.vue";
import MusicLoop from "../components/MusicLoop.vue";
</script>

<template>
  <div class="login-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop /></div>
    <div class="input">
      <input
        id="email-address"
        name="email"
        type="email"
        autocomplete="email"
        required="true"
        class="w-full h-1/2 rounded-t-md focus:outline-none border border-gray-300"
        placeholder="Email address"
      />
      <br />
      <input
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        required="true"
        class="w-full h-1/2 rounded-b-sm focus:outline-none border border-gray-300"
        placeholder="Password"
      />
    </div>
    <div class="sign-in primary-button">
      <router-link to="/main" class="b-submit"> Sign in </router-link>
    </div>
    <div class="register primary-button">
      <router-link to="/register" class="b-submit"> Register </router-link>
    </div>
    <div class="connect-with-42 primary-button">
      <router-link to="/main" class="b42-submit"> Connect with 42 </router-link>
    </div>
  </div>
</template>

<style lang="scss">
@use "../assets/variables.scss" as v;

.login-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 4.8fr 1.5fr repeat(3, 0.5fr) 1fr;
  gap: 4% 0px;
  grid-auto-flow: row;
  grid-template-areas:
    ". logo sound"
    ". input ."
    ". sign-in ."
    ". register ."
    ". connect-with-42 ."
    ". . .";

  .logo {
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

  .connect-with-42 {
    grid-area: connect-with-42;
  }
}
</style>
