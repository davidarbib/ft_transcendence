<script setup lang="ts">
import ChatModal from "@/components/ChatModalComponent.vue";
import axios from "axios";
import { io } from "socket.io-client";
import { useUserStore } from "@/stores/auth";
import { ref, onMounted, watch } from "vue";

const childMsg = ref("");
const chanPublic = ref([]);
const chanPrivate = ref([]);
const userStore = useUserStore();
const passOpen = ref<boolean>(false); // popup
const correctPass = ref<boolean>(true);
const inputPass = ref<string>("");

userStore.chatsocket.on("creation", (data) => {
  if (data.type == "public") chanPublic.value.push(data);
  if (data.type == "private") chanPrivate.value.push(data);
});

/* AS TON BESOIN D'UN MDP POUR CE CHAN */
function needPassword(name: string) {
  userStore.chatsocket.emit("needPassword", { name: name }, (data: never) => {
    // console.log(data);
    data ? (passOpen.value = true) : (passOpen.value = false);
    if (passOpen.value == false) {
      joinChan(name);
    }
  });
}

function isGoodPassword(name: string, password: string) {
  console.log('abricot');
  userStore.chatsocket.emit(
    "isPassword",
    { name: name, password: password }, (data: never) => {
        console.log(data);
        // correctPass.value = !correctPass.value;
      // } else {
      //   console.log("poueqwt");
        // correctPass.value = true;
        // passOpen.value = false;
        // joinChan(name);
      // }
    }
  );
}

watch(childMsg, () => {
  axios.defaults.withCredentials = true;
  axios
    .get(`http://localhost:8090/channels/chanpublic/${userStore.user.login}`)
    .then((response) => {
      chanPublic.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  axios
    .get(`http://localhost:8090/channels/chanpriv/${userStore.user.login}`)
    .then((response) => {
      chanPrivate.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});

onMounted(() => {
  axios.defaults.withCredentials = true;
  const adr = `http://localhost:8090/channels/chanpublic/${userStore.user.login}`;
  axios
    .get(adr)
    .then((response) => {
      chanPublic.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  axios
    .get(`http://localhost:8090/channels/chanpriv/${userStore.user.login}`)
    .then((response) => {
      chanPrivate.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});

const emit = defineEmits(["name"]);
function joinChan(name: string) {
  userStore.chatsocket.emit("joinchan", { user: userStore.user, name: name });
}
</script>

<template>
  <div class="pub-chan-section">
    <div class="pub-chan-menu">
      <ChatModal @response="(msg) => (childMsg = msg)">
        <p>Create Channel</p></ChatModal
      >
    </div>
    <h1>Public :</h1>
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
    >
      <div
        class="pub-chan-info py-2"
        v-for="channel in chanPublic"
        :key="channel.id"
      >
        <p>{{ channel.name }}</p>
        <button
          @click="needPassword(channel.name)"
          class="secondary-button interact"
        >
          Join
        </button>
        <Teleport to="body">
          <div v-if="passOpen" class="modal">
            <div class="modal-inner">
              <input
                v-model="inputPass"
                type="text"
                class="message-input h-3/4 w-3/4 px-2 focus:outline-none border rounded"
              />
              <div v-if="correctPass">
                <p>Invalide password !</p>
              </div>
              <button
                class="primary-button valid-button"
                @click="isGoodPassword(channel.name, inputPass)"
              >
                Confirm
              </button>
              <button
                class="primary-button cancel-button"
                @click="passOpen = false"
              >
                Cancel
              </button>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
    <h1>Private :</h1>
    <div
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
    >
      <div
        class="pub-chan-info py-2"
        v-for="channel in chanPrivate"
        :key="channel.id"
      >
        <p>{{ channel.name }}</p>
        <button
          @click="joinChan(channel.name)"
          class="secondary-button interact"
        >
          Join
        </button>
      </div>
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
      grid-area: 2 / 1 / 3 / 3;
    }
    .cancel-button {
      background-color: crimson;
      grid-area: 2 / 3 / 3 / 4;
    }
  }
}

.pub-chan-section {
  height: 92vh;
  overflow: scroll;
  margin-right: 1rem;
  color: v.$primary;
  .private-chan-info {
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
