<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false)
</script>

<template>
  <button @click="open = true" class="secondary-button text-left mx-1"><slot/></button>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <slot/>
      <button @click="open = false"><slot/></button>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
