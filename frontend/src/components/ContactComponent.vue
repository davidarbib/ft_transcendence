<script setup lang="ts">
import json from "@/assets/dataTest.json";
import { ref, computed } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";
import { ConstantTypes } from "@vue/compiler-core";

const userStore = useUserStore();
const friend = ref([]);
const user = ref([]);
/*
const allfriend = computed(() => {
  axios.defaults.withCredentials = true;
  const addr = 'http://localhost:8090/contacts/m3L_dis/friend';
  axios
    .get(addr, {login : userStore.user.login})
    .then((response) => {
      friend.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return friend.value
});*/
/*
const  alluser = computed (() => {
  axios.defaults.withCredentials = true;
  axios
    .get("http://localhost:8090/users")
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return user.value
});
*/
const searched = ref("");
const friendMenu = ref(false);
const friendSelected = ref(-1);
/*const userFriends = computed(() =>{
  
    allfriend();
  //test.filter((friend) =>
   // friend.pseudo.toLowerCase().includes(searched.value.toLowerCase())
});*/

function toggleFriendMenu(id: number) {
  friendSelected.value = id;
  friendMenu.value = !friendMenu.value;
}
</script>

<template>
  <div class="contact-section">
    <input placeholder="search" class="rounded searchbar" v-model="searched" />
    <br />
    <br />
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="user in allfriend"
      :key="user.id"
      @click="toggleFriendMenu(user.id)"
    >
      {{ user.login }}
      <div></div>
      <div class="user-icon">
        <img src="@/assets/sphere.png" alt="" class="h-10 w-10" />
        <p v-if="user.status" class="online">
          <i class="fa-solid fa-circle status-dot outline-inherit"></i>
        </p>
        <p v-else class="offline">
          <i class="fa-solid fa-circle status-dot outline-inherit"></i>
        </p>
      </div>
      <div class="user-pseudo py-2">
        <p>{{ user.pseudo }}</p>
        <p v-if="user.status" class="online">online</p>
        <p v-else class="offline">offline</p>
        <Transition name="slide-fade">
          <div v-if="friendMenu && friendSelected === user.id">
            <ul class="list">
              <li><router-link to="/chat">chat</router-link></li>
              <li>
                <router-link :to="'/profile/' + user.pseudo"
                  >profile</router-link
                >
              </li>
              <li><router-link to="/">invite</router-link></li>
              <li><router-link to="/">block</router-link></li>
              <li><router-link to="/">spectate</router-link></li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.contact-section {
  background: rgba($color: #000000, $alpha: 0.1);
  height: 92vh;
  overflow: scroll;

  .list {
    list-style: inside;

    li:hover {
      color: white;
    }
  }

  .user-card {
    cursor: pointer;
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-template-rows: 10% 1fr;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
    .user-icon {
      padding-top: 1rem;
      padding-left: 0.4rem;
      grid-area: 2 / 1 / 3 / 2;
      .status-dot {
        position: relative;
        top: -1.3rem;
        right: -1.8rem;
      }
    }
    .user-pseudo {
      color: v.$primary;
      padding-left: 0.5rem;
      // background-color: orange;
      grid-area: 2 / 2 / 3 / 3;
    }

    .online {
      color: green;
    }

    .offline {
      color: gray;
    }
  }

  .slide-fade-enter-active {
    transition: all 0.3s ease-out;
  }

  .slide-fade-leave-active {
    transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

  .searchbar {
    position: fixed;
    z-index: 3;
    padding-left: 1rem;
    height: 3rem;
    width: 100%;
  }
}
</style>
