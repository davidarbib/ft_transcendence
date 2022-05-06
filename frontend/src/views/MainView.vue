<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/Contact.vue";
import Title from "@/components/Title.vue";
</script>

<template>
  <div class="main-section">
    <div class="game">
      <div id="title"><Title /></div>
      <div class="secondary-button" id="b1">Quick game</div>
      <div class="secondary-button" id="b2">Custom</div>
    </div>
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
  background-image: url("@/assets/sphere_mini.png");
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  grid-template-columns: 1fr 40% 1fr;
  grid-template-rows: 48% repeat(2, 9.9%) 1fr;

  #title {
    grid-area: 1 / 2 / 2 / 3;
    margin-top: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #b1 {
    grid-area: 2 / 2 / 3 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: auto;
  }

  #b2 {
    grid-area: 3 / 2 / 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: auto;
  }
}

.navbar {
  grid-area: navbar;
}

.contact {
  grid-area: contact;
}
</style>
