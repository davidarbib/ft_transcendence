<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <button @click="open = true" class="secondary-button text-left mx-1">
    <slot />
  </button>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div class="modal-inner">
        <slot />
        <div class="input">
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            class="w-full h-1/2 rounded-t-md focus:outline-none border border-gray-300"
            placeholder="Email address"
          />
          <br />
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            class="w-full h-1/2 rounded-b-md focus:outline-none border border-gray-300"
            placeholder="Password"
          />
        </div>
        <button @click="open = false" class="primary-button"><slot /></button>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-inner {
    background: #d9d9d9;
    margin-right: 20%;
    padding: 20rem;
    border-radius: 0.375rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
