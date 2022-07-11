<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Channel from "@/components/ChannelComponent.vue";
import PubChannel from "@/components/PubChannelComponent.vue";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import axios from "axios";

axios.defaults.withCredentials = true;

interface Message {
  id: string;
  content: string;
  time: string;
  login: string;
}

interface User {
  login: string;
  id: string;
}

const router = useRouter();
const userStore = useUserStore();
const getName = ref<string>("");
let messages = ref<Message[]>([]);
const messageText = ref<string>("");
const myInput = ref<string>("");
let inviteUid = ref<string>("");
const lobbyToggle = ref<boolean>(false);

const userIn = ref<User[]>([]); // list of users in channel
const owner = ref<string>(""); // string for owner name
const allAdmins = ref<User[]>([]); // There are all admins inside
const allMuted = ref<User[]>([]); // list muted user
const allBanned = ref<User[]>([]); // list banned user

/* permet de Set la connexion quand ca refresh essentiel pour les dm */
onMounted(() => {
  userStore.chatsocket.emit("setConnexion", { user: userStore.user });
});

/* pour recevoir les message envoye */
userStore.chatsocket.on("message", (message, chan) => {
  console.log(message);
  if (chan.name == getName.value) return messages.value.push(message);
});

/* event il ya un new user dans le chan */
userStore.chatsocket.on("newUser", (usr: never, chan) => {
  if (chan.name == getName.value) userIn.value.push(usr);
});

/* event le user est devenu admin dans le chan */
userStore.chatsocket.on("newadmin", (chan: never, user: never) => {
  //  if (chan.name == getName.value)
  // need to put data in tab of admin
});

function listMute() {
  userStore.chatsocket.emit(
    "getMuteInChan",
    { name: getName.value },
    (data: never) => {
      allMuted.value = data;
    }
  );
}

function listBan() {
  userStore.chatsocket.emit(
    "getBanInChan",
    { name: getName.value },
    (data: never) => {
      allBanned.value = data;
    }
  );
}

/* AS TON BESOIN D'UN MDP POUR CE CHAN */
function needPassword() {
  userStore.chatsocket.emit("needPassword", { name: getName.value }, (data) => {
    // LA DATA return true or false
  });
}

/* EST CE QUE LE PASSWORD  EST BON */
function isGoodPassword(password: string) {
  userStore.chatsocket.emit(
    "isPassword",
    { name: getName.value, password: password },
    (data) => {
      //BOOL
    }
  );
}
/* CHANGER LE PASSWORD*/
function changePassword(password: string) {
  userStore.chatsocket.emit(
    "changePassword",
    { name: getName.value, password: password },
    () => {}
  );
}

function isUserAdmin(login: string): boolean {
  for (let x = 0; allAdmins.value[x]; x++) {
    let i = allAdmins.value[x];
    if (i.login === login) return true;
  }
  return false;
}

function isUid(str: string): boolean {
  return str.length === 36 ? (str.match(/-/g) || []).length === 4 : false;
}

userStore.gameSocket.on("gameReady", function (game) {
  console.log("game is ready");
  userStore.gameInfos.gameId = game.gameId;
  userStore.gameInfos.playerId = game.playerId;
  userStore.gameInfos.isP1 = game.isP1;
  router.push("pong");
});

const cancelLobby = () => {
  userStore.gameSocket.emit("cancelInvite", { userId: userStore.user.id });
  lobbyToggle.value = false;
};

userStore.gameSocket.on("inviteCreated", (invite) => {
  console.log("transfer invite to chat");
  inviteUid.value = invite;
  userStore.chatsocket.emit("createMessage", {
    name: getName.value,
    login: userStore.user.login,
    content: inviteUid.value,
  });
  lobbyToggle.value = true;
});

function playGame() {
  console.log("create game");
  userStore.gameSocket.emit("createInvite", { userId: userStore.user.id });
}

function isUserBanned(login: string): boolean {
  for (let x = 0; allBanned.value[x]; x++) {
    let i = allBanned.value[x];
    if (i.login === login) return true;
  }
  return false;
}

function isUserMuted(login: string): boolean {
  for (let x = 0; allMuted.value[x]; x++) {
    let i = allMuted.value[x];
    if (i.login === login) return true;
  }
  return false;
}

function isUserOwner(login: string): boolean {
  // pour savoir si le user est un owner
  // console.log(owner.value);
  return owner.value === login;
}

