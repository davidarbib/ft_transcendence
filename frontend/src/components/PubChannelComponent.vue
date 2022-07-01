<script setup lang="ts">
import ChatModal from '@/components/ChatModalComponent.vue';
import axios from "axios";
import { io } from 'socket.io-client'
import { useChanStore, useUserStore } from "@/stores/auth";
import { ref, onMounted, reactive, watch } from "vue";
import { computed } from "@vue/reactivity";
const chanpu = ref([]);
const chanpriv = ref([]);
const channelName = ref('');
const userStore = useUserStore();
const  socket = io('http://localhost:8090');

const allchanpublic = computed(() => {
  axios.defaults.withCredentials = true;
  const addr = `http://localhost:8090/channels/chanpublic/${userStore.user.login}`;
  axios
    .get(addr)
    .then((response) => {
      chanpu.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return chanpu.value
});

function  joinchan(name: string)
{
   socket.emit('joinchan', {login: userStore.user.login, name : name})
}


const allchanpriv = computed(() => {
  axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/channels/chanpriv/${userStore.user.login}`)
    .then((response) => {
      chanpriv.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return chanpriv.value
});

const emit = defineEmits(['name']);
</script>

<template>
  <div class="pub-chan-section">
    <div class="pub-chan-menu">
      <ChatModal> <p>Create Channel</p></ChatModal>
    </div>
    <h1>Public :</h1>
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
   >
      <div class="pub-chan-info py-2"
       v-for="channel in allchanpublic"
        :key="channel.id">
        <p> {{channel.name}} </p>
        <button @click="joinchan(channel.name)" class="secondary-button interact">Join</button>
      </div>
    </div>
    <h1>
      Private :
    </h1>
    <div class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
    >
    <div class="pub-chan-info py-2"
         v-for="channel in allchanpriv"
         :key="channel.id">
      <p> {{channel.name}} </p>
      <button @click="joinchan(channel.name)" class="secondary-button interact">Join</button>
    </div>
  </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.pub-chan-section {
  height: 92vh;
  overflow: scroll;
  margin-right: 1rem;
  color: v.$primary;
  .priv-chan-info {
    color: #5b4182;
  }
  .pub-chan-menu {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    button {
      margin-right: 1rem;
    }
  }

  h1 {
    margin-top: 1rem;
    font-size: 2rem;
    color: white;
  }
  .pub-chan-info {
    color: v.$primary;
    padding-left: 0.5rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .interact {
    margin-right: 1rem;
  }

  .user-card {
    cursor: pointer;
    display: grid;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
  }
}
</style>
