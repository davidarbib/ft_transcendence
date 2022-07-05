<script setup lang="ts">
import BlockGame from "@/components/BlockGameComponent.vue";
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const gameInfos = ref({
  gameId: "",
  playerId: "",
  isP1: false,
});

userStore.gameSocket.on("gameReady", function (game) {
  gameInfos.value.gameId = game.gameId;
  gameInfos.value.playerId = game.playerId;
  gameInfos.value.isP1 = game.isP1;
});

onMounted(() => {
  userStore.gameSocket.emit("canvasReady", gameInfos.value);
});
</script>

<template>
  <div class="flex items-center min-h-screen">
    <BlockGame />
  </div>
</template>
