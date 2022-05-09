import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { myDataSource } from 'src/app-data-source';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    const usrDto = new User();
    const {login, mail, password, status, authToken, avatarRef, winCount, losscount} = createUserDto;
    usrDto.login = login;
    usrDto.mail = mail;
    usrDto.password = password;
    usrDto.status = status;
    usrDto.authToken = authToken;
    usrDto.avatarRef = avatarRef;
    usrDto.winCount = winCount;
    usrDto.lossCount = losscount;
    myDataSource.getRepository(User).save(usrDto);
  }

  findAll() {
    const userrepo = myDataSource.getRepository(User);

    return userrepo.find();
  }

  findOne(id:string) {
    const userrepo = myDataSource.getRepository(User);

    return userrepo.findOneBy({
      id,
    });
  }

  update(id:string, updateUserDto: UpdateUserDto) {
    const userrepo = myDataSource.getRepository(User);

    const usrToUpdate= userrepo.findOneBy({id});

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
