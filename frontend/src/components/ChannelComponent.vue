<script setup lang="ts">
import channels from "@/assets/msg_test.json";
import { io } from 'socket.io-client'
import { ref, computed } from "vue";
import axios from "axios";
const  socket = io('http://localhost:8090');


const searched = ref("");
const chan = ref([]);
const messages = ref([]);
const channelOptions = ref(false);
const channelSelected = ref(-1);
const channelName = ref('');


function showMessages(name :string ) {
   socket.emit ('findMessageFromChan', {name :name } , (response) => {
      messages.value = response;
   console.log(messages.value)
   emit('msg', messages.value);
   });
   }

function toggleChannelMenu(id: number) {
  channelSelected.value = id;
  channelOptions.value = !channelOptions.value;
}

const ourchan = computed(() => {
 axios.defaults.withCredentials = true;
  const addr = 'http://localhost:8090/channels/chan/m3L_dis';
  axios
    .get(addr)
    .then((response) => {
      chan.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    return chan.value
});

function selectChannel(name: string) {
  channelName.value = name;
  console.log('selectChannel :' + channelName.value);
  emit('name', channelName.value);
}

const emit = defineEmits(['name', 'msg']);
// onMounted(() => {
//   axios.defaults.withCredentials = true;
//   axios
//     .get('http://localhost:8090/channels')
//     .then((response) => {
//       test.values = response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });



</script>

<template>
  <div class="contact-section mx-2">
    <input placeholder="search" class="rounded searchbar" v-model="searched" />
    <br />
    <br />
    <div
      @click="selectChannel(channel.name); showMessages(channel.name)"
      class="user-card rounded my-2 bg-black bg-opacity-10 font-medium hover:bg-opacity-30 transition duration-300"
      v-for="channel in ourchan"
      :key="channel.id"
    >
      <div class="user-pseudo py-2" >
        <p>{{ channel.name }}</p>
        <p class="icon" @click="toggleChannelMenu(channel.id, channel.name)">
          <i class="fa-solid fa-gear"></i>
        </p>
      </div>
      <Transition name="slide-fade">
        <div v-if="channelOptions && channelSelected === channel.id">
          <ul class="list">
            <li><router-link to="/chat">leave</router-link></li>
            <li><router-link to="/">rename</router-link></li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;
.contact-section {
  background: rgba($color: #000000, $alpha: 0.1);
  height: 92vh;
  overflow: scroll;

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
      padding-bottom: 1rem;
      a {
        color: white;
        padding-left: 1rem;
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
