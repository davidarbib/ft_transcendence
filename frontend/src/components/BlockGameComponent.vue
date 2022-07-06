<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/auth";
import ConfettiExplosion from "vue-confetti-explosion";

const userStore = useUserStore();
let canvasRef = ref<HTMLCanvasElement | null>(null);
let width = ref<number>((window.innerWidth * 80) / 100);
let height = ref<number>((window.innerHeight * 80) / 100);
let ratioX = ref<number>(width.value / 100);
let ratioY = ref<number>(height.value / 100);
let ballPosX = ref<number>(50 * ratioX.value);
let ballPosY = ref<number>(50 * ratioY.value);
let padAx = ref<number>(30);
let padAy = ref<number>((50 + 30) * ratioY.value);
let padBx = ref<number>(width.value - 40);
let padBy = ref<number>((50 + 30) * ratioY.value);
let scoreA = ref<number>(0);
let scoreB = ref<number>(0);
let playerWin = ref<boolean>(false);
let gameEnded = ref<boolean>(false);

function draw_shape(x: number, y: number, width: number, height: number): void {
  const ctx = ref(canvasRef.value?.getContext("2d"));
  ctx.value!.fillStyle = "#FFFFFF";
  ctx.value?.fillRect(x, y, width, height);
}

function draw(): void {
  //width.value = (window.innerWidth * 80) / 100;
  //height.value = (window.innerHeight * 80) / 100;
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

userStore.gameSocket.on("gameState", (gameStatePayload) => {
  padAy.value = gameStatePayload.playerOneY * ratioY.value;
  padAy.value = gameStatePayload.playerTwoY * ratioY.value;
  ballPosX.value = gameStatePayload.ballX * ratioX.value;
  ballPosY.value = gameStatePayload.ballY * ratioY.value;
  draw();
});

userStore.gameSocket.on("score", (scorePayload) => {
  if (scorePayload === true) scoreA.value++;
  else scoreB.value++;
});

userStore.gameSocket.on("endGame", (endGamePayload) => {
  if (
    (endGamePayload.didPlayerOneWin && userStore.gameInfos.isP1) ||
    (!endGamePayload.didPlayerOneWin && !userStore.gameInfos.isP1)
  )
    playerWin.value = true;
  gameEnded.value = true;
});

onMounted(() => {
  window.addEventListener("keydown", (e) => {
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
        <h1 v-if="playerWin" class="text-white">Victory !</h1>
        <h1 v-else class="text-white">Defeat !</h1>
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
      ref="canvasRef"
      :width="width"
      :height="height"
      style="background-color: black"
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
