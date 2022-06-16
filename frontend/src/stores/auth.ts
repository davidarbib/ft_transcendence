import { defineStore } from "pinia";

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