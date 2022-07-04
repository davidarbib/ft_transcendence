import { UserStatus, User} from "../entities/user.entity";
import { IsString, IsInt, IsEmail, Length, IsOptional, isJWT, IsBoolean } from 'class-validator';
import { IsLoginlNotExisting, isLoginNotExistingConstraint } from "../validator/is-login-already-exist.validator";
export class CreateUserDto {

    @IsString()
    @Length(1,9)
    @IsLoginlNotExisting()
    login: string;

    
    @IsString()
    @Length(1,9)
    @IsLoginlNotExisting()
    username: string;

    status: UserStatus;

    @IsString()
    @IsOptional()
    //@isJWT() pour l'authentification
    authToken: string;

    @IsBoolean()
    @IsOptional()
    doubleFA: boolean;
    @IsString()
    @IsOptional()
    avatarRef:string;
}