function getUserInChan() {
  // pour get tout les user chan
  axios
    .get(`http://localhost:8090/channels/${getName.value}`)
    .then((response) => {
      userIn.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return userIn.value;
}

function sendMessage() {
  // pour envoyer des message
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

function muteClient(login: string) {
  // EP pour mutes les users
  // console.log("TEST TO MUTE");
  userStore.chatsocket.emit(
    "MuteBanUser",
    { name: getName.value, user: userStore.user, target: login, mute: true },
    (data: never) => {
      console.log(data);
      //data
    }
  );
}

function addFriend(login: string) {
  axios
    .post(`http://localhost:8090/contacts/${getName.value}`, {
      userLogin: userStore.user.login,
      followedLogin: login,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("friend");
}

// get all admins
function getAdmins() {
  // pour avoir tout les admin du serv
  axios
    .get(`http://localhost:8090/chan-participants/admin/${getName.value}`, {
      name: getName.value,
    })
    .then((response) => {
      allAdmins.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function getOwner() {
  // get owner of chan and put it in owner.value.
  axios
    .get(`http://localhost:8090/chan-participants/owner/${getName.value}`, {
      name: getName.value,
    })
    .then((response) => {
      owner.value = response.data.login;
      // console.log(owner.value);
    })
    .catch((error) => {
      console.log(error);
    });
}

// add admin (addAdmin(login))
function addAdmin(login: string) {
  userStore.chatsocket.emit("addAdmin", {
    name: getName.value,
    user: userStore.user,
    login: login,
  });
  // console.log("add admin");
}

function itsMe(login: string): boolean {
  return !(userStore.user.login === login);
}

function banUser(login: string) {
  userStore.chatsocket.emit("MuteBanUser", {
    name: getName.value,
    user: userStore.user,
    target: login,
    ban: true,
  });
}

watch(getName, () => {
  getAdmins();
  listMute();
  listBan();
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
</script>

<template>
  <Teleport to="body">
    <div v-if="lobbyToggle" class="modal">
      <div class="modal-inner">
        <div class="loader"></div>
        <button @click="cancelLobby" class="secondary-button">
          Cancel invite
        </button>
      </div>
    </div>
  </Teleport>
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
            <p v-if="isUserOwner(login.login)" class="owner-status">
              <i class="fa-solid fa-star"></i>
            </p>
            <!--          is admin icon-->
            <p v-if="isUserAdmin(login.login)" class="admin-status">
              <i class="fa-solid fa-crown"></i>
            </p>
          </div>
        </div>
        <div v-if="itsMe(login.login)" class="icon">
          <!--        view profil-->
          <router-link
            class="common-icons"
            :to="{ name: 'profile', params: { pseudo: login.login } }"
          >
            <i class="fa-solid fa-user mx-1"></i
          ></router-link>
          <!--        add friend-->
          <p class="common-icons" @click="addFriend(login.login)">
            <i class="fa-solid fa-heart mx-1"></i>
          </p>
          <!--        play game-->
          <p class="common-icons" @click="playGame">
            <i class="fa-solid fa-gamepad mx-1"></i>
          </p>
          <!--        mute (admin + owner)-->
          <p
            v-if="
              isUserAdmin(userStore.user.login) ||
              isUserOwner(userStore.user.login)
            "
            class="admin-icons"
            @click="muteClient(login.login)"
          >
            <i class="fa-solid fa-comment-slash mx-1"></i>
          </p>
          <!--        ban (admin + owner)-->
          <p
            v-if="
              isUserAdmin(userStore.user.login) ||
              isUserOwner(userStore.user.login)
            "
            class="admin-icons"
            @click="banUser(login.login)"
          >
            <i class="fa-solid fa-ban mx-1"></i>
          </p>
          <!--        add admin (owner)-->
          <p
            v-if="isUserOwner(userStore.user.login)"
            class="admin-icons"
            @click="addAdmin(login.login)"
          >
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
        <router-link
          v-if="isUid(message.content)"
          :to="{
            name: 'privateGame',
            params: { inviteId: message.content },
          }"
          class="secondary-button"
          >Play a pong game ? 🌚</router-link
        >
        <span v-else-if="!isUserBanned(userStore.user.login)">
          {{ message.login }} :
          {{ message.time }}
          <p>{{ message.content }}</p>
        </span>
      </div>
    </div>
    <div class="message-input">
      <input
        type="text"
        v-if="!isUserMuted(userStore.user.login)"
        v-on:keyup.enter="sendMessage"
        v-model="myInput"
        class="h-3/4 w-3/4 px-2 focus:outline-none border rounded border-gray-300"
      />
      <button
        v-if="!isUserMuted(userStore.user.login)"
        @click="sendMessage"
        class="valid primary-button"
      >
        <i
          v-if="!isUserMuted(userStore.user.login)"
          class="fa-solid fa-paper-plane"
        ></i>
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
          margin-left: auto;
          margin-right: 0.5rem;
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.3);
  display: grid;
  justify-content: center;
  align-items: center;

  .modal-inner {
    display: flex;
    flex-direction: column;
    background: linear-gradient(v.$primary, v.$dark-blue) fixed;
    width: 40rem;
    height: 20rem;
    padding: 1rem;
    border-radius: 0.375rem;

    button {
      width: 60%;
      margin: auto;
    }
  }
}

.loader {
  border: 1rem solid #f3f3f3; /* Light grey */
  border-top: 1rem solid #e63380;
  border-radius: 50%;
  width: 10rem;
  height: 10rem;
  margin: auto;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
