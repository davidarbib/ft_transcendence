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
  console.log("InviteImpossible");
  router.push({ path: "/main" });
});

userStore.gameSocket.on("inviteNotFound", () => {
  console.log("InviteNotFound");
  router.push({ path: "/main" });
});

userStore.gameSocket.on("gameReady", function (game) {
  console.log("game is ready");
  userStore.gameInfos.gameId = game.gameId;
  userStore.gameInfos.playerId = game.playerId;
  userStore.gameInfos.isP1 = game.isP1;
  userStore.gameInfos.playerOneName = game.playerOneName;
  userStore.gameInfos.playerTwoName = game.playerTwoName;
  router.push({ path: "/pong" });
});
</script>

<template>
  <h1>Invitation accepted</h1>
</template>
