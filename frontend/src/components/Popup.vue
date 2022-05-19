<script setup lang="ts">
const props = defineProps({
  togglePopup: Function,
});

function test() {
  console.log("prout");
}
</script>

<template>
  <div class="popup">
    <div class="popup-inner">
      <slot />
      <button class="popup-close" @click="test">Cancel</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  justify-content: center;
  align-items: center;

  .popup-inner {
    background: #fff;
    padding: 5rem;
  }
}
</style>
