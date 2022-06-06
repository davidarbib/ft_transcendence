import { defineStore } from "pinia";

export default interface User {
  id: String,
  login: String,
  username: String,
  status: String,
  authToken: String,
  avatarRef: String,
  lossCount: String,
  winCount: String
}

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {},
  }),
  actions: ({
    setUser(user: User): void {
      this.user = user;
    }
  })
})