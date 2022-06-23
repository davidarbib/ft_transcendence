<script setup lang="ts">
import channels from "@/assets/msg_test.json";
import { io } from 'socket.io-client'
import { ref, computed } from "vue";
import axios from "axios";
import socket from "@/views/ChatView.vue"
import showMessages from "@/views/ChatView.vue"
import {useUserStore} from "@/stores/auth";

const userStore = useUserStore();
const searched = ref("");
const chan = ref([]);
const messages = ref([]);
const channelOptions = ref(false);
const channelSelected = ref(-1);
const channelName = ref('');

function toggleChannelMenu(id: number) {
  channelSelected.value = id;
  channelOptions.value = !channelOptions.value;
}

const ourchan = computed(() => {
 axios.defaults.withCredentials = true;
  // eslint-disable-next-line vue/no-async-in-computed-properties
  axios
    .get(`http://localhost:8090/channels/chan/${userStore.user.login}`)
    .then((response) => {
      chan.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return chan.value
});

function selectChannel(name: string) {
  channelName.value = name;
  console.log('selectChannel :' + channelName.value);
  emit('name', channelName.value);
}
const emit = defineEmits(['name', 'msg']);

</script>

<template>
  <div class="contact-section mx-2">
    <input placeholder="search" class="rounded searchbar" v-model="searched" />
    <br />
    <br />
    <div
      @click="selectChannel(channel.name)"
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="channel in ourchan"
      :key="channel.id"
    >
      <div class="user-pseudo py-2" >
        <p>{{ channel.name }}</p>
        <p class="icon" @click="toggleChannelMenu(channel.id, channel.name)">
          <i class="fa-solid fa-gear"></i>
        </p>
      </div>
      <Transition name="slide-fade">
        <div v-if="channelOptions && channelSelected === channel.id">
          <ul class="list">
            <li><router-link to="/chat">leave</router-link></li>
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
