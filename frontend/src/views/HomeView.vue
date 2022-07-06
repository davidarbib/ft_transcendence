<script setup lang="ts">
import Title from "@/components/TitleMaxComponent.vue";
import MusicLoop from "../components/MusicLoopComponent.vue";
</script>

<template>
  <div class="login-section">
    <div class="logo"><Title /></div>
    <div class="sound"><MusicLoop music="../assets/homepage_music.mp3" /></div>
    <div class="connect-with-discord">
      <a href="http://localhost:8090/auth/discordLogin" class="primary-button">
        Connect with Discord
      </a>
    </div>
    <div class="connect-with-42">
      <a href="http://localhost:8090/auth/login" class="b42-submit">
        Connect with 42
      </a>
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
      position: relative;
      top: 6rem;
      justify-content: center;
      align-items: flex-end;
    }

    .connect-with-discord,
    .connect-with-42 {
      width: 50%;
      margin: auto;
    }

    .connect-with-discord {
      position: relative;
      top: -6rem;
    }

    .connect-with-42 {
      position: relative;
      top: -16rem;
    }
  }
}
</style>
