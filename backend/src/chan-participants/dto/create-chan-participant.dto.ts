import { IsBoolean, isBoolean, IsDate, IsObject, IsOptional } from "class-validator";
import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/users/entities/user.entity";

export class CreateChanParticipantDto {

    @IsBoolean()
    admin: boolean;

    @IsBoolean()
    mute: boolean;
    
    @IsBoolean()
    ban: boolean;

    participant: User;
    
    chan : Channel;

    @IsDate()
   // @IsOptional()
    end_timestamp : Date;
}
