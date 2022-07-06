<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const searched = ref("");
const chan = ref([]);
const messages = ref([]);
const channelOptions = ref(false);
const channelSelected = ref(-1);
const channelName = ref("");

function toggleChannelMenu(id: number) {
  channelSelected.value = id;
  channelOptions.value = !channelOptions.value;
}
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
  channelName.value = name;
  console.log("selectChannel :" + channelName.value);
  emit("name", channelName.value);
}

function leaveChan() {
  console.log("leave chann");
 userStore.chatsocket.emit('leavechan', {user : userStore.user, name : channelName.value}, () =>{

   })
}

function addPassword() {
  axios.defaults.withCredentials = true;
  console.log("add password");
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
        <p class="icon" @click="toggleChannelMenu(channel.id, channel.name)">
          <i class="fa-solid fa-gear"></i>
        </p>
      </div>
      <Transition name="slide-fade">
        <div v-if="channelOptions && channelSelected === channel.id">
          <div class="list">
            <!--        add pass-->
            <p @click="addPassword()">
              <i class="fa-solid fa-key mx-1"></i>
            </p>
            <!--        leave chan-->
            <p @click="leaveChan()">
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
