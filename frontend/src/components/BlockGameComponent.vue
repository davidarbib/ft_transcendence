<template>
  <div class="game-section">
    <canvas
      tabindex="0"
      id="pong"
      ref="canvasRef"
      :width="width"
      :height="height"
      style="background-color: black"
    >
    </canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

let canvasRef = ref<HTMLCanvasElement | null>(null);
let width = ref(500);
let height = ref(500);
let ballPosX = ref(width.value / 2 - 10);
let ballPosY = ref(height.value / 2 - 10);
let timestamp = Date.now();
let dir = ref(4);
let padAx = ref(30);
let padAy = ref(height.value / 2 - 30);
let padBx = ref(width.value - 40);
let padBy = ref(height.value / 2 - 30);

function draw_shape(x: number, y: number, width: number, height: number): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, width, height);
}

function move_ball(): void {
  ballPosY.value += dir.value;
  ballPosX.value += dir.value;
}

function draw(): number | undefined {
  if (ballPosX.value > padBx.value) dir.value = -10;
  if (ballPosX.value < padAx.value) dir.value = 10;
  if (Date.now() < timestamp + 60) return requestAnimationFrame(draw);
  const ctx = ref(canvasRef.value?.getContext("2d"));
  move_ball();
  ctx.value?.clearRect(0, 0, width.value, height.value);
  draw_shape(ballPosX.value, ballPosY.value, 20, 20); // draw ball
  draw_shape(padAx.value, padAy.value, 10, 60); // draw padA
  draw_shape(padBx.value, padBy.value, 10, 60); // draw padB
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_shape(width.value / 2, middle_line_height, 10, 10);
  }

  timestamp = Date.now();
  requestAnimationFrame(draw);
}

onMounted(() => {
  draw();
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
