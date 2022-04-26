<script>
import { LockClosedIcon } from "@heroicons/vue/solid";
import NavbarItem from '../components/NavbarItem.vue';

export default {
  components: {
    LockClosedIcon,
    NavbarItem,
  },
};
</script>

<template>
  <div class="navbar">
    <navbar-item></navbar-item>
  </div>
</template>

<style>
  .navbar {
    min-height: 100vh;
    align-items: top;
  }
</style>
