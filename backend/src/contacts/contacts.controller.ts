import { Controller, Get, Post, Body, Patch, UseGuards,  Param, Delete, ConsoleLogger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
@UseGuards(JwtGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @Post()
  create(@Body() createContactDto : CreateContactDto) {
    const contactDto = plainToClass(CreateContactDto, createContactDto);
   User.findOne({where : {login:contactDto.followedlogin}}).then(user => {
     if (!user)
       return;
      return this.contactsService.create(contactDto);
   })
  }

  @Get()
  findAll() {
    return this.contactsService.findAll();
  }

 /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }*/

  @Get(':login/friend')
  all_friend(@Param('login') login:string)
   {
      return this.contactsService.all_friend(login);
  }
  // MAYBE ajouter request ??? si le front  a du mal ?
  @Get(':login/:followedlogin/block')
  block_bool(@Param('login') login:string,  @Param('followedlogin') followedlogin:string)
   {
    User.findOne({where : {login:followedlogin}}).then(user => {
      if (!user)
        return;
      })
      return this.contactsService.block_bool(login, followedlogin);
}
  // MAYBE ajouter request ??? si le front  a du mal ?
  @Patch(':id/:loginfollo/block')
  update(@Param('login') login: string, @Param('loginfollowed')  loginfollow:string , @Body() updatecontact :UpdateContactDto) {
    return this.contactsService.update(login, loginfollow,updatecontact);
  }

  // maybe  request ? 
  @Delete(':login/:followid')
  removeByLogin(@Param('loginUser') login:string, @Param('loginfollowed') loginfollowed:string) {
    User.findOne({where : {login:loginfollowed}}).then(user => {
      if (!user)
        return;
    })
    return this.contactsService.removeByLogin(login, loginfollowed);
    }
/*
  @Delete('/byId/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }*/
}
