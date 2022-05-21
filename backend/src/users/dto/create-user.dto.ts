import { UserStatus, User} from "../entities/user.entity";
import { IsString, IsInt, IsEmail, Length, IsOptional, isJWT } from 'class-validator';
import { IsLoginlNotExisting, isLoginNotExistingConstraint } from "../validator/is-login-already-exist.validator";
export class CreateUserDto {

    @IsString()
    @Length(1,9)
   // @IsLoginlNotExisting()
    login: string;

    status: UserStatus;

    @IsString()
    @IsOptional()
    //@isJWT() pour l'authentification
    authToken: string;

  //  @IsString()
  @IsOptional()
    avatarRef:string;
}
