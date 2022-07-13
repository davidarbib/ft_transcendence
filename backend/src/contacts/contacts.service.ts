import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  async create(login:string, target:string) {
    const newContact = new Contact;
    newContact.userLogin = login;
    newContact.followedLogin = target;
    return myDataSource.getRepository(Contact).save(newContact);
  }
  
  findAll() {
    return myDataSource.getRepository(Contact).find();
  }

  findOne(id:string) {

    return myDataSource.getRepository(Contact).findOneBy({id});
  }

  async update(login:string, loginfollowed:string, blocked: UpdateContactDto) {

    const test =await  Contact.findOne({where : {userLogin: login, followedLogin: loginfollowed}})
    const {block} = blocked;
    test.block= block;
    return  myDataSource.getRepository(Contact).save(test);
  }
  
  async block_bool(login:string, followedlogin:string)
  {
    const test  =await  myDataSource.getRepository(Contact).findOne({where : {userLogin: login, followedLogin: followedlogin}})
    if (test)
    {
      if (test.block == true)
       return true;
    }
    return false;
  }

  async all_friend(login:string)
  {
    const lol = [];
    const test = await Contact.find({where : {userLogin: login}});
    for( let elem of test)
    {
      const lole =  await myDataSource.getRepository(User).findOne({where :{login: elem.followedLogin}});
      lol.push(lole);
    }
    return lol;  
  }

  async  remove(id:string) {
    const contactRepo = myDataSource.getRepository(Contact);
    const contactToRemove = await contactRepo.findOneBy({id});
    return contactToRemove.remove();
  }

  async removeByLogin(login:string, loginfollowed:string)
  {
    const frienshipToDelete = await Contact.findOne({where : {userLogin: login, followedLogin: loginfollowed}})
      frienshipToDelete.remove();  
    }
  }
