<script setup lang="ts">
import { ref, onMounted } from "vue";
// import { useUserStore } from "@/stores/auth";

// const userStore = useUserStore();
let canvasRef = ref<HTMLCanvasElement | null>(null);
let width = ref<number>((window.innerWidth * 80) / 100);
let height = ref<number>((window.innerHeight * 80) / 100);
let ballPosX = ref<number>(width.value / 2 - 10);
let ballPosY = ref<number>(height.value / 2 - 10);
let padAx = ref<number>(30);
let padAy = ref<number>(height.value / 2 - 30);
let padBx = ref<number>(width.value - 40);
let padBy = ref<number>(height.value / 2 - 30);

function draw_shape(x: number, y: number, width: number, height: number): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, width, height);
}

function draw(): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
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
}

const init_field = () => {
  width.value = (window.innerWidth * 80) / 100;
  height.value = (window.innerHeight * 80) / 100;
  // draw(); need socket to work
};

onMounted(() => {
  // userStore.gameSocket.on("gameBegin", { gameId, playerId });
  window.addEventListener("resize", init_field);
  draw();
});
</script>

<template>
  <div class="w-full text-center">
    <canvas
      tabindex="0"
      class="inline"
      ref="canvasRef"
      :width="width"
      :height="height"
      style="background-color: black"
    >
    </canvas>
  </div>
</template>
