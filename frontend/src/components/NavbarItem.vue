<script setup lang="ts">
import { ref } from "vue";

const visible = ref(true);

const visibleToggle = () => {
  visible.value = !visible.value;
};
</script>

<template>
  <div class="mx-auto px-4 bg-black bg-opacity-10">
    <div class="flex justify-between">
      <div class="flex space-x-7">
        <div>
          <!-- Website Logo -->
          <router-link to="/main" class="flex items-center py-0 px-2">
            <img src="@/assets/logo.png" alt="Logo" class="h-14 w-28 mr-2" />
          </router-link>
        </div>
        <!-- Primary Navbar items -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            to="/chat"
            class="py-4 px-2 text-gray-300 font-semibold hover:text-[#e63380] transition duration-700"
            >Chat</router-link
          >
          <router-link
            to="/tuto"
            class="py-4 px-2 text-gray-300 font-semibold hover:text-[#e63380] transition duration-700"
            >Tutorial</router-link
          >
          <router-link
            to="/profil"
            class="py-4 px-2 text-gray-300 font-semibold hover:text-[#e63380] transition duration-700"
            >Profil</router-link
          >
        </div>
      </div>
      <!-- Secondary Navbar items -->
      <div class="hidden md:flex items-center space-x-3">
        <router-link
          to="/"
          class="py-2 px-2 font-medium text-gray-300 rounded hover:bg-red-700 transition duration-700"
          >Disconnect</router-link
        >
      </div>
      <!-- Mobile menu button -->
      <div class="md:hidden flex items-center">
        <button class="outline-none mobile-menu-button" @click="visibleToggle">
          <svg
            class="w-6 h-6 text-gray-500 hover:text-[#e63380]"
            x-show="!showMenu"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!-- mobile menu -->
  <div class="mobile-menu" :class="{ hidden: visible }">
    <ul class="">
      <li>
        <router-link
          to="/chat"
          class="block text-sm px-2 py-4 text-gray-300 hover:bg-[#e63380] transition duration-700"
          >Chat</router-link
        >
      </li>
      <li>
        <router-link
          to="/stats"
          class="block text-sm px-2 py-4 text-gray-300 hover:bg-[#e63380] transition duration-700"
          >Stats</router-link
        >
      </li>
      <li>
        <router-link
          to="/tuto"
          class="block text-sm px-2 py-4 text-gray-300 hover:bg-[#e63380] transition duration-700"
          >Tutorial</router-link
        >
      </li>
      <li>
        <router-link
          to="/profil"
          class="block text-sm px-2 py-4 text-gray-300 hover:bg-[#e63380] transition duration-700"
          >Profil</router-link
        >
      </li>
    </ul>
  </div>
</template>
