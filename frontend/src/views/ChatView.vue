<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Channel from "@/components/ChannelComponent.vue";
import PubChannel from "@/components/PubChannelComponent.vue";
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/auth";
import axios from "axios";

let getName = ref("");
const userStore = useUserStore();
let messages = ref([]);
const messageText = ref("");
const myInput = ref("");
let userIn = ref([]);
axios.defaults.withCredentials = true;
  const isOwner = ref(false);
  const owner = ref();
const isAdmin = ref(false);
  const isBan = ref(false);
  const isMute = ref(false);
  const allAdmins = ref([]);

/* permet de Set la connexion quand ca refresh essentiel pour les dm */
onMounted(() =>
{
  userStore.chatsocket.emit("setConnexion", {user: userStore.user})
})

/* pour recevoir les message envoye */
userStore.chatsocket.on("message", (message, chan) => { 
  console.log(message);
  if (chan.name == getName.value)
    return messages.value.push(message);
});

/* event il ya un new user dans le chan */
userStore.chatsocket.on("newUser", (usr: never, chan) => { 
  if (chan.name == getName.value)
     userIn.value.push(usr);
});
/* event le user est devenu admin dans le chan */
userStore.chatsocket.on("newadmin", (chan: never, user:never) => { 
//  if (chan.name == getName.value)
      // need to put data in tab of admin
});

function ListMute(){
  userStore.chatsocket.emit("getMuteInChan",{name:getName.value}, (data) =>{

  }
    // NEED TO PUT DATA IN LIST
  )
}
function ListBan(){
  userStore.chatsocket.emit("getBanInChan",{name:getName.value}, (data) => {}
    // NEED TO PUT DATA IN LIST
  )
}
/* AS TON BESOIN D'UN MDP POUR CE CHAN */
function NeedPassword() {
  userStore.chatsocket.emit("needPassword", {name:getName.value}, (data) =>{
    // LA DATA return true or false
  })
}
/* EST CE QUE LE PASSWORD  EST BON */
function isGoodPassword( password:string) {
  userStore.chatsocket.emit("isPassword", {name:getName.value, password:password}, (data) =>{
    //BOOL 
  })
}
/* CHANGER LE PASSWORD*/
function changePassword(password:string){
   userStore.chatsocket.emit("changePassword", {name:getName.value, password: password} , () =>{})
}
  function isUserAdmin(login: never) {  
    for (let i in allAdmins.value) {
      if (i.login === login) {
        isAdmin.value = true;
        return true;
      }
    }
    isAdmin.value = false;
    return false;
  }
  
  
  function isUserOwner() { // pour savoir si le user est un owner
    if (owner.value) {
      isOwner.value = owner.value.login == userStore.user.login;
    }
  }


function getUserInChan() { // pour avoir tout les user d'un chan 
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

function sendMessage() { // pour envoyer des message
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


function muteClient(login: any) { // EP pour mutes les utilisateurs
  console.log("TEST TO MUTE");
  userStore.chatsocket.emit(
    "MuteBanUser",
    { name: getName.value, user: userStore.user, target: login, mute: true },
    (data: never) => {
      console.log(data);
      //data
    }
  );
}

function addFriend(login: never) { // pour ajouter en amie
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
function getAdmins() { // pour avoir tout les admin du serv
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

function playGame() {
  console.log("matchmaking");
}

function getOwner() { // pour avoir l'owner 
  axios
    .get(`http://localhost:8090/chan-participants/owner/${getName.value}`, {
      name: getName.value,
    })
    .then((response) => {
      owner.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function userStatus() { // le status du current user
  userStore.chatsocket.emit(
    "userChanStatus",
    { name: getName.value, login: userStore.user.login },
    (data) => {
      // mettre data ou tu ve
    }
  );
  console.log("bool string status");
}

function addAdmin(login: any) { // add adnin
  userStore.chatsocket.emit("addAdmin", {
    name: getName.value,
    user: userStore.user,
    login: login,
  });
  console.log("add admin");
}

function banUser(login: any) { //banuser
  userStore.chatsocket.emit("MuteBanUser", {
    name: getName.value,
    user: userStore.user,
    target: login,
    ban: true,
  });
}
    watch(getName, () => { //permet de mettre a j les infos quand on change de channel
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
            <p v-if="isUserOwner(login.login)" class="owner-status">
              <i class="fa-solid fa-star"></i>
            </p>
            <!--          is admin icon-->
            <p v-if="isUserAdmin(login.login) === true" class="admin-status">
              <i class="fa-solid fa-crown"></i>
            </p>
          </div>
        </div>
        <div class="icon">
          <!--        view profil-->
          <router-link
            class="common-icons"
            :to="{ name: 'profile', params: { pseudo: login.login } }"
          >
            <i class="fa-solid fa-profil mx-1"></i
          ></router-link>
          <!--        add friend-->
          <p class="common-icons" @click="addFriend(login.login)">
            <i class="fa-solid fa-heart mx-1"></i>
          </p>
          <!--        play game-->
          <p class="common-icons" @click="playGame()">
            <i class="fa-solid fa-gamepad mx-1"></i>
          </p>
          <!--        mute-->
          <p class="common-icons" @click="muteClient(login.login)">
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
          <p
            v-if="isAdmin || isOwner"
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
