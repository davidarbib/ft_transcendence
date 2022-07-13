<script setup lang="ts">
import NavbarItem from "@/components/NavbarItemComponent.vue";
import Contact from "../components/ContactComponent.vue";
import Historic from "@/components/HistoricComponent.vue";
import axios from "axios";
import { useUserStore } from "@/stores/auth";
import { apiStore } from "@/stores/api";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const api = apiStore();
const userStore = useUserStore();
const router = useRouter();
const login = ref<string | string[]>("");
const isCurrentUserProfile = ref<boolean>(false);
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

function private_msg(target: any) {
  userStore.chatsocket.emit(
    "createDM",
    { user: userStore.user, target: target },
    (data) => {}
  );
}

onMounted(() => {
  axios.defaults.withCredentials = true;
  login.value = router.currentRoute.value.params.pseudo;
  axios
    .get(`${api.url}/users/login/${login.value}/`)
    .then((response) => {
      user.value = response.data;
      if (response.data === "") {
        router.push({ path: "/profile_not_found" });
        console.log("response.data is empty");
      }
      if (user.value.username === userStore.$state.user.username)
        router.push({ path: "/my_profile" });
    })
    .catch((error) => {
      console.log(error);
      router.push({ path: "/profile_not_found" });
    });
});
</script>

<template>
  <div class="profile-section">
    <div class="navbar">
      <NavbarItem />
    </div>
    <div class="historic">
      <Historic />
    </div>
    <div class="profile-card bg-black bg-opacity-10">
      <header>
        <div class="secondary-button">
          <button>Block user</button>
        </div>
        <div v-if="user.avatarRef === null" class="profile-picture h-36 w-36">
          <img src="@/assets/sphere_mini.png" alt="user profile picture" />
        </div>
        <div v-else class="profile-picture h-36 w-36">
          <img :src="`http://localhost:8090/${user.avatarRef}`" alt="user profile picture" />
        </div>
        <div class="secondary-button">
          <button>+ add friend</button>
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
          <div class="secondary-button">
            <router-link to="/chat">Send message</router-link>
          </div>
        </div>
      </div>
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
      flex-direction: column;
      justify-content: center;
      margin-bottom: 2rem;
      font-size: 3rem;
      text-transform: capitalize;
      h1 {
        text-align: center;
        color: white;
        margin-bottom: 1rem;
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
</style>
