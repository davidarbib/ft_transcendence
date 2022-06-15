<script setup lang="ts">
import NavbarItem from "@/components/NavbarItem.vue";
import Contact from "../components/Contact.vue";
import Historic from "@/components/Historic.vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";
import { apiStore } from "@/stores/api";
import { onMounted } from "vue";
import type User from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const api = apiStore();
const userStore = useUserStore();
const router = useRouter();
const isCurrentUserProfile = ref(false);
let user = ref({
  id: "-1",
  login: "",
  username: "",
  status: "offline",
  authToken: "",
  avatarRef: null,
  winCount: "",
  lossCount: "",
});

const props = defineProps({
  pseudo: String,
});

onMounted(() => {
  axios
    .get(`${api.url}/users/${props.pseudo}`)
    .then((response) => {
      user.value = response.data;
      if (response.data === "") router.push({ path: "/profil_not_found" });
      if (user.value === userStore.$state.user)
        isCurrentUserProfile.value = true;
    })
    .catch((error) => {
      router.push({ path: "/profil_not_found" });
    });
});
</script>

<template>
  <div class="profil-section">
    <div class="navbar">
      <NavbarItem />
    </div>
    <div class="historic">
      <Historic />
    </div>
    <div class="profil-card bg-black bg-opacity-10">
      <header>
        <div class="secondary-button">
          <router-link to="/chat"> send message </router-link>
        </div>
        <div v-if="user.avatarRef === null" class="profil-picture h-36 w-36">
          <img src="@/assets/sphere_mini.png" alt="user profil picture" />
        </div>
        <div v-else class="profil-picture h-36 w-36">
          <img :src="user.avatarRef" alt="user profil picture" />
        </div>
        <div class="secondary-button">
          <router-link to="/"> + add friend </router-link>
        </div>
      </header>
      <div class="stats">
        <ul>
          <li>
            <p class="stat-nb">
              {{ parseInt(user.winCount) + parseInt(user.lossCount) }}
            </p>
            <p class="stats-value">Games</p>
          </li>
          <li class="mx-6">
            <p class="stat-nb">{{ user.winCount }}</p>
            <p class="stats-value">Win</p>
          </li>
          <li>
            <p class="stat-nb">{{ user.lossCount }}</p>
            <p class="stats-value">Looses</p>
          </li>
        </ul>
      </div>
      <div class="user-infos w-3/5 mx-auto my-4">
        <div class="input-update">
          <h1>
            {{ user.username }}
          </h1>
        </div>
      </div>
    </div>
    <div class="contact-bar">
      <Contact />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../assets/variables.scss" as v;

.profil-section {
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

  .profil-card {
    grid-column-start: 2;
    grid-row: 2/4;
    border-radius: 0.375rem;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: space-around;
    // justify-content: baseline;

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

      .profil-picture {
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
      font-size: 3rem;
      text-transform: capitalize;
    }
    .update-user-infos {
      width: 60%;
      margin: auto;
      margin-bottom: 1rem;
    }
  }
  .hidden {
    opacity: 0;
  }
}
</style>
