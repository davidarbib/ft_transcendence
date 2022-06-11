import { User } from "src/users/entities/user.entity"

export type JwtPayload = {sub: string; login: string};

export type JwtTwoFaPayload = {
  sub: string;
  login: string,
  twoFactorAuthentified: boolean
};

export type UserDetails =
{
    login: string,
    username: string,
}

export type TwoFactorSecret = 
{
  secret: string,
  uri: string, 
  qr: string, 
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
