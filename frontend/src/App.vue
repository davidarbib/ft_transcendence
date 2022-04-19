<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <section class="main-content">
    <div class="ball-shape">
      <h1>Pong 2.0</h1>
      <p><a href="#">1 Player</a></p>
      <p><a href="#">2 Players</a></p>
    </div>
  </section>
</template>

<style lang="scss">

  @use './assets/variables.scss' as v;
  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } 

  body {
    font-family: 'Vazirmatn', sans-serif;
    background: linear-gradient(v.$dark-blue, v.$primary) fixed;
    text-align: center;
  }

  .main-content {

    background: linear-gradient(v.$secondary-light, v.$secondary);

    h1 {
      color: v.$secondary;
      font-size: v.$primary-title;
    }

    p a {
      color: v.$primary;
      font-size: v.$secondary-title;
      text-decoration: none;
    }
  }

</style>
