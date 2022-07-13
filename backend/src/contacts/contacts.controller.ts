import { Controller, Get, Post, Body, Patch, UseGuards,  Param, Delete, ConsoleLogger, Request} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { myDataSource } from 'src/app-data-source';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/users/entities/user.entity';
import { Contact } from './entities/contact.entity';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { JwtTwoFaGuard } from 'src/auth/guards/jwtTwoFa.guard';

@Controller('contacts')
@UseGuards(JwtTwoFaGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}
  @Post(':id')
  async create(@Request() req, @Param('login') login:string ) {
    console.log(req.user);
    console.log(login);
    // const contactDto = plainToClass(CreateContactDto, createContactDto);
    // console.log(contactDto.followedlogin);
    // const contact = await myDataSource.getRepository(Contact).findOne({where :{userLogin:contactDto.userLogin, followedLogin: contactDto.followedlogin}})
    // if (contact)
    //   return ;
    // return this.contactsService.create(contactDto);
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
    console.log(login);
    console.log("YES");
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
