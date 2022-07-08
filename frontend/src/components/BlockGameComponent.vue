<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useUserStore } from "@/stores/auth";
import ConfettiExplosion from "vue-confetti-explosion";

/*
** Backend constants
*/
const WIDTH=100;
const HEIGHT=100;

const PADGAPX=10;
const PADWIDTH=1;
const PADHEIGHT=25;
const P1PADX=PADGAPX;
const P2PADX=WIDTH - PADGAPX;
const PADY=HEIGHT/2;

const BALLSIZE=5;
const BALLINITX=WIDTH/2;
const BALLINITY=HEIGHT/2; 

const BALLDRAWSHIFT=BALLSIZE/2;
const PADXDRAWSHIFT=PADWIDTH/2;
const PADYDRAWSHIFT=PADHEIGHT/2;

const userStore = useUserStore();
let canvasRef = ref<HTMLCanvasElement | null>(null);
let width = ref<number>((window.innerWidth * 80) / 100);
let height = ref<number>((window.innerHeight * 80) / 100);
let ratioX = ref<number>(width.value / WIDTH);
let ratioY = ref<number>(height.value / HEIGHT);
let ballPosX = ref<number>(BALLINITX * ratioX.value);
let ballPosY = ref<number>(BALLINITY * ratioY.value);
let padAx = ref<number>(P1PADX * ratioX.value);
let padAy = ref<number>(PADY * ratioY.value);
let padBx = ref<number>(P2PADX * ratioX.value);
let padBy = ref<number>(PADY * ratioY.value);
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
  const ctx = ref(canvasRef.value?.getContext("2d"));
  if (userStore.gameMode === "monkey") {
    ctx.value!.fillStyle = "#000000";
  } else if (userStore.gameMode === "vice") {
    ctx.value!.fillStyle = "#e63380";
  } else {
    ctx.value!.fillStyle = "#FFFFFF";
  }
  ctx.value?.fillRect(x - width * 0.5, y - height * 0.5, width, height);
}

function draw(): void {
  //console.log(ballPosX.value + ", " + ballPosY.value);
  //console.log(padAy.value + ", " + padAx.value);
  //console.log(padBy.value + ", " + padBx.value);
  width.value = (window.innerWidth * 80) / 100;
  height.value = (window.innerHeight * 80) / 100;
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value?.clearRect(0, 0, width.value, height.value);
  draw_shape(ballPosX.value, ballPosY.value, BALLSIZE, BALLSIZE);
  draw_shape(padAx.value, padAy.value, PADWIDTH, PADHEIGHT);
  draw_shape(padBx.value, padBy.value, PADWIDTH, PADHEIGHT);
  for (
    let middle_line_height = height.value;
    middle_line_height > 0;
    middle_line_height -= 20
  ) {
    draw_shape(width.value / 2, middle_line_height, 10, 10);
  }
}

userStore.gameSocket.on("gameState", (gameStatePayload) => {
  padAy.value = gameStatePayload.playerOneY * ratioY.value;
  padBy.value = gameStatePayload.playerTwoY * ratioY.value;
  ballPosX.value = gameStatePayload.ballX * ratioX.value;
  ballPosY.value = gameStatePayload.ballY * ratioY.value;
  draw();
});

userStore.gameSocket.on("score", (scorePayload: boolean) => {
  if (scorePayload) scoreA.value++;
  else scoreB.value++;
  console.log("score : ");
  console.log(scoreA.value + ", " + scoreB.value);
});

userStore.gameSocket.on("endGame", (endGamePayload) => {
  if (
    (endGamePayload.didPlayerOneWin && userStore.gameInfos.isP1) ||
    (!endGamePayload.didPlayerOneWin && !userStore.gameInfos.isP1)
  )
    playerWin.value = true;
  gameEnded.value = true;
  userStore.gameInfos.gameId = "";
  userStore.gameInfos.playerId = "";
  userStore.gameInfos.isP1 = false;
});

async function handleResize() {
  width.value = (window.innerWidth * 80) / 100;
  height.value = (window.innerHeight * 80) / 100;
  ratioX.value = width.value / 100;
  ratioY.value = height.value / 100;
  ballPosX.value = 50 * ratioX.value;
  ballPosY.value = 50 * ratioY.value;
  padAy.value = (50 + 30) * ratioY.value;
  padBx.value = width.value - 40;
  padBy.value = (50 + 30) * ratioY.value;
  await nextTick();
  draw();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", (e) => {
    console.log("key press");
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
  });
  draw();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="gameEnded" class="modal">
      <div class="modal-inner bg-black bg-opacity-100">
        <h1 v-if="playerWin" class="text-white">Victory</h1>
        <h1 v-else class="text-white">Defeat</h1>
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
      ref="canvasRef"
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
