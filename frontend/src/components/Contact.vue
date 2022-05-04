<script setup lang="ts">
import json from "@/assets/dataTest.json";
import { ref, computed } from "vue";

json.sort((user) => {
  return user.status ? -1 : 1;
});

const searched = ref("");
const friendMenu = ref(false);
const friendSelected = ref(-1);
const userFriends = computed(() =>
  json.filter((friend) =>
    friend.pseudo.toLowerCase().includes(searched.value.toLowerCase())
  )
);

function toggleFriendMenu(id: number) {
  friendSelected.value = id;
  friendMenu.value = !friendMenu.value;
}
</script>

<template>
  <div class="contact-section">
    <input placeholder="search" class="searchbar" v-model="searched" />
    <div
      class="user-card"
      v-for="user in userFriends"
      :key="user.id"
      @click="toggleFriendMenu(user.id)"
    >
      <div class="user-icon">
        <img src="@/assets/sphere.png" alt="" class="h-10 w-10" />
        <p><i class="fa-solid fa-circle status-dot"></i></p>
      </div>
      <div class="user-pseudo">
        <p>{{ user.pseudo }}</p>
        <p>online</p>
      </div>
      <!-- <div v-if="friendMenu && friendSelected === user.id">
        <ul>
          <li>chat</li>
          <li>profil de {{ user.pseudo }}</li>
          <li>invite</li>
          <li>block</li>
          <li>spectate</li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-section {
  max-height: 92vh;
  overflow: scroll;

  .user-card {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-template-rows: 10% 1fr;
  }
  .searchbar {
    width: 100%;
  }
  .status-dot {
    position: relative;
    top: -1.3rem;
    right: -1.8rem;
    color: blue;
  }

  .user-icon {
    // background-color: aqua;
    grid-area: 2 / 1 / 3 / 2;
  }

  .user-pseudo {
    // background-color: orange;
    grid-area: 2 / 2 / 3 / 3;
  }
}
</style>
