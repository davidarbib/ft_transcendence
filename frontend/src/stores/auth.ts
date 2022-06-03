import { defineStore } from "pinia";

export default interface User {
  login: String,
  avatarRef: String,
  id: String,
  status: String,
  username: String,
  lossCount: Number,
  winCount: Number
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {},
    pongJWT: String
  }),
  actions: ({
    setUser(user: User): void {
      this.user = user;
    }
  })
})