<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Contact from "@/components/ContactComponent.vue";
import Title from "@/components/TitleComponent.vue";
import { ref } from "vue";
import { computed } from "@vue/reactivity";
import { useUserStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const router = useRouter();
let game_mode = ref("default");
let popupTriggers = ref(false);
let elapsedTimeS = ref(0);
let elapsedTimeM = ref(0);
let timer = ref();
const userStore = useUserStore();

const formattedElapsedTime = computed(() => {
  if (elapsedTimeS.value > 59) {
    elapsedTimeS.value = 0;
    elapsedTimeM.value++;
  }
  let second: string;
  let minute: string;
  if (elapsedTimeS.value < 10) second = "0" + elapsedTimeS.value.toString();
  else second = elapsedTimeS.value.toString();
  if (elapsedTimeM.value < 10) minute = "0" + elapsedTimeM.value.toString();
  else minute = elapsedTimeM.value.toString();
  return minute + ":" + second;
});

const TogglePopup = (): void => {
  if (!popupTriggers.value) {
    clearInterval(timer.value);
    elapsedTimeS.value = 0;
    elapsedTimeM.value = 0;
    timer.value = setInterval(() => {
      elapsedTimeS.value += 1;
    }, 1000);
  }
  popupTriggers.value = !popupTriggers.value;
};

const startMatchmaking = () => {
  console.log("Matchmaking starting...");
  TogglePopup();
  userStore.gameSocket.emit("joinMM", {
    user: userStore.user,
    client: userStore.gameSocket,
  });
};

const leaveMatchmaking = () => {
  console.log("Leaving MatchMaking...");
  TogglePopup();
  userStore.gameSocket.emit("quitMM", { user: userStore });
};

userStore.gameSocket.on("gameReady", function () {
  router.push("pong");
});
</script>

<template>
  <div class="main-section">
    <div class="game">
      <div id="title"><Title /></div>
      <div class="secondary-button" id="b1" @click="startMatchmaking">
        Quick game
      </div>
      <div class="popup" v-if="popupTriggers">
        <div class="popup-inner bg-black bg-opacity-100">
          <h1>In queue...</h1>
          <h2 class="text-center">{{ formattedElapsedTime }}</h2>
          <button
            class="popup-close secondary-button"
            @click="leaveMatchmaking"
          >
            CANCEL QUEUE
          </button>
        </div>
      </div>
      <select v-model="game_mode" id="b2" class="secondary-button">
        <option value="beach">Beach</option>
        <option value="vice">Vice</option>
        <option value="monkey">Monkey</option>
        <option value="mario">Mario</option>
        <option value="default">Classic</option>
      </select>
    </div>
    <div class="navbar"><NavbarItem /></div>
    <div class="contact"><Contact /></div>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/variables.scss" as v;
.main-section {
  display: grid;
  grid-template-columns: 80% 20%;
  grid-template-rows: 10% 90%;
  gap: 0 0;
  grid-auto-flow: row;
  grid-template-areas:
    "navbar navbar"
    "game contact";
}

.game {
  grid-area: game;
  background-image: url("@/assets/sphere_mini.png");
  background-repeat: no-repeat;
  background-position: center;
  display: grid;
  grid-template-columns: 1fr 40% 30%;
  grid-template-rows: 48% repeat(2, 9.9%) 1fr;

  #title {
    grid-area: 1 / 2 / 2 / 3;
    margin-top: 12rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #b1 {
    grid-area: 2 / 2 / 3 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: auto;
  }

  #b2 {
    grid-area: 3 / 2 / 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: auto;
    -webkit-appearance: none;
    appearance: none;
  }

  @media screen and (min-height: 1160px) {
    #title {
      margin-top: 30rem;
    }

    #b1 {
      width: 40%;
      position: relative;
      top: -1rem;
    }

    #b2 {
      width: 40%;
      position: relative;
      top: -4rem;
    }
  }
}

.navbar {
  grid-area: navbar;
}

.contact {
  grid-area: contact;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;

  .popup-inner {
    background: linear-gradient(v.$primary, v.$dark-blue) fixed;
    margin-right: 20%;
    padding: 10rem;
    border-radius: 0.375rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h1,
    h2 {
      margin-bottom: 2rem;
      font-size: 3rem;
      color: white;
    }
  }
}
</style>
