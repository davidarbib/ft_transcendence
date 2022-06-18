<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Contact from "../components/ContactComponent.vue";
import Historic from "@/components/HistoricComponent.vue";
import NotificationMessage from "@/components/NotificationMessageComponent.vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";
import { apiStore } from "@/stores/api";
import { onMounted } from "vue";
import { ref } from "vue";

const api = apiStore();
const userStore = useUserStore();
let openModal = ref(false);
let qrCode = ref("");
let auth2FaCode = ref("");
let error2fa = ref(false);
let success2fa = ref(false);
let closeNotification = ref();
let success2faMessage = ref("Success");
let is2faEnabled = ref(userStore.user.twoFactorEnabled);

const activate2fa = () => {
  axios
    .post(`${api.url}/2fa/generate`)
    .then((response) => {
      qrCode.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      openModal.value = !openModal.value;
    });
};

const submit2faCode = () => {
  closeNotification.value = setInterval(() => {
    if (success2fa.value === true) success2fa.value = false;
    else if (error2fa.value === true) error2fa.value = false;
  }, 5000);
  axios
    .post(`${api.url}/2fa/turn-on`, {
      code: auth2FaCode.value,
    })
    .then(() => {
      error2fa.value = false;
      success2fa.value = true;
      success2faMessage.value = "You can log in with 2fa now";
      userStore.user.twoFactorEnabled = true;
      is2faEnabled.value = true;
      openModal.value = !openModal.value;
    })
    .catch((error) => {
      error2fa.value = true;
      success2fa.value = false;
      userStore.user.twoFactorEnabled = false;
      is2faEnabled.value = true;
      console.log(error);
    });
};

const turnoff2fa = () => {
  closeNotification.value = setInterval(() => {
    if (success2fa.value === true) success2fa.value = false;
    else if (error2fa.value === true) error2fa.value = false;
  }, 5000);
  axios
    .post(`${api.url}/2fa/turn-off`)
    .then(() => {
      success2faMessage.value = "2fa turned off !";
      success2fa.value = true;
      userStore.user.twoFactorEnabled = false;
      is2faEnabled.value = false;
    })
    .catch(() => {
      userStore.user.twoFactorEnabled = false;
      is2faEnabled.value = false;
    });
};

onMounted(() => {
  axios.defaults.withCredentials = true;
  if (userStore.user.id === "default") {
    axios
      .get(`${api.url}/auth/current`)
      .then((response) => {
        userStore.user = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  console.log(`is2faEnabled : ${is2faEnabled.value}`);
  console.log(`userStore.2fa : ${userStore.user.twoFactorEnabled}`);
});
</script>

<template>
  <div class="profile-section">
    <div class="navbar">
      <NavbarItem />
    </div>
    <notification-message type="success-2fa" header="Success" v-if="success2fa"
      ><p>You can log in with 2fa now</p></notification-message
    >
    <notification-message type="error-2fa" header="Error" v-if="error2fa"
      ><p>Please provide a valid code</p></notification-message
    >
    <div class="historic">
      <Historic />
    </div>
    <div class="profile-card bg-black bg-opacity-10">
      <header>
        <div class="secondary-button">
          <router-link to="/"> Update profile picture </router-link>
        </div>
        <div class="profile-picture h-36 w-36">
          <img src="@/assets/sphere_mini.png" alt="user profile picture" />
        </div>
        <div class="secondary-button">
          <router-link to="/"> Edit username </router-link>
        </div>
      </header>
      <div class="stats">
        <ul>
          <li>
            <p class="stat-nb">0</p>
            <p class="stats-value">Games</p>
          </li>
          <li class="mx-6">
            <p class="stat-nb">{{ userStore.user.winCount }}</p>
            <p class="stats-value">Win</p>
          </li>
          <li>
            <p class="stat-nb">{{ userStore.user.lossCount }}</p>
            <p class="stats-value">Looses</p>
          </li>
        </ul>
      </div>
      <div class="user-infos w-3/5 mx-auto my-4">
        <div class="input-update">
          <input
            id="pseudo"
            name="pseudo"
            v-model="userStore.user.username"
            type="text"
            autocomplete="current-password"
            class="h-1/3 focus:outline-none border border-gray-300 px-1"
          />
        </div>
        <div class="toggle-2fa">
          <button
            class="secondary-button"
            @click="activate2fa"
            v-if="!is2faEnabled"
          >
            Turn On 2fa
          </button>
          <button class="secondary-button" @click="turnoff2fa" v-else>
            Turn Off 2fa
          </button>
        </div>
        <Teleport to="body">
          <div v-if="openModal" class="modal">
            <div class="modal-inner p-32 rounded-md">
              <img :src="qrCode" alt="Qr Code" />
              <input
                type="text"
                placeholder="Type your code here"
                v-model="auth2FaCode"
                class="w-full text-center rounded-md my-6 py-4"
              />
              <p class="text-rose-500 mb-5" v-if="error2fa">
                Error Wrong 2fa code
              </p>
              <button @click="submit2faCode" class="secondary-button w-full">
                Submit
              </button>
            </div>
          </div>
        </Teleport>
      </div>
    </div>
    <div class="contact-bar">
      <Contact />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.profile-section {
  display: grid;
  grid-template-columns: 25% 50% 25%;
  grid-template-rows: 10% 80% 10%;

  .contact-bar {
    grid-column-start: 3;
    margin-left: 1rem;
  }

  .navbar {
    grid-column: 1/4;
    grid-row-start: 1;
  }

  .historic {
    grid-column-start: 1;
    margin-right: 1rem;
  }

  .profile-card {
    grid-column-start: 2;
    grid-row: 2/4;
    border-radius: 0.375rem;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    header {
      display: flex;
      flex-direction: row;
      justify-content: space-around;

      .secondary-button {
        width: 20%;
        height: 40%;
        position: relative;
        top: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .profile-picture {
        position: relative;
        top: -2rem;
      }
    }

    .stats {
      margin-bottom: 4rem;
      ul {
        display: flex;
        flex-direction: row;
        justify-content: center;
        text-align: center;

        .stats-value {
          color: rgb(161, 161, 161);
          font-size: 0.7rem;
        }
      }
    }
    .input-update {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      margin-bottom: 2rem;

      input {
        width: 80%;
        border-radius: 0.375rem;
      }

      p {
        cursor: pointer;
      }
    }

    .toggle-2fa {
      width: 100%;
      margin-top: 3rem;
      button {
        margin: auto;
        width: 80%;
      }
    }

    .update-user-infos {
      width: 60%;
      margin: auto auto 1rem;
    }
  }
  .hidden {
    opacity: 0;
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;

  .modal-inner {
    background: linear-gradient(v.$primary, v.$dark-blue) fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input:focus {
      outline: none;
    }
  }
}
</style>
