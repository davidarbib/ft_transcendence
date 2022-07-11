import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UseGuards } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { ChanParticipantsService } from './chan-participants.service';
import { UpdateChanParticipantDto } from './dto/update-chan-participant.dto';
import { ChanParticipant, ChanPartStatus } from './entities/chan-participant.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {HttpException, HttpStatus} from '@nestjs/common'
@Controller('chan-participants')
@UseGuards(JwtGuard)
export class ChanParticipantsController {
  constructor(private readonly chanParticipantsService: ChanParticipantsService) {}

  @Post()
  async create(@Param('name') name :string , @Request() req) {
  const usr: User = req.user;
  const chan= await myDataSource.getRepository(Channel).findOneBy({name});
//if (chan.participants.includes(usr.chanParticipations[0])) return;
// si la ligne ne marche pasfo boucle sur usr.chanParticipant  
  const chanPart : ChanParticipant = new ChanParticipant;
  chanPart.participant =  usr;
  const channel = await myDataSource.getRepository(Channel).findOneBy({name :name});
  chanPart.chan = channel;
    return await myDataSource.getRepository(ChanParticipant).save(chanPart);
  }
/*
  @Get()
  findAll() {
    return this.chanParticipantsService.findAll();
  }*/
/*
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.chanParticipantsService.findOne(name);
  }*/

  @Get('owner/:name')
  async owner(@Param('name') name: string) {
   let  owner: User = new User;
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.privilege == ChanPartStatus.OWNER)
        {
            owner = element.participant;
          }
        }
      })
      return owner;
  }

  @Get('admin/:name')
  async admin(@Param('name') name: string) {
   let  admin: User[] = [];
    const list = await myDataSource.getRepository(ChanParticipant).find({relations : ['participant', 'chan']});
    list.forEach( element => {
      if (element.chan && element.participant)
      {
        if (element.chan.name == name && element.privilege == ChanPartStatus.ADMIN)
        {
            admin.push(element.participant);
          }  
        }
      })
      return admin;
  }

  @Patch(':name')
  async update(@Param('name') name: string, @Body() updateChanParticipantDto: UpdateChanParticipantDto, @Request() req) {

    const usr : User = req.user;
    const arr = await myDataSource.getRepository(ChanParticipant).find({relations:['participant', 'chan']});
    arr.forEach(element => {
        if (element.chan && element.participant)
        {
          if ( element.chan.name == name)
          { 
            if (element.participant.login == usr.login && element.chan.name == name)
            {
        
            
             if (element.privilege == ChanPartStatus.NORMAL)
            throw new HttpException({
             status: HttpStatus.FORBIDDEN,
             error: 'NOT ALLOWED',
           }, HttpStatus.FORBIDDEN);

           return this.chanParticipantsService.update(name, updateChanParticipantDto, element);
            }
          }
        }
    })
  }
/*
  @Patch(':name')
  update(@Param('name') name: string, @Body() updateChanParticipantDto: UpdateChanParticipantDto, @Request() req) {
    const usr : User = req.user.user;

    return this.chanParticipantsService.update(name, updateChanParticipantDto);
  }*/
/*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chanParticipantsService.remove(id);
  }
*/
}