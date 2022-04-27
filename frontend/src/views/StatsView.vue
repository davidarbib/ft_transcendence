<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue"
</script>

<template>
  <NavbarItem/>
  <div class="about">
    <h1>This is stats page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
