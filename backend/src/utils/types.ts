import { User } from "src/users/entities/user.entity"

export type UserDetails =
{
    login: string,
    username: string,
}

export type Done = (err: Error, user: User) => void;

declare global {
  namespace Express {
    interface User {
      id: string,
      login: string
    }
  }
}
