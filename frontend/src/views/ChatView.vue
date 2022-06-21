<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Channel  from "@/components/ChannelComponent.vue";
import PubChannel from "@/components/PubChannelComponent.vue";
import axios from "axios";
import { ref, onMounted, reactive, onBeforeMount, watch } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/auth"
import { computed } from "@vue/reactivity";

const userStore = useUserStore();
const  socket = io('http://localhost:8090');
const messages = ref ([]);
const messageText = ref ('');
const joined = ref(false);
const getName =  ref('NO CHANNEL SELECTED');
const myInput = ref('');

/*
const getMsg  = computed(()  => {
  console.log('getMsg' + getName.value)
    socket.emit ('findMessageFromChan', {name : getName.value} , (response) => {
      messages.value = response;
    });
});
onMounted(() => {
  getMsg;
});*/

/*
socket.on ('message', (message) => {
  messages.value.push(message);
});*/

function sendMessage(){
  socket.emit('createMessage', {name: getName.value, login: userStore.user.login, content: myInput.value}, () => {
   messageText.value = '';
   myInput.value = '';
  });
};



</script>

<template>
  <div class="chat-section">

    <div class="navbar-item">
      <NavbarItem />
    </div>
    <div class="channel-list">
      <Channel @name='(msg) => getName = msg' :key="channels"/>
    </div>
      <div class="channel-pub">
        <PubChannel @name='(msgs) => getName = msgs' :key="channels"/>
      </div>
    <div class="messages text-gray-300">
      <p class="text-2xl"> {{ getName}} </p>
      <div
        class="message bg-black bg-opacity-20 w-3/4 mx-2 rounded p-2"
          @msg=' (msgo) => messages.push(msgo) '
         v-for="message in messages">
            {{ userStore.user.login}} :
           {{message.time}}
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div class="message-input">
      <input
        type="text"
        v-model="myInput"
        class="h-3/4 w-3/4 px-2 focus:outline-none border rounded border-gray-300"
      />
       <button @click="sendMessage" class="valid primary-button"> send </button>
    </div>

  </div>
</template>


<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.chat-section {
  height: 100vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: 10% 80% 10%;
  grid-column-gap: 0;
  grid-row-gap: 0;

  .navbar-item {
    grid-area: 1 / 1 / 2 / 4;
  }

  .channel-list {
    grid-area: 2 / 1 / 4 / 2;
  }

  .channel-pub {
    grid-area: 2 / 3 / 4 / 4;
  }

  .messages {
    grid-area: 2 / 2 / 3 / 2;
    overflow: scroll;
    border: none;
    overflow-y: hidden;
    overflow-x: hidden;

    .message {
      margin-top: 1rem;
      width: 90%;
    }
  }

  .message-input {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: 0.5rem;
    font-size: 1.5rem;
    grid-area: 3 / 2 / 4 / 2;
    input {
      width: 90%;
    }
    p {
      cursor: pointer;
      color: v.$dark-blue;
      font-size: 2.5rem;
    }
  }
}
</style>
