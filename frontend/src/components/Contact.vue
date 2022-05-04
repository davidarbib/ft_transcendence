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
    <input placeholder="search" class="" v-model="searched" />
    <div
      v-for="user in userFriends"
      :key="user.id"
      @click="toggleFriendMenu(user.id)"
    >
      <div>
        <img src="@/assets/sphere.png" alt="" />
        <p><i class="fa-solid fa-circle"></i></p>
        <h3>
          <span> {{ user.pseudo }} </span> <br />
          <span>online</span>
        </h3>
      </div>
      <div v-if="friendMenu && friendSelected === user.id">
        <ul>
          <li>chat</li>
          <li>profil de {{ user.pseudo }}</li>
          <li>invite</li>
          <li>block</li>
          <li>spectate</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-section {
  display: grid;
  grid-template: 1fr / 10% 90%;
  max-height: 100%;
  overflow: scroll;
}
</style>
