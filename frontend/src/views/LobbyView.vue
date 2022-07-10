<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/auth";

const router = useRouter();
const userStore = useUserStore();

userStore.gameSocket.on("gameReady", function (game) {
  console.log("game is ready");
  userStore.gameInfos.gameId = game.gameId;
  userStore.gameInfos.playerId = game.playerId;
  userStore.gameInfos.isP1 = game.isP1;
  router.push("pong");
});

const cancelLobby = () => {
  console.log("try to cancel lobby");
  userStore.gameSocket.emit("cancelInvite", { userId: userStore.user.id });
};
</script>

<template>
  <div class="lobby-content">
    <div class="loader"></div>
    <router-link @click="cancelLobby" class="primary-button" to="/main"
      >Cancel game</router-link
    >
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;

.lobby-content {
  display: grid;
  place-items: center;
  min-height: 100vh;

  a {
    font-size: 5rem;
  }
}

.loader {
  border: 32px solid #f3f3f3; /* Light grey */
  border-top: 32px solid #e63380;
  border-radius: 50%;
  width: 420px;
  height: 420px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
