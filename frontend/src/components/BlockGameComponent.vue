<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useUserStore } from "@/stores/auth";
import ConfettiExplosion from "vue-confetti-explosion";

/*
 ** Backend constants
 */
const WIDTH = 100;
const HEIGHT = 100;

const PAD_GA_PX = 5;
const PAD_WIDTH = 2;
const PAD_HEIGHT = 15;
const P1_PAD_X = PAD_GA_PX;
const P2_PAD_X = WIDTH - PAD_GA_PX;
const PAD_Y = HEIGHT / 2;

const BALL_SIZE = 3;
const BALL_INIT_X = WIDTH / 2;
const BALL_INIT_Y = HEIGHT / 2;

//const MATERIALDRAWER = BALL_SIZE / 2;
//const PAD_X_DRAW_SHIFT = PAD_WIDTH / 2;
//const PAD_Y_DRAW_SHIFT = PAD_HEIGHT / 2;

const userStore = useUserStore();
let canvas = ref<HTMLCanvasElement>();
let context = ref<CanvasRenderingContext2D>();
let size = ref<number>(Math.min(window.innerWidth, window.innerHeight));
let width = ref<number>(size.value * 0.8);
let height = ref<number>(size.value * 0.8);
let ratioX = ref<number>(width.value / WIDTH);
let ratioY = ref<number>(height.value / HEIGHT);
let ballPosX = ref<number>(BALL_INIT_X);
let ballPosY = ref<number>(BALL_INIT_Y);
let padAx = ref<number>(P1_PAD_X);
let padAy = ref<number>(PAD_Y);
let padBx = ref<number>(P2_PAD_X);
let padBy = ref<number>(PAD_Y);
let scoreA = ref<number>(0);
let scoreB = ref<number>(0);
let playerWin = ref<boolean>(false);
let gameEnded = ref<boolean>(false);

//function draw_shape(x: number, y: number, width: number, height: number): void {
//  const ctx = ref(canvasRef.value?.getContext("2d"));
//  if (userStore.gameMode === "monkey") {
//    ctx.value!.fillStyle = "#000000";
//  } else if (userStore.gameMode === "vice") {
//    ctx.value!.fillStyle = "#e63380";
//  } else {
//    ctx.value!.fillStyle = "#FFFFFF";
//  }
//  ctx.value?.fillRect(x, y, width, height);
//}
//
//function draw(): void {
//  //console.log(ballPosX.value + ", " + ballPosY.value);
//  //console.log(padAy.value + ", " + padAx.value);
//  //console.log(padBy.value + ", " + padBx.value);
//  width.value = (window.innerWidth * 80) / 100;
//  height.value = (window.innerHeight * 80) / 100;
//  const ctx = ref(canvasRef.value?.getContext("2d"));
//  ctx.value?.clearRect(0, 0, width.value, height.value);
//  draw_shape(ballPosX.value, ballPosY.value, 20, 20);
//  draw_shape(padAx.value, padAy.value, 10, 60);
//  draw_shape(padBx.value, padBy.value, 10, 60);
//  for (
//    let middle_line_height = height.value;
//    middle_line_height > 0;
//    middle_line_height -= 20
//  ) {
//    draw_shape(width.value / 2, middle_line_height, 10, 10);
//  }
//}

function draw_shape(x: number, y: number, width: number, height: number): void {
  context.value = canvas.value?.getContext("2d") as CanvasRenderingContext2D;
  if (userStore.gameMode === "monkey") {
    context.value.fillStyle = "#000000";
  } else if (userStore.gameMode === "vice") {
    context.value.fillStyle = "#e63380";
  } else {
    context.value.fillStyle = "#FFFFFF";
  }
  context.value?.fillRect(x - width * 0.5, y - height * 0.5, width, height);
}

function draw_shape_ratio(
  x: number,
  y: number,
  width: number,
  height: number
): void {
  context.value = canvas.value?.getContext("2d") as CanvasRenderingContext2D;
  if (userStore.gameMode === "monkey") {
    context.value.fillStyle = "#000000";
  } else if (userStore.gameMode === "vice") {
    context.value.fillStyle = "#e63380";
  } else {
    context.value.fillStyle = "#FFFFFF";
  }
  width *= ratioX.value;
  height *= ratioY.value;
  x *= ratioX.value;
  y *= ratioY.value;
  context.value?.fillRect(x - width * 0.5, y - height * 0.5, width, height);
}

