import { UserStatus, User} from "../entities/user.entity";
import { IsString, IsInt, IsEmail, Length, IsOptional, isJWT } from 'class-validator';
import { IsLoginlNotExisting, isLoginNotExistingConstraint } from "../validator/is-login-already-exist.validator";
<<<<<<< HEAD
//import { IsEmailNotExisting } from "../validator/is-email-already-exist.validator";
=======
>>>>>>> entity_mel
export class CreateUserDto {

    @IsString()
    @Length(1,9)
   // @IsLoginlNotExisting()
    login: string;

<<<<<<< HEAD
    //@IsEmail()
    //@IsEmailNotExisting()
    //mail:string;

    //@IsString()
    //@Length(1, 16)
    //// probleme via 42 bc pas de mdp !!! a voir !!
    //password:string;

=======
>>>>>>> entity_mel
    status: UserStatus;

    @IsString()
    @IsOptional()
    //@isJWT() pour l'authentification
    authToken: string;

  //  @IsString()
  @IsOptional()
    avatarRef:string;
}
