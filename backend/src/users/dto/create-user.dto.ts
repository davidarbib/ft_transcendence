import { UserStatus } from "../entities/user.entity";

export class CreateUserDto {

    login: string;
    mail:string;
    password:string;
    status: UserStatus;
    authToken: string;
    avatarRef:string;
    winCount:number;
    losscount:number;
}
