<script setup lang="ts">
import { ref } from "vue";

const volumeButton = ref(true);
const muted = ref("");

const toggleMusic = () => {
  volumeButton.value = !volumeButton.value;
  if (volumeButton.value === false) muted.value = "";
  else muted.value = "muted";
};
</script>

<template>
  <div class="sound-icon" @click="toggleMusic">
    <p v-if="volumeButton"><i class="fa-solid fa-volume-high"></i></p>
    <p v-else><i class="fa-solid fa-volume-xmark"></i></p>
  </div>
  <div v-if="volumeButton">
    <audio id="myVideo" autoplay loop hidden>
      <source src="@/assets/homepage_music.mp3" type="audio/mpeg" />
      This browser does not support the audio element.
    </audio>
  </div>
  <div v-else>
    <audio id="myVideo" autoplay loop hidden muted>
      <source src="@/assets/homepage_music.mp3" type="audio/mpeg" />
      This browser does not support the audio element.
    </audio>
  </div>
</template>

<style lang="scss">
@use "../assets/variables.scss" as v;

.sound-icon {
  font-size: 4rem;
  color: v.$primary;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    font-size: 4.5rem;
  }
}
</style>
