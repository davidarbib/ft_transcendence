import { IsBoolean, isBoolean, IsDate, IsObject, IsOptional } from "class-validator";
import { Channel } from "src/channels/entities/channel.entity";
import { User } from "src/users/entities/user.entity";
import { ChanPartStatus } from "../entities/chan-participant.entity";

export class CreateChanParticipantDto  {

    privilege: ChanPartStatus;

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
