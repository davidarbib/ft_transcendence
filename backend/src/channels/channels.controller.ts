import { plainToClass } from 'class-transformer';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { myDataSource } from 'src/app-data-source';
import { Channel } from './entities/channel.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Controller, Get, Post,
  Body, Patch, Param, Delete,
  BadRequestException, UseGuards,Request, Res} from '@nestjs/common';

@Controller('channels')
@UseGuards(JwtGuard)
@ApiTags('channels')

export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(@Body() createChannelDto: CreateChannelDto, @Request() req)
  {
    const CreateChannel = plainToClass(CreateChannelDto, createChannelDto);
   const usr: User = req.user;
   console.log(usr.username);
    return this.channelsService.create(CreateChannel, usr);
  }
  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.channelsService.findOne(name);
  }
  @Get('/chan')
  findChan(@Request() req) {
    const usr:User = req.user;
    return this.channelsService.findChan(usr);
  }

  @Get('/chanpriv')
  findChanPriv() {
    return this.channelsService.findChanPriv();
  }


  @Get('/chanpublic')
  findChanPublic() {
    return this.channelsService.findChanPublic();
  }
  
  @Patch('/update/:name')
 async  update(@Param('name') name: string, @Body() updateChannelDto: UpdateChannelDto, @Request() req) {
    const usr: User = req.usr.usr;
    const chan = await myDataSource.getRepository(Channel).findOneBy({name});
    return this.channelsService.update(name, updateChannelDto, usr, chan);
  }
/*
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.channelsService.remove(name);
    );
  }*/
}
