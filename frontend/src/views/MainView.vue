<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "@/components/Contact.vue";
</script>

<template>
  <div class="main max-h-full max-w-full">
  <NavbarItem/>
  <div class="main-content w-screen">
    <div class="ball-shape w-4/5">
      <h1>Play</h1>
      <p><a href="#">1 Player</a></p>
      <p><a href="#">2 Players</a></p>
    </div>
    <Contact/>
  </div>
  </div>
    
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;
.main {
  position: fixed;
}

.main-content {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  .ball-shape {
    text-align: center;
    background-image: url('@/assets/sphere_mini.png');
    height: 500px;
    width: 500px;
    margin: auto;
    margin-top: 5rem;

    h1 {
      font-family: Kallisto-bold, sans-serif;
      font-style: normal;
      font-weight: 800;
      color: v.$secondary;
      font-size: v.$primary-title;
      padding-top: 4rem;
      text-transform: uppercase;
    }

    p:nth-of-type(1) {
      position: relative;
      top: 2.5rem;
    }
    p:nth-of-type(2)
    {
      position: relative;
      top: 4rem;
    }

    p a {
      font-family: Kallisto-regular, sans-serif;
      font-weight: bold;
      color: v.$primary;
      font-size: v.$secondary-title;
      text-decoration: none;
      transition: 0.3s;
      &:hover {
        opacity: 0.8;
        text-shadow: 0 0.3rem 0.5rem v.$primary-light;
      }
    }
  }
}

</style>
