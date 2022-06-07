import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { myDataSource } from 'src/app-data-source';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
 create(createUserDto: CreateUserDto) {
    return myDataSource.getRepository(User).save(createUserDto);
  }

  findAll() {
    const userrepo = myDataSource.getRepository(User);
    return userrepo.find();
  }

 /* findName(login:string)
  {
    const userRepository = myDataSource.getRepository(User);
    return userRepository.findOne({ where: { login} })
  }*/
  findOne(id:string) {
    console.log(`id : ${id}`);
    const userRepo = myDataSource.getRepository(User);
    return userRepo.findOne({ where: {id
     } });
  }

  async update(usr: User, updateUserDto: UpdateUserDto) {
    const {username} = updateUserDto;
    usr.username = username;
   return  myDataSource.getRepository(User).save(usr);
  }
  async dfa_update(usr:User, updatedto : UpdateUserDto)
  {
    const {doubleFA} = updatedto;
    usr.doubleFA = doubleFA;
    return  myDataSource.getRepository(User).save(usr);
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

  async switchStatus(id: string, status: UserStatus)
  {
    const userrepo = myDataSource.getRepository(User);
    const usrToUpdate= await userrepo.findOneBy({id});
    usrToUpdate.status = status;
    return userrepo.save(usrToUpdate);
  }

  async faker() : Promise<User>
  {
    const user = await myDataSource.getRepository(User).findOne({
      where : {
        login: 'faker'
      }
    })
    return user;
  } 
}
