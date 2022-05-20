import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { myDataSource } from 'src/app-data-source';

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
    //const {login, mail, password} = updateUserDto;
    const {login} = updateUserDto;
    usrToUpdate.login = login;
    //usrToUpdate.mail = mail;
    //usrToUpdate.password = password;
    myDataSource.getRepository(User).save(usrToUpdate);
  
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const userrepo = myDataSource.getRepository(User);

    const usrToUpdate= await  userrepo.findOneBy({id});

    return usrToUpdate.remove();
  }

  async insertUser() : Promise<string>
  {
    const user : User = new User;
    user.login = 'jojo';
    user.username = 'jojo';
    user.status = UserStatus.INGAME;
    user.authToken="1234";
    user.winCount=0;
    user.lossCount=0;
    await myDataSource.getRepository(User).save(user);
    return "my user is created";
  }
}
