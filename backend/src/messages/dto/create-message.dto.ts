import { IsString } from "class-validator";
import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/users/entities/user.entity";

export class CreateMessageDto {

    @IsString()
    content:string;

    author: User;
    chan : Channel;
}
