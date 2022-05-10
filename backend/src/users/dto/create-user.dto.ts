import { UserStatus } from "../entities/user.entity";
import { IsString, IsInt, IsEmail, Length } from 'class-validator';
export class CreateUserDto {

    @IsString()
    @Length(10)
    login: string;

    @IsEmail()
    mail:string;

    @IsString()
    password:string;

    status: UserStatus;

    @IsString()
    authToken: string;

    @IsString()
    avatarRef:string;
    @IsInt()
    winCount:number;
    losscount:number;
}
