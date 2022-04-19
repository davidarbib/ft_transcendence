<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import '../src/assets/variables.scss'
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

  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  } 

  body {
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    background: linear-gradient(rgb(74, 65, 131), rgb(226, 54, 130)) fixed;
  }

</style>
