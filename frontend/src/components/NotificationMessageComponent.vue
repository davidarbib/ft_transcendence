<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  type: String,
  header: String,
});

const hidden = ref(false);
</script>

<template>
  <div class="message rounded-md" :class="props.type" v-if="!hidden">
    <div class="cross" @click="hidden = !hidden">
      <i class="fa-solid fa-xmark"></i>
    </div>
    <div class="content">
      <div class="header">
        {{ props.header }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.message {
  width: 20%;
  z-index: 100;
  position: absolute;
  top: 3rem;
  right: 1rem;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  padding: 1rem;
  .cross {
    cursor: pointer;
  }
}

.success-2fa {
  color: rgb(25, 130, 53);
  background-color: rgb(114, 224, 144);
  .header {
    font-weight: bold;
  }
}

.error-2fa {
  color: rgb(148, 4, 19);
  background-color: rgb(204, 82, 94);
  .header {
    font-weight: bold;
  }
}
</style>
