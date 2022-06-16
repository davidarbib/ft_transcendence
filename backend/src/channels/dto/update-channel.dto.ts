import { PartialType } from '@nestjs/swagger';
import { CreateChannelDto } from './create-channel.dto';
import { IsString, IsOptional, Length} from "class-validator";
import { ChanType } from '../entities/channel.entity';

export class UpdateChannelDto{ 

    @IsString()
    @IsOptional()
    @Length(1,10)
    password:string;

    type:ChanType;
}
