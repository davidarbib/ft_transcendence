<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Channel from "@/components/Channel.vue";
import PubChannel from "@/components/PubChannel.vue";
import { ref, reactive } from "vue";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/auth";
import { computed } from "@vue/reactivity";
import axios from "axios";

const getName = ref("");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let message: { value: any };
const userStore = useUserStore();
const socket = io("http://localhost:8090");
let messages: any = reactive([]);
const messageText = ref("");
const myInput = ref("");
let userIn = ref([]);

socket.on("message", (message) => {
  messages.push({ name: message.name.value });
});

const getUserInChan = computed(() => {
  axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/channels/${getName.value}`)
    .then((response) => {
      userIn.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return userIn.value;
});

function sendMessage() {
  socket.emit(
    "createMessage",
    {
      name: getName.value,
      login: userStore.user.login,
      content: myInput.value,
    },
    () => {
      messageText.value = "";
      myInput.value = "";
    }
  );
}

const showMessages = computed(() => {
  socket.emit(
    "findMessageFromChan",
    { name: getName.value },
    (response: any) => {
      messages.value = response;
    }
  );
  return messages.value;
});
</script>

<template>
  <div class="chat-section">
    <div class="navbar-item">
      <NavbarItem />
    </div>
    <div class="channel-list">
      <Channel @name="(msg) => (getName = msg)" />
    </div>
    <div class="channel-pub">
      <PubChannel @name="(msgs) => (getName = msgs)" />
    </div>
    <div class="channel-parti" v-for="login in getUserInChan" :key="login">
      <p>{{ login.login }}</p>
    </div>
    <div class="messages text-gray-300">
      <p class="text-2xl">{{ getName }}</p>
      <div
        class="message bg-black bg-opacity-20 w-3/4 mx-2 rounded p-2"
        v-for="message in showMessages"
        :key="message"
      >
        {{ message.login }} :
        {{ message.time }}
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div class="message-input">
      <input
        type="text"
        v-model="myInput"
        class="h-3/4 w-3/4 px-2 focus:outline-none border rounded border-gray-300"
      />
      <button @click="sendMessage" class="valid primary-button">send</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.chat-section {
  height: 100vh;
  display: grid;
  grid-template-columns: 20% 60% 20%;
  grid-template-rows: 10% repeat(2, 40%) 10%;
  grid-column-gap: 0;
  grid-row-gap: 0;

  .navbar-item {
    grid-area: 1 / 1 / 2 / 4;
  }

  .channel-list {
    grid-area: 2 / 1 / 3 / 2;
  }

  .channel-pub {
    grid-area: 2 / 3 / 5 / 4;
  }

  .messages {
    grid-area: 2 / 2 / 4 / 3;
    overflow: scroll;
    border: none;
    overflow-y: hidden;
    overflow-x: hidden;

    .message {
      margin-top: 1rem;
      width: 90%;
    }
  }

  .channel-parti {
    background-color: aqua;
    grid-area: 3 / 1 / 5 / 2;
  }

  .message-input {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-left: 0.5rem;
    font-size: 1.5rem;
    grid-area: 4 / 2 / 5 / 3;
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
