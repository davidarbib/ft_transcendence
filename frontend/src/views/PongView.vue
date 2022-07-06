<script setup lang="ts">
import BlockGame from "@/components/BlockGameComponent.vue";
import { useUserStore } from "@/stores/auth";
import { onMounted } from "vue";
import MusicLoop from "@/components/MusicLoopComponent.vue";

const userStore = useUserStore();

onMounted(() => {
  userStore.gameSocket.emit("canvasReady", userStore.gameInfos);
});
console.log(userStore.gameMode);
</script>

<template>
  <div class="sound"><MusicLoop :music="userStore.gameMode" /></div>
  <div class="flex flex-col items-center min-h-screen">
    <BlockGame />
  </div>
</template>

<style scoped lang="scss">
.sound {
  position: absolute;
  top: 0;
  right: 1rem;
}
</style>
