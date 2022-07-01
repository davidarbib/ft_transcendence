import { IsBoolean, isBoolean, IsDate, IsObject, IsOptional, IsString, Length } from "class-validator";
import { ChanType } from "../entities/channel.entity";
import { Channel } from "../entities/channel.entity";

import { PartialType} from "@nestjs/swagger";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity";
import { Messages } from "src/messages/entities/message.entity";
export class CreateChannelDto extends Channel
{
    @IsString()
    @Length(1,10)
    name:string;

    type:ChanType;
   
    @IsString()
    @IsOptional()
    password: string;

    participant : ChanParticipant[]

    messages: Messages[];
    
}
