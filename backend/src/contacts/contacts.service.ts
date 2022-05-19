import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
   async create(users : CreateContactDto) {
    

    const contact = new Contact;
    const user = await myDataSource.getRepository(User).findOne({where : {login: users.userLogin}});
    contact.userId = user.id;
    const followed = await myDataSource.getRepository(User).findOne({where : {login: users.followedlogin}});
    contact.followedId = followed.id;
    myDataSource.getRepository(Contact).save(contact);
  }

  findAll() {
    return myDataSource.getRepository(Contact).find();
  }

  findOne(id:string) {

    return myDataSource.getRepository(Contact).findOneBy({id});
  }

  update(id:string, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

 async block_bool(login:string, id:string)
{
  const usr = await myDataSource.getRepository(User).findOne({where : {login}});
  const followed = await myDataSource.getRepository(User).findOne({where : {login:id}});
  const test = await Contact.findOne({where : {userId: usr.id, followedId: followed.id}})
  if (test.block == false)
    return false;
  return true;
}
async all_friend(login:string)
{
  const usr = await myDataSource.getRepository(User).findOne({where : {login}});
  const test = await Contact.findOne({where : {userId: usr.id}})
  console.log(test);
  
}
 async  remove(id:string) {
    const contactRepo = myDataSource.getRepository(Contact);
    const contactToRemove = await contactRepo.findOneBy({id});
    return contactToRemove.remove();
  }
  async removeByLogin(createContactDto: CreateContactDto)
  {
    const usr = await myDataSource.getRepository(User).findOne({where : {login:createContactDto.userLogin}});
    const friendToDelete = await myDataSource.getRepository(User).findOne({where : {login:createContactDto.followedlogin}});
    const test = await Contact.findOne({where : {userId: usr.id, followedId: friendToDelete.id}})
      test.remove();  
    }
}
