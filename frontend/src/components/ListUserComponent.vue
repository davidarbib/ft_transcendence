<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/auth";
import { useRouter } from "vue-router";

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
defineProps<{
  users: User[];
}>();

const router = useRouter();
const userStore = useUserStore();
const friendMenu = ref(false);
const friendSelected = ref<string>("");

function toggleFriendMenu(id: string) {
  friendSelected.value = id;
  friendMenu.value = !friendMenu.value;
}

function startSpectating(id: string) {
  userStore.gameSocket.emit("spectate", { userId: id });
}

userStore.gameSocket.on("gameReady", function (game) {
  userStore.gameInfos.gameId = game.gameId;
  userStore.gameInfos.playerId = game.playerId;
  userStore.gameInfos.isP1 = game.isP1;
  router.push("pong");
});
</script>

<template>
  <div
    class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
    v-for="user in users"
    :key="user.id"
    @click="toggleFriendMenu(user.id)"
  >
    <div class="user-icon">
      <img v-if="!user.avatarRef" src="@/assets/sphere.png" alt="" class="h-10 w-10" />
      <img v-else :src="`http://localhost:8090/${user.avatarRef}`" alt="user profile picture" class="h-10 w-10" />
      <p :class="user.status">
        <i class="fa-solid fa-circle status-dot outline-inherit"></i>
      </p>
    </div>
    <div class="user-pseudo py-2">
      <p>{{ user.username }}</p>
      <p :class="user.status">{{ user.status }}</p>
      <Transition name="slide-fade">
        <div v-if="friendMenu && friendSelected === user.id">
          <ul class="list">
            <li>
              <router-link
                :to="{ name: 'profile', params: { pseudo: user.login } }"
                >profile</router-link
              >
            </li>
            <li v-if="user.status === 'ingame'" @click="startSpectating(user.id)">spectate</li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
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
    grid-area: 2 / 2 / 3 / 3;
  }

  .online {
    color: green;
  }

  .offline {
    color: gray;
  }

  .ingame {
    color: deepskyblue;
  }

  .spectate {
    color: yellow;
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
</style>
