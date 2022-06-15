<script setup lang="ts">
import historic from "@/assets/data_hist.json";
</script>

<template>
  <div class="historic-section">
    <div
      class="match-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="match in historic"
      :key="match.id"
    >
      <div class="match-result">
        <h2>Victory</h2>
        <p>vs ia</p>
      </div>
      <div class="match-score">
        <p>10/8</p>
      </div>
      <div class="match-infos">
        <h3>Custom</h3>
        <p>{{ match.date_time }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.historic-section {
  overflow: scroll;
  height: 92vh;
}
.match-card {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  color: rgba(255, 255, 255, 0.706);

  .match-result {
    h2 {
      color: green;
      line-height: 1rem;
    }
  }

  .match-score {
    font-size: 1.2rem;
    letter-spacing: 0.5rem;
  }
}
</style>
