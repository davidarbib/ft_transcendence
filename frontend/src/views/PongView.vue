<script setup lang="ts">
import BlockGame from "@/components/BlockGameComponent.vue";
</script>

<template>
  <div class="about">
    <BlockGame />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
@media (min-width: 1024px) {
  .about { 
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
