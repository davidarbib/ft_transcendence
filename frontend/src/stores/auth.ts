import { defineStore } from "pinia";
import { ref, watch } from "vue";

<<<<<<< HEAD
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {id: "default", login: "", username: "", status: "online", authToken: null, avatarRef: null, lossCount: 10, winCount: 10},
    test: 42
  })
})

export const useChanStore = defineStore({
  id: 'channel',
  state: () => ({
    channel: {id: "default", name: "", type: "", password: ""}
  })
})
=======
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

  if (localStorage.getItem("user")) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.value = JSON.parse(localStorage.getItem("user"));
  }

  watch(
    user,
    (userVal) => {
      localStorage.setItem("user", JSON.stringify(userVal));
    },
    { deep: true }
  );

  return { user };
});
>>>>>>> master
