import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    login: "",
    authToken: "",
    avatarRef: "",
    id: "",
    status: "",
    username: "",
    lossCount: Number,
    winCount: Number
  }),
  actions: ({
    setLogin(userLogin: string): void {
      this.login = userLogin;
    },
    setAuthToken(userAuthToken: string): void {
      this.authToken = userAuthToken;
    },
    setAvatarRef(userAvatarRef: string): void {
      this.avatarRef = userAvatarRef;
    },
    setId(userId: string): void {
      this.id = userId;
    },
    setStatus(userStatus: string): void {
      this.status = userStatus;
    },
    setUsername(userUsername: string): void {
      this.username = userUsername;
    },
    setLossCount(userLossCount: NumberConstructor): void {
      this.lossCount = userLossCount;
    },
    setWinCount(userWinCount: NumberConstructor): void {
      this.winCount = userWinCount;
    },
    print_user(): void {
      console.log(`login: ${this.login}`);
      console.log(`authToken: ${this.authToken}`);
      console.log(`Id: ${this.id}`);
      console.log(`Status: ${this.status}`);
      console.log(`Username: ${this.username}`);
      console.log(`LossCount: ${this.lossCount}`);
      console.log(`WinCount: ${this.winCount}`);
    }
  })
})