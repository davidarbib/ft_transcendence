<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Channel from "@/components/ChannelComponent.vue";
import PubChannel from "@/components/PubChannelComponent.vue";
import { ref, reactive , onBeforeMount, watch} from "vue";
import { useUserStore } from "@/stores/auth";
import { io } from "socket.io-client";
import { computed } from "@vue/reactivity";
import axios from "axios";
const getName = ref("");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userStore = useUserStore();
let messages: any = ref([]);
const messageText = ref("");
const myInput = ref("");
let userIn = ref([]);

interface stock_msg{
  msg:[];
};
interface Messages {
    [room: string] :string; 
    room :string;
    stock_msg;
};
let test: Messages[] = [];

  userStore.chatsocket.on("connection", (socket) => {
  });
  userStore.chatsocket.on("message", (message :never) => {
    test.push({room : getName.value,stock_msg :message})
    messages.value.push(message);
  });

/*
onBeforeMount(() =>{
   userStore.chatsocket.emit('findMessageFromChan', {name:getName.value, login :userStore.user}, (response) => {
     messages.value = response
  });
        console.log("qhddhwdjhd")
});*/


function getUserInChan() {
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
};


function sendMessage() {
  userStore.chatsocket.emit(
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

watch(getName, () =>{
  messages.value = [];
  userStore.chatsocket.emit("findMessageFromChan", {name: getName.value, login: userStore.user.login} , (data:never) =>
  {
    console.log(data);
    messages.value = (data);
  })
})
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
        v-for="message in messages"
        :key="message"
      >
        {{ message.login }}{{ message.name }} :
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
