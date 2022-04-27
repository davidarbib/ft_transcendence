<script setup lang="ts">
  import { ref } from "vue";

  const visible = ref(true);

  const visibleToggle = () => { visible.value = !visible.value }
</script>

<template>
  <div class="mx-auto px-4 bg-black bg-opacity-10">
    <div class="flex justify-between">
      <div class="flex space-x-7">
        <div>
          <!-- Website Logo -->
          <a class="flex items-center py-0 px-2">
            <img src="@/assets/logo.png" alt="Logo" class="h-14 w-28 mr-2" />
          </a>
        </div>
        <!-- Primary Navbar items -->
        <div class="hidden md:flex items-center space-x-1">
          <a
            class="
              py-4
              px-2
              text-gray-300
              font-semibold
              hover:text-[#e63380]
              transition
              duration-300
            ">Chat</a>
          <a
            class="
              py-4
              px-2
              text-gray-300
              font-semibold
              hover:text-[#e63380]
              transition
              duration-300
            "
            >Stats</a>
          <a
            class="
              py-4
              px-2
              text-gray-300
              font-semibold
              hover:text-[#e63380]
              transition
              duration-300
            "
            >Tutorial</a>
          <a
            class="
              py-4
              px-2
              text-gray-300
              font-semibold
              hover:text-[#e63380]
              transition
              duration-300
            "
            >Profil</a>
        </div>
      </div>
      <!-- Secondary Navbar items -->
      <div class="hidden md:flex items-center space-x-3">
        <a
          class="
            py-2
            px-2
            font-medium
            text-gray-300
            rounded
            hover:bg-[#e63380]
            transition
            duration-300
          "
          >Disconnect</a
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
      <li class="active">
        <a
          href="index.html"
          class="block text-sm px-2 py-4 text-white bg-green-500 font-semibold"
          >Home</a
        >
      </li>
      <li>
        <a
          href="#services"
          class="
            block
            text-sm
            px-2
            py-4
            hover:bg-green-500
            transition
            duration-300
          "
          >Services</a
        >
      </li>
      <li>
        <a
          href="#about"
          class="
            block
            text-sm
            px-2
            py-4
            hover:bg-green-500
            transition
            duration-300
          "
          >About</a
        >
      </li>
      <li>
        <a
          href="#contact"
          class="
            block
            text-sm
            px-2
            py-4
            hover:bg-green-500
            transition
            duration-300
          "
          >Contact Us</a
        >
      </li>
    </ul>
  </div>
</template>