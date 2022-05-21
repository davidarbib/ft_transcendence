import { IsBoolean, isBoolean, IsDate, IsObject, IsOptional, IsString, Length } from "class-validator";
import { ChanType } from "../entities/channel.entity";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity";
import { Message } from "src/messages/entities/message.entity";
import { BaseEntity } from "typeorm";
export class CreateChannelDto extends BaseEntity{

    @IsString()
    @Length(1,10)
    name:string;

    type:ChanType;
    @IsString()
    @IsOptional()
    password: string;

  //  participants : ChanParticipant

 //   messages: Message;
    
}
