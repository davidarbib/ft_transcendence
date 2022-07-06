<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
let canvasRef = ref<HTMLCanvasElement | null>(null);
let width = ref<number>((window.innerWidth * 80) / 100);
let height = ref<number>((window.innerHeight * 80) / 100);
let ratioX = ref<number>(width.value / 100);
let ratioY = ref<number>(height.value / 100);
let ballPosX = ref<number>((width.value / 2 - 10) * ratioX.value);
let ballPosY = ref<number>((height.value / 2 - 10) * ratioY.value);
let padAx = ref<number>(30 * ratioX.value);
let padAy = ref<number>((height.value / 2 - 30) * ratioY.value);
let padBx = ref<number>((width.value - 40) * ratioX.value);
let padBy = ref<number>((height.value / 2 - 30) * ratioY.value);
let scoreA = ref<number>(0);
let scoreB = ref<number>(0);

function draw_shape(x: number, y: number, width: number, height: number): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, width, height);
}

function draw(): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value?.clearRect(0, 0, width.value, height.value);
  draw_shape(ballPosX.value, ballPosY.value, 20, 20);
  draw_shape(padAx.value, padAy.value, 10, 60);
  draw_shape(padBx.value, padBy.value, 10, 60);
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_shape(width.value / 2, middle_line_height, 10, 10);
  }
}

//const init_field = () => {
// width.value = (window.innerWidth * 80) / 100;
//  height.value = (window.innerHeight * 80) / 100;
// draw(); need socket to work
//};

userStore.gameSocket.on("gameState", (gameStatePayload) => {
  padAy.value = gameStatePayload.playerOneY * ratioY.value;
  padAy.value = gameStatePayload.playerTwoY * ratioY.value;
  ballPosX.value = gameStatePayload.ballX * ratioX.value;
  ballPosY.value = gameStatePayload.ballY * ratioY.value;
  draw();
});

onMounted(() => {
  // userStore.gameSocket.on("gameBegin", { gameId, playerId });
  //window.addEventListener("resize", init_field);
  window.addEventListener("keyup", () => {
    userStore.gameSocket.emit("padUp", {
      gameId: userStore.gameInfos.gameId,
      playerId: userStore.gameInfos.playerId,
    });
  });
  window.addEventListener("keydown", () => {
    userStore.gameSocket.emit("padDown", {
      gameId: userStore.gameInfos.gameId,
      playerId: userStore.gameInfos.playerId,
    });
  });
  draw();
});
</script>

<template>
  <h1 class="text-8xl tracking-widest text-white my-42">
    {{ scoreA + ":" + scoreB }}
  </h1>
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
