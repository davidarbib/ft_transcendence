import { IsBoolean, IsString } from "class-validator";
export class CreateContactDto {

 //   @IsString()
    userLogin:string;

  //  @IsString()
    followedlogin:string;

  //  @IsBoolean()
    block:boolean;
}
