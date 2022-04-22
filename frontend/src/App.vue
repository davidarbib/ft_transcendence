<script setup lang="ts">
import Signin from "./components/Signin.vue";
</script>

<template>
  <h1 class="text-8xl font-bold">Vice Pong</h1>
  <Signin />
</template>

<style lang="scss">
  @use './assets/variables.scss' as v;
  @import "@/assets/_base.scss";

  h1 {
    font-family: Kallisto-bold, sans-serif;
    text-align: center;
  }
</style>
