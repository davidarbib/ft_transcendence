<script setup lang="ts">
import ChatModal from "@/components/ChatModalComponent.vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";
import { ref, onMounted, watch } from "vue";

const childMsg = ref("");
const chanPublic = ref([]);
const chanPrivate = ref([]);
const userStore = useUserStore();

userStore.chatsocket.on("creation", (data) => {
  if (data.type == "public") chanPublic.value.push(data);
  if (data.type == "private") chanPrivate.value.push(data);
});
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
          @click="joinChan(channel.name)"
          class="secondary-button interact"
        >
          Join
        </button>
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
