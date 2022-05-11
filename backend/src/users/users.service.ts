import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { myDataSource } from 'src/app-data-source';
import { validate, validateOrReject } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class UsersService {
 create(createUserDto: CreateUserDto) {
    return myDataSource.getRepository(User).save(createUserDto);
  }

  findAll() {
    const userrepo = myDataSource.getRepository(User);
    return userrepo.find();
  }

  findOne(id:string) {
    const userrepo = myDataSource.getRepository(User);

    return userrepo.findOneBy({id});
  }

  async update(id:string, updateUserDto: UpdateUserDto) {
    const userrepo = myDataSource.getRepository(User);

    const usrToUpdate= await userrepo.findOneBy({id});
    const {login, mail, password} = updateUserDto;
    usrToUpdate.login = login;
   // if (usrToUpdate.login.length > 10)
    usrToUpdate.mail = mail;
    usrToUpdate.password = password;
    const errors = await validate (usrToUpdate);
    if ( errors.length > 0)
      throw new BadRequestException('validate failed');
    myDataSource.getRepository(User).save(usrToUpdate);
  
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const userrepo = myDataSource.getRepository(User);

    const usrToUpdate= await  userrepo.findOneBy({id});

    return await userrepo.delete(usrToUpdate);
  }

  async insertUser() : Promise<string>
  {
    const user : User = new User;
    user.login = 'jojo';
    user.mail = 'jojo@randomail.com';
    user.status = UserStatus.INGAME;
    user.password='jojo';
    user.authToken="1234";
    user.winCount=0;
    user.lossCount=0;
    await myDataSource.getRepository(User).save(user);
    return "my user is created";
  }
}
