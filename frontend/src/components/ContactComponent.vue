<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { apiStore } from "@/stores/api";
import ListUserComponent from "@/components/ListUserComponent.vue";
import { useUserStore } from "@/stores/auth";

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
const userStore = useUserStore();
const friends = ref<User[]>([]);
let users = ref<User[]>([]);

onUnmounted(() => {
  userStore.statusSocket.removeAllListeners();
})

userStore.statusSocket.on("switchStatus", (payload) => {
  console.log(`switch status : ${payload.status}`);
  let index_users = users.value.findIndex((e) => e.id === payload.userId);
  if (index_users !== -1) {
    users.value[index_users].status = payload.status;
  }
  let index_friend = friends.value.findIndex((e) => e.id === payload.userId);
  if (index_friend !== -1) {
    friends.value[index_friend].status = payload.status;
  }
});

onMounted(() => {
  axios.defaults.withCredentials = true;
  axios
    .get(`${api.url}/users`)
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    if (userStore.user.login)
    {
  axios
    .get(`${api.url}/contacts/${userStore.user.login}/friend`)
    .then((response) => {
      friends.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    }
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
