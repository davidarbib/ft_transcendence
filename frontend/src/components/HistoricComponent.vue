<script setup lang="ts">
import historic from "@/assets/data_hist.json";
</script>

<template>
  <div class="overflow-scroll h-[92vh]">
    <div
      class="text-white flex flex-row flex-nowrap justify-around items-center rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="match in historic"
      :key="match.id"
    >
      <div class="match-result">
        <h2 class="text-green-600 leading-4">Victory</h2>
        <p>vs ia</p>
      </div>
      <div class="text-lg tracking-wider">
        <p>10/8</p>
      </div>
      <div>
        <h3>Custom</h3>
        <p>{{ match.date_time }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.match-card {
  color: rgba(255, 255, 255, 0.706);
}
</style>
