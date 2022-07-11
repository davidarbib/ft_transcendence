<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { apiStore } from "@/stores/api";
import ListUserComponent from "@/components/ListUserComponent.vue";

interface User {
  id: string;
  login: string;
  username: string;
  status: string;
  authToken: string | null;
  doubleFa: boolean;
  avatarRef: string | null;
  winCount: string;
  lossCount: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string | null;
}

const api = apiStore();
const friends = ref<User[]>([]);
let users = ref<User[]>([]);

onMounted(() => {
  axios
    .get(`${api.url}/users`)
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  axios
    .get(`${api.url}/contacts`)
    .then((response) => {
      friends.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template>
  <div class="contact-section">
    <list-user-component :users="users" />
    <div class="sep"></div>
    <list-user-component :users="friends" />
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.contact-section {
  background: rgba($color: #000000, $alpha: 0.1);
  height: 92vh;
  overflow: scroll;

  .sep {
    border-bottom: 10px solid v.$primary;
  }
}
</style>
