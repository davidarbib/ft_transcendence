<template>
  <div class="game-section">
    <canvas
      tabindex="0"
      @keyup.arrow-up="upPad"
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

let canvaRef = ref<HTMLCanvasElement | null>(null);
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

function draw_shapito(
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const ctx = ref(canvaRef.value?.getContext("2d"));
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
  const ctx = ref(canvaRef.value?.getContext("2d"));
  move_ball();
  ctx.value?.clearRect(0, 0, width.value, height.value);
  draw_shapito(ballPosX.value, ballPosY.value, 20, 20); // draw ball
  draw_shapito(padAx.value, padAy.value, 10, 60); // draw padA
  draw_shapito(padBx.value, padBy.value, 10, 60); // draw padB
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_shapito(width.value / 2, middle_line_height, 10, 10);
  }

  timestamp = Date.now();
  requestAnimationFrame(draw);
}

function upPad(): void {
  padAy.value += 50;
  draw();
}

function downPad(): void {
  alert("ENTER OK");
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
