<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/auth";

const router = useRouter();
const userStore = useUserStore();

onMounted(() => {
  userStore.gameSocket.emit("acceptInvite", {
    userId: userStore.user.id,
    invitId: router.currentRoute.value.params.inviteId,
  });
});

userStore.gameSocket.on("invitImpossible", () => {
  router.push("main");
});

userStore.gameSocket.on("invitNotFound", () => {
  router.push("main");
});

userStore.gameSocket.on("gameReady", function (game) {
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
