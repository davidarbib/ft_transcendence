import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { io } from "socket.io-client";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  const user = ref({
    id: "default",
    login: "",
    username: "",
    status: "online",
    authToken: null,
    avatarRef: null,
    lossCount: "0",
    winCount: "0",
    twoFactorEnabled: true,
    twoFactorSecret: "",
  });

  const gameSocket = io("http://localhost:8090");
  const chatsocket = io("http://localhost:8090");
  const statusSocket = io("http://localhost:8090");
  const gameMode = "default";

  const gameInfos = ref({
    gameId: "",
    playerId: "",
    isP1: false,
    scoreP1: 0,
    scoreP2: 0,
  });

  if (localStorage.getItem("user")) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.value = JSON.parse(localStorage.getItem("user"));
  } else {
    axios.defaults.withCredentials = true;
    axios
      .get("http://localhost:8090/auth/current")
      .then((response) => {
        user.value = response.data;
      })
      .catch(() => {
        console.log("Error");
      });
  }

  watch(
    user,
    (userVal) => {
      localStorage.setItem("user", JSON.stringify(userVal));
    },
    { deep: true }
  );

  return { user, gameSocket, gameInfos, gameMode, chatsocket, statusSocket };
});
