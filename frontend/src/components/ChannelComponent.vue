<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const chan = ref([]);
const channelOptions = ref(false);
const channelSelected = ref(-1);
const channelName = ref<string>("");
const owner = ref<string>("");
const hasPass = ref<boolean>(true);

const passOpen = ref<boolean>(false); // popup
const inputPass = ref<string>("");

const pwdStatusMsg = ref<string>("type in input");
const pwdStatusInit = ref<boolean>(false);
const itsMe = ref<boolean>(false);

userStore.chatsocket.on("leavetheChan", () => {
    console.log("YES");
      axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/channels/chan/${userStore.user.login}`)
    .then((response) => {
      chan.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  // need to put data in tab of admin
});

watch(inputPass, () => {
  pwdStatusMsg.value = pwdStatus(false);
});

function pwdStatus(bool: boolean) {
  if (hasPass.value) {
    if (inputPass.value) {
      pwdStatusInit.value = true;
      if (bool) {
        passOpen.value = false;
        changePassword(inputPass.value);
      }
      return "change";
    } else {
      pwdStatusInit.value = true;
      if (bool) {
        passOpen.value = false;
        removePassword();
      }
      return "delete";
    }
  } else {
    if (inputPass.value) {
      pwdStatusInit.value = true;
      if (bool) {
        addPassword(inputPass.value);
        passOpen.value = false;
      }
      return "add";
    } else {
      pwdStatusInit.value = false;
      return "";
    }
  }
}

function needPassword(name: string) {
  userStore.chatsocket.emit("needPassword", { name: name }, (data: never) => {
    // console.log(data);
    data ? (hasPass.value = true) : (hasPass.value = false);
  });
}

function modalCancelStatus() {
  inputPass.value = "";
  passOpen.value = false;
}

function getOwner() {
  // get owner of chan and put it in owner.value.
  if (channelName.value) {
    axios.defaults.withCredentials = true;
    axios
      .get(
        `http://localhost:8090/chan-participants/owner/${channelName.value}`,
        {
          name: channelName.value,
        }
      )
      .then((response) => {
        owner.value = response.data.login;
        console.log(owner.value);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function toggleChannelMenu(id: number) {
  channelSelected.value = id;
  channelOptions.value = !channelOptions.value;
  itsMe.value = owner.value === userStore.user.login;
}

userStore.chatsocket.on("join", (data) => {
  chan.value.push(data);
});

onMounted(() => {
  axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/channels/chan/${userStore.user.login}`)
    .then((response) => {
      chan.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return chan.value;
});

function selectChannel(name: string) {
  pwdStatusMsg.value = pwdStatus(false);
  channelName.value = name;
  getOwner();
  itsMe.value = owner.value === userStore.user.login;
  needPassword(channelName.value);
  console.log(channelName.value);
  emit("name", channelName.value);
}

function leaveChan() {
  console.log('Enter');
  console.log(channelName.value);
  userStore.chatsocket.emit(
    "leavechan",
    { user: userStore.user, name: channelName.value },
    () => {}
  );
  userStore.chatsocket.on("leavetheChan", () => {
    chan.value = [];
    console.log("YOLO");
    userStore.chatsocket.emit("testchan", { user: userStore.user }, (data) => {
      chan.value = data;
    });
  });
  channelName.value = "";
  console.log('Exit');
  console.log(channelName.value);
  emit("name", channelName.value);
}

/* CHANGER LE PASSWORD*/
function changePassword(password: string) {
  if (channelName.value)
    userStore.chatsocket.emit("changePassword", {
      name: channelName.value,
      password: password,
    });
}

function addPassword(pass: string) {
  userStore.chatsocket.emit("addPassword", {
    name: channelName.value,
    password: pass,
  });
}

function removePassword() {
  userStore.chatsocket.emit("deletePassword", { name: channelName.value });
}

function openModal() {
  itsMe.value = owner.value === userStore.user.login;
  passOpen.value = true;
  pwdStatus(false);
  inputPass.value = "";
}

const emit = defineEmits(["name", "msg"]);
</script>

<template>
  <div class="contact-section mx-2">
    <div
      @click="selectChannel(channel.name)"
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="channel in chan"
      :key="channel.id"
    >
      <div class="user-pseudo py-2">
        <p>{{ channel.name }}</p>
        <p
          v-if="!(channel.type === 'dm')"
          class="icon"
          @click="toggleChannelMenu(channel.id, channel.name)"
        >
          <i class="fa-solid fa-gear"></i>
        </p>
      </div>
      <Transition name="slide-fade">
        <div v-if="channelOptions && channelSelected === channel.id">
          <div class="list">
            <!--        add pass-->
            <div @click="openModal">
              <i class="fa-solid fa-key mx-1"></i>
            </div>
            <Teleport to="body">
              <div v-if="passOpen" class="modal">
                <div class="modal-inner">
                  <input
                    v-if="itsMe"
                    v-model="inputPass"
                    type="text"
                    class="message-input h-3/4 w-3/4 px-2 focus:outline-none border rounded"
                  />
                  <p v-else>Your not owner :(</p>
                  <!-- if input isnt init hide buttons -->
                  <button
                    v-if="pwdStatusInit && itsMe"
                    @click="pwdStatus(true)"
                    class="primary-button valid-pass-button"
                  >
                    {{ pwdStatusMsg }}
                  </button>
                  <button
                    class="primary-button cancel-button"
                    @click="modalCancelStatus()"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Teleport>
            <!--        leave chan-->
            <p @click.stop="leaveChan()">
              <i class="fa-solid fa-right-from-bracket mx-1"></i>
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

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
    ::placeholder {
      color: white;
    }
    background: rgb(237, 237, 237);
    width: 40rem;
    height: 10rem;
    padding: 1rem;
    border-radius: 0.375rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    .message-input {
      grid-area: 1 / 1 / 2 / 4;
      width: auto;
    }
    .valid-button {
      background-color: green;
      grid-area: 2 / 1 / 3 / 2;
      &:hover {
        background-color: darkgreen;
      }
    }
    .remove-pass-button {
      background-color: blue;
      grid-area: 2 / 2 / 3 / 3;
      &:hover {
        background-color: blueviolet;
      }
    }
    .cancel-button {
      background-color: crimson;
      grid-area: 2 / 3 / 3 / 4;
      &:hover {
        background-color: brown;
      }
    }
  }
}

.contact-section {
  background: rgba($color: #000000, $alpha: 0.1);
  overflow: scroll;
  height: 38vh;
  .user-card {
    cursor: pointer;
    display: grid;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
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
      display: flex;
      flex-direction: row;
      padding-bottom: 1rem;
      color: whitesmoke;
      :hover {
        color: v.$primary;
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
