<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Channel from "@/components/ChannelComponent.vue";
import PubChannel from "@/components/PubChannelComponent.vue";
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/auth";
import axios from "axios";
const getName = ref("");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userStore = useUserStore();
let messages: any = ref([]);
const messageText = ref("");
const myInput = ref("");
let userIn = ref([]);
axios.defaults.withCredentials = true;

const isAdmin = ref();

function isUserAdmin(login: any) {
  for (let i in allAdmins) {
    // if (i.login === login) {
    // isAdmin.value = true;
    // return true;
  }
  // }
  // isAdmin.value = false;
  // return false;
}

const ownerName = ref("");
const isBan = ref(false);
const isMute = ref(false);
const selectUser = ref("");
const allAdmins = ref([]);
interface Messages {
  [room: string]: string;
  room: string;
  stock_msg;
}
let test: Messages[] = [];

userStore.chatsocket.on("connection", (socket) => {});
userStore.chatsocket.on("message", (message: never) => {
  test.push({ room: getName.value, stock_msg: message });
  messages.value.push(message);
});

function getUserInChan() {
  axios
    .get(`http://localhost:8090/channels/${getName.value}`)
    .then((response) => {
      userIn.value = response.data;
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  return userIn.value;
}

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

watch(getName, () => {
  getAdmins(); // all admins in allAdmins list
  getOwner();
  getUserInChan();
  messages.value = [];
  userStore.chatsocket.emit(
    "findMessageFromChan",
    { name: getName.value, login: userStore.user.login },
    (data: never) => {
      messages.value = data;
    }
  );
});

function muteClient() {
  userStore.chatsocket.emit(
    "MuteBanUser",
    { name: getName.value, user: userStore.user, target: "", mute: true },
    (data) => {
      //data
    }
  );
}

function addFriend(login: any) {
  axios
    .post(`http://localhost:8090/contacts/${getName.value}`, {
      userLogin: userStore.user.login,
      followedlogin: login,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("friend");
}

// avoir la liste de tout les admins
function getAdmins() {
  console.log("data >");
  userStore.chatsocket.emit(
    "userAdmin",
    { name: getName.value },
    (data: any) => {
      console.log(data);
      allAdmins.value = data;
    }
  );
  console.log("< data");
}

function getOwner() {
  console.log("owner >");
  userStore.chatsocket.emit("Owner", { name: getName.value }, (data) => {
    ownerName.value = data;
    console.log(ownerName.value);
  });
  console.log("owner <");
}

function playGame() {
  console.log("matchmaking");
}

function userStatus() {
  userStore.chatsocket.emit(
    "userChanStatus",
    { name: getName.value, login: userStore.user.login },
    (data:any) => {
      console.log(data.value);
    }
  );
  console.log("bool string status");
}

// add admin (addAdmin(login))
function addAdmin(login: any) {
  userStore.chatsocket.emit("addAdmin", {
    name: getName.value,
    user: userStore.user,
    login: login,
  });
  console.log("add admin");
}

function banUser(login: any) {
  userStore.chatsocket.emit("MuteBanUser", {
    name: getName.value,
    user: userStore.user,
    target: login,
    ban: true,
  });
}
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
      <PubChannel @name="(msg) => (getName = msg)" />
    </div>
    <div class="participants-list">
      <div
        class="channel-parti rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30"
        v-for="login in userIn"
        :key="login.id"
      >
        <div class="user-prop">
          {{ login.login }}
          <div class="user-icons">
            <!--          is owner icon-->
            <p v-if="isOwner" class="owner-status">
              <i class="fa-solid fa-star"></i>
            </p>
            <!--          is admin icon-->
            <p v-if="isUserAdmin(login.login) === true" class="admin-status">
              <i class="fa-solid fa-crown"></i>
            </p>
          </div>
        </div>
        <div class="icon">
          <!--        add friend-->
          <p class="common-icons" @click="addFriend(login.login)">
            <i class="fa-solid fa-heart mx-1"></i>
          </p>
          <!--        play game-->
          <p class="common-icons" @click="playGame()">
            <i class="fa-solid fa-gamepad mx-1"></i>
          </p>
          <!--        mute-->
          <p class="common-icons" @click="muteClient()">
            <i class="fa-solid fa-comment-slash mx-1"></i>
          </p>
          <!--        ban -->
          <p
            v-if="isAdmin || isOwner"
            class="admin-icons"
            @click="banUser(login.login)"
          >
            <i class="fa-solid fa-ban mx-1"></i>
          </p>
          <!--        add admin-->
          <p v-if="isAdmin || isOwner" class="admin-icons" @click="addAdmin()">
            <i class="fa-solid fa-crown mx-1"></i>
          </p>
        </div>
      </div>
    </div>
    <div class="messages text-gray-300">
      <p class="text-2xl">{{ getName }}</p>
      <div
        class="message bg-black bg-opacity-20 w-3/4 mx-2 rounded p-2"
        v-for="message in messages"
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
        v-if="!isBan"
        v-on:keyup.enter="sendMessage"
        v-model="myInput"
        class="h-3/4 w-3/4 px-2 focus:outline-none border rounded border-gray-300"
      />
      <button v-if="!isBan" @click="sendMessage" class="valid primary-button">
        <i v-if="!isBan" class="fa-solid fa-paper-plane"></i>
      </button>
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

  .participants-list {
    grid-area: 3 / 1 / 5 / 2;
    .channel-parti {
      display: grid;
      overflow: scroll;
      -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Old versions of Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
      color: v.$primary;
      border-radius: 0.375rem;
      padding-left: 0.5rem;
      margin-left: 0.5rem;
      .user-prop {
        display: flex;
        flex-direction: row;
        color: v.$primary;
        .user-icons {
          display: flex;
          flex-direction: row;
          margin-left: 3.5rem;
        }
      }
    }
    .icon {
      display: flex;
      flex-direction: row;
      color: whitesmoke;
      .common-icons {
        cursor: pointer;
        :hover {
          color: v.$primary;
        }
      }
      .admin-icons {
        cursor: pointer;
        :hover {
          color: v.$primary;
        }
      }
    }
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
