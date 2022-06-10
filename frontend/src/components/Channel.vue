<script setup lang="ts">
import channels from "@/assets/msg_test.json";
import { ref } from "vue";
import { io } from 'socket.io-client'
const searched = ref("");
const channelOptions = ref(false);
const channelSelected = ref(-1);

function toggleChannelMenu(id: number) {
  channelSelected.value = id;
  channelOptions.value = !channelOptions.value;
}
</script>

<template>
  <div class="contact-section mx-2">
    <input placeholder="search" class="rounded searchbar" v-model="searched" />
    <br />
    <br />
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="channel in channels"
      :key="channel.id"
    >
      <div class="user-pseudo py-2">
        <p>{{ channel.name }}</p><p class="icon" @click="toggleChannelMenu(channel.id)"><i class="fa-solid fa-gear"></i></p>
      </div>
      <Transition name="slide-fade">
        <div v-if="channelOptions && channelSelected === channel.id">
          <ul class="list">
            <li><router-link to="/chat">leave</router-link></li>
            <li><router-link to="/qiwjeoi">rename</router-link></li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.contact-section {
  background: rgba($color: #000000, $alpha: 0.1);
  height: 92vh;
  overflow: scroll;

  .user-card {
    cursor: pointer;
    display: grid;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
    .user-pseudo {
      color: v.$primary;
      padding-left: 0.5rem;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .icon {
        margin-right: 1rem;
      }
    }

    .list {
      padding-bottom: 1rem;
      a {
        color: white;
        padding-left: 1rem;
      }
    }
  
    .slide-fade-enter-active {
      transition: all 0.3s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .searchbar {
    position: fixed;
    z-index: 3;
    padding-left: 1rem;
    height: 3rem;
    width: 19%;
  }
}
</style>
