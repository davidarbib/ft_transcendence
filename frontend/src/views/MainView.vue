<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/contact.vue";
</script>

<template>
  <div class="main-section">
    <div class="game"></div>
    <div class="navbar"><NavbarItem /></div>
    <div class="contact"></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;
.main-section {
  display: grid;
  grid-template-columns: 1.6fr 0.4fr;
  grid-template-rows: 0.2fr 1.8fr;
  gap: 0% 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "navbar navbar"
    "game contact";
}

.game {
  grid-area: game;
}

.navbar {
  grid-area: navbar;
}

.contact {
  grid-area: contact;
}
</style>
