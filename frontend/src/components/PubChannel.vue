<script setup lang="ts">
import ChatModal from '@/components/ChatModal.vue';
//import channels from "@/assets/msg_test.json";
import axios from "axios";
import { io } from 'socket.io-client'
import { useChanStore } from "@/stores/auth";
import { ref, onMounted, reactive, watch } from "vue";
import { computed } from "@vue/reactivity";

const test = reactive<Array<Channel>>({Channel:[]});
const channelName = ref('');

onMounted(() => {
  axios.defaults.withCredentials = true;
  axios
    .get('http://localhost:8090/channels')
    .then((response) => {
      test.values = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});

function  joinchan(name: string) {
  channelName.value = name;
  emit('name', channelName.value);
  // socket.emit('joinchan', {login: "m3L_dis", name : "1235"})
}

const emit = defineEmits(['name']);
</script>

<template>
  <div class="pub-chan-section">
    <div class="pub-chan-menu">
      <ChatModal> <p>Create Channel</p></ChatModal>
      <ChatModal> <p>Join Channel</p></ChatModal>
    </div>
    <h1>Public channels :</h1>
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
   >
      <div class="pub-chan-info py-2"
        v-for="channel in test.values"
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
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently */
  }
}
</style>
