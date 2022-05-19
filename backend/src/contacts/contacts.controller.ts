import { Controller, Get, Post, Body, Patch, Param, Delete, ConsoleLogger } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
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
  @Get('/friend/:login')
  all_friend(@Param('login') login:string)
   {
      return this.contactsService.all_friend(login);
  }
  @Get(':login/:id')
  block_bool(@Param('login') login:string,  @Param('id') id:string)
   {
    User.findOne({where : {login:id}}).then(user => {
      if (!user)
        return;
      })
      return this.contactsService.block_bool(login, id);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':login')
  removeByLogin(@Body() createContactDto : CreateContactDto) {
    User.findOne({where : {login:createContactDto.followedlogin}}).then(user => {
      if (!user)
        return;
    })
    return this.contactsService.removeByLogin(createContactDto);
    }

  @Delete('/byId/:id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
