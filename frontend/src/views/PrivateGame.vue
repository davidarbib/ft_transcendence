<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/auth";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  userStore.gameSocket.emit("acceptInvite", {
    userId: userStore.user.id,
    inviteId: router.currentRoute.value.params.inviteId,
  });
});

userStore.gameSocket.on("inviteImpossible", () => {
  router.push("main");
});

userStore.gameSocket.on("inviteNotFound", () => {
  router.push("main");
});

userStore.gameSocket.on("gameReady", function (game) {
  console.log("game is ready");
  userStore.gameInfos.gameId = game.gameId;
  userStore.gameInfos.playerId = game.playerId;
  userStore.gameInfos.isP1 = game.isP1;
  router.push("pong");
});
</script>

<template>
  <h1>Invitation accepted</h1>
</template>

<style scoped></style>
