<script setup lang="ts">
import BlockGame from "@/components/BlockGameComponent.vue";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();

onMounted(() => {
  userStore.gameSocket.emit("canvasReady");
});
</script>

<template>
  <div class="flex items-center min-h-screen">
    <BlockGame />
  </div>
</template>
