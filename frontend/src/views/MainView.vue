<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/Contact.vue";
</script>

<template>
  <NavbarItem/>
  <Contact/>
  <div class="about">
    <h1>This is main page</h1>
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
