<script setup lang="ts">
import channels from "@/assets/msg_test.json";
</script>

<template>
  <div class="pub-chan-section">
    <button class="pub-chan-menu secondary-button text-left">
      + Create channel
    </button>
    <h1>Public channels :</h1>
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="channel in channels"
      :key="channel.id"
    >
      <div class="user-pseudo py-2">
        <p>{{ channel.name }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.pub-chan-section {
  height: 92vh;
  overflow: scroll;
  margin-right: 1rem;
  color: v.$primary;
  h1 {
    margin-top: 1rem;
    font-size: 2rem;
    color: white;
  }
}
</style>
