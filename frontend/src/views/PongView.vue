<script setup lang="ts">
import BlockGame from "@/components/BlockGameComponent.vue";
import { useUserStore } from "@/stores/auth";
import { onMounted } from "vue";

const userStore = useUserStore();

onMounted(() => {
  userStore.gameSocket.emit("canvasReady", userStore.gameInfos);
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen">
    <BlockGame />
  </div>
</template>
