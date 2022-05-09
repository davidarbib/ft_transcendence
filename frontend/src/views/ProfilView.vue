<script setup lang="ts">
import { LockClosedIcon } from "@heroicons/vue/solid";
import NavbarItem from "@/components/NavbarItem.vue";
</script>

<template>
  <div class="profil-section">
    <div class="navbar">
      <NavbarItem />
    </div>
    <div class="profil-card">
      <div class="secondary-button">
        <router-link to="/"> Edit profil image </router-link>
      </div>
      <div class="profil-picture">
        <img src="@/assets/sphere_mini.png" alt="user profil picture" />
      </div>
      <div class="secondary-button">
        <router-link to="/"> Historic </router-link>
      </div>
      <div class="stats">
        <ul>
          <li>
            <p class="games-nb">23</p>
            <p class="games">Games</p>
          </li>
          <li>
            <p class="wins-nb">12</p>
            <p class="wins">Win</p>
          </li>
          <li>
            <p class="looses-nb">11</p>
            <p class="looses">Looses</p>
          </li>
        </ul>
      </div>
      <div class="user-infos">
        <input
          id="email-address"
          name="email"
          type="email"
          autocomplete="email"
          required="true"
          class="w-full h-1/4 rounded-t-md focus:outline-none border border-gray-300"
          placeholder="Email address"
        />
        <input
          id="pseudo"
          name="pseudo"
          type="text"
          autocomplete="current-password"
          required="true"
          class="w-full h-1/4 focus:outline-none border border-gray-300"
          placeholder="Pseudo"
        />
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required="true"
          class="w-full h-1/4 focus:outline-none border border-gray-300"
          placeholder="Password"
        />
      </div>
      <div class="update-user-infos primary-button">
        <router-link to="/profil" class="b-submit"> Save changes </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.profil-section {
  height: 91vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: 10% 10% 1fr;

  .navbar {
    grid-column: 1/4;
    grid-row-start: 1;
  }

  .profil-card {
    grid-column-start: 2;
    grid-row: 2/4;
  }

  div {
    background-color: coral;
    border: 2px solid brown;
  }
}
</style>
