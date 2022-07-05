<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";

const userStore = useUserStore();
const open = ref(false);
const createChanName = ref("");
const createChanPass = ref("");
const chan_setting = ref("private");

function createChannel() {
  open.value = false;
userStore.chatsocket.emit('createChannel', {
      login: userStore.user.login,
      name: createChanName.value,
      type: chan_setting.value,
      password: createChanPass.value,
},
)
 /* axios.defaults.withCredentials = true;
  axios
    .post("http://localhost:8090/channels", {
      name: createChanName.value,
      type: chan_setting.value,
      password: createChanPass.value,
    })
    .catch((error) => console.log(error));*/
}
</script>

<template>
  <button @click="open = true" class="secondary-button text-left mx-1">
    <slot />
  </button>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div class="modal-inner">
        <div class=""><slot /></div>
        <input
          v-model="createChanName"
          id="email-address"
          name="email"
          type="email"
          autocomplete="email"
          class="log w-full rounded-t-md focus:outline-none border border-gray-300"
          placeholder="Name"
        />
        <select v-model="chan_setting" class="status secondary-button">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <input
          v-model="createChanPass"
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          class="pass w-full rounded-b-md focus:outline-none border border-gray-300"
          placeholder="Password"
        />
        <button @click="open = false" class="cancel secondary-button">
          Cancel
        </button>
        <button @click="createChannel" class="valid primary-button">
          Create
        </button>
      </div>
    </div>
  </Teleport>
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
    // v.$primary;
    width: 40rem;
    height: 20rem;
    padding: 1rem;
    border-radius: 0.375rem;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    .title {
      grid-area: 1 / 1 / 2 / 7;
    }
    .log {
      padding-left: 1rem;
      border-radius: 0.375rem;
      background-color: v.$primary;
      grid-area: 2 / 1 / 3 / 7;
      transition: 0.3s;
      &:hover {
        background-color: #c1139e;
        cursor: pointer;
      }
    }
    .status {
      padding-left: 1rem;
      height: 3rem;
      width: 100%;
      border-radius: 0.375rem;
      background-color: v.$primary;
      grid-area: 3 / 1 / 4 / 7;
      transition: 0.3s;
      &:hover {
        background-color: #c1139e;
        cursor: pointer;
      }
    }
    .pass {
      padding-left: 1rem;
      border-radius: 0.375rem;
      background-color: v.$primary;
      grid-area: 4 / 1 / 5 / 7;
      transition: 0.3s;
      &:hover {
        background-color: #c1139e;
        cursor: pointer;
      }
    }
    .valid {
      background-color: green;
      grid-area: 5 / 1 / 6 / 4;
      transition: 0.5s;
      &:hover {
        background-color: rgb(46, 219, 46);
      }
    }
    .cancel {
      background-color: crimson;
      grid-area: 5 / 4 / 6 / 7;
      transition: 0.5s;
      &:hover {
        background-color: red;
      }
    }
  }
}
</style>
