import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  async create(contact : CreateContactDto) {
    const newContact = new Contact;
    newContact.userLogin = contact.userLogin;
    newContact.followedLogin = contact.followedlogin; 
    myDataSource.getRepository(Contact).save(newContact);
  }

  findAll() {
    return myDataSource.getRepository(Contact).find();
  }

  findOne(id:string) {

    return myDataSource.getRepository(Contact).findOneBy({id});
  }

  async update(login:string, loginfollowed:string, block:boolean) {

    const usr = await myDataSource.getRepository(User).findOneBy({login});
    const usrfollowed =await  myDataSource.getRepository(User).findOneBy({login:loginfollowed});
    const test =await  Contact.findOne({where : {userLogin: usr.login, followedLogin: usrfollowed.login}})
    test.block = block;
    console.log(test);
    myDataSource.getRepository(Contact).save(test);
   // return `This action updates a #${id} contact`;
  }
  
  async block_bool(login:string, id:string)
  {
    const usr = await myDataSource.getRepository(User).findOne({where : {login}});
    const followed = await myDataSource.getRepository(User).findOne({where : {login:id}});
    const test =await  Contact.findOne({where : {userLogin: usr.login, followedLogin: followed.login}})
    if (test.block == false)
      return false;
    return true;
  }

  async all_friend(login:string)
  {
    const lol = [];
    const usr = await myDataSource.getRepository(User).findOne({where : {login}});
    const test = await Contact.find({where : {userLogin: usr.login}});
    for( let elem of test)
    {
      let lole =  await myDataSource.getRepository(User).findOne({where :{id: elem.followedLogin}});
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
    const usr = await myDataSource.getRepository(User).findOne({where : {login:login}});
    const friendToDelete = await myDataSource.getRepository(User).findOne({where : {login:loginfollowed}});
    const frienshipToDelete = await Contact.findOne({where : {userLogin: usr.login, followedLogin: friendToDelete.login}})
      friendToDelete.remove();  
    }
  }
