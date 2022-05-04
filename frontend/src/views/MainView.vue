<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/Contact.vue";
</script>

<template>
  <div class="main-section">
    <div class="game">SUCE</div>
    <div class="navbar"><NavbarItem /></div>
    <div class="contact"><Contact /></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;
.main-section {
  display: grid;
  grid-template-columns: 80% 20%;
  grid-template-rows: 10% 90%;
  gap: 0% 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "navbar navbar"
    "game contact";
}

.game {
  grid-area: game;
  background-color: crimson;
}

.navbar {
  grid-area: navbar;
  // background-color: darkcyan;
}

.contact {
  grid-area: contact;
  background-color: dimgrey;
}
</style>