function draw(): void {
  //console.log(ballPosX.value + ", " + ballPosY.value);
  //console.log(padAy.value + ", " + padAx.value);
  //console.log(padBy.value + ", " + padBx.value);
  //width.value = (window.innerWidth * 80) / 100;
  //height.value = (window.innerHeight * 80) / 100;
  //const ctx = ref(canvasRef.value?.getContext("2d"));
  context.value?.clearRect(0, 0, width.value, height.value);
  draw_shape_ratio(ballPosX.value, ballPosY.value, BALL_SIZE, BALL_SIZE);
  draw_shape_ratio(padAx.value, padAy.value, PAD_WIDTH, PAD_HEIGHT);
  draw_shape_ratio(padBx.value, padBy.value, PAD_WIDTH, PAD_HEIGHT);
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_shape(width.value / 2, middle_line_height, 10, 10);
  }
}

userStore.gameSocket.on("gameState", (gameStatePayload) => {
  padAy.value = gameStatePayload.playerOneY;
  padBy.value = gameStatePayload.playerTwoY;
  ballPosX.value = gameStatePayload.ballX;
  ballPosY.value = gameStatePayload.ballY;
  draw();
});

userStore.gameSocket.on("score", (scorePayload: boolean) => {
  if (scorePayload) scoreA.value++;
  else scoreB.value++;
});

userStore.gameSocket.on("endGame", (endGamePayload) => {
  window.removeEventListener("keydown", movePad);
  playerWin.value = !!(
    (endGamePayload.didPlayerOneWin && userStore.gameInfos.isP1) ||
    (!endGamePayload.didPlayerOneWin && !userStore.gameInfos.isP1)
  );
  gameEnded.value = true;
});

async function handleResize() {
  size.value = Math.min(window.innerWidth, window.innerHeight);
  width.value = size.value * 0.8;
  height.value = size.value * 0.8;
  ratioX.value = width.value / WIDTH;
  ratioY.value = height.value / HEIGHT;
  //ballPosX.value = 50 * ratioX.value;
  //ballPosY.value = 50 * ratioY.value;
  //padAy.value = (50 + 30) * ratioY.value;
  //padBx.value = width.value - 40;
  //padBy.value = (50 + 30) * ratioY.value;
  await nextTick();
  draw();
}

const movePad = (e: KeyboardEvent) => {
  if (e.key === "ArrowUp") {
    userStore.gameSocket.emit("padUp", {
      gameId: userStore.gameInfos.gameId,
      playerId: userStore.gameInfos.playerId,
    });
  }
  if (e.key === "ArrowDown") {
    userStore.gameSocket.emit("padDown", {
      gameId: userStore.gameInfos.gameId,
      playerId: userStore.gameInfos.playerId,
    });
  }
};

onMounted(() => {
  gameEnded.value = false;
  playerWin.value = false;
  canvas.value = document.getElementById("canvasRef") as HTMLCanvasElement;
  context.value = canvas.value?.getContext("2d") as CanvasRenderingContext2D;
  context.value?.clearRect(0, 0, width.value, height.value);
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", movePad);
  draw();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="gameEnded" class="modal">
      <div class="modal-inner bg-black bg-opacity-100">
        <h1 v-if="playerWin" class="text-white">Victory</h1>
        <h1 v-else-if="!playerWin" class="text-white">Defeat</h1>
        <router-link to="/main" class="secondary-button">
          Go back home
        </router-link>
      </div>
    </div>
  </Teleport>
  <h1 class="text-8xl tracking-widest text-white my-42">
    {{ scoreA + ":" + scoreB }}
  </h1>
  <div class="w-full text-center">
    <canvas
      tabindex="0"
      class="inline"
      :class="userStore.gameMode"
      id="canvasRef"
      :width="width"
      :height="height"
    >
    </canvas>
    <ConfettiExplosion
      v-if="playerWin"
      :particleCount="642"
      :stageHeight="5000"
      :stageWidth="3700"
      :duration="5000"
    />
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;

.default {
  background-color: black;
}

.vice {
  background: rgba(0, 0, 0, 0.2);
}

.mario {
  background-image: url("@/assets/mario_bg.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}

.monkey {
  background-color: white;
  background-image: url("@/assets/monkey-bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
  display: grid;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 8rem;
    text-align: center;
    text-transform: uppercase;
  }

  .modal-inner {
    background: rgb(237, 237, 237);
    background: linear-gradient(v.$primary, v.$dark-blue) fixed;
    width: 40rem;
    height: 20rem;
    padding: 1rem;
    border-radius: 0.375rem;

    a {
      padding: 1rem 2rem;
      font-size: 2rem;
    }
  }
}
</style>
