<template>
  <div class="game-section">
    <canvas
      id="pong"
      ref="canvaRef"
      :width="width"
      :height="height"
      style="background-color: black"
    >
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { faDrawPolygon } from "@fortawesome/free-solid-svg-icons";
import { ref, onMounted } from "vue";

const canvaRef = ref<HTMLCanvasElement | null>(null);
const width = ref(700);
const height = ref(700);

function draw_paddle(x: number, y: number): void {
  const ctx = ref(canvaRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, 20, 60);
}

function draw_ball(x: number, y: number): void {
  const ctx = ref(canvaRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, 20, 20);
}

function draw_middle_line(x: number, y: number) {
  const ctx = ref(canvaRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, 10, 10);
}

onMounted(() => {
  draw_paddle(10, height.value / 2);
  draw_paddle(width.value - 30, height.value / 2);
  draw_ball(width.value / 1.6, height.value / 2);
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_middle_line(width.value / 2, middle_line_height);
  }
});
</script>

<style scoped lang="scss">
.game-section {
  width: 100%;
  text-align: center;

  #pong {
    display: inline;
  }
}
</style>
