<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/Contact.vue";
</script>

<template>
  <div class="main max-h-full max-w-full">
  <NavbarItem/>
  <div class="about">
  <Contact/>
  </div>
  </div>
    
</template>

<style scoped>
.main {
  position: fixed;
  }
</style>
