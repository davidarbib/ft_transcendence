import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { myDataSource } from 'src/app-data-source';
import { validate } from 'class-validator';

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
    validate(usrDto).then(errors => {
      if (errors.length > 0)
        console.log('validation failed. errors: ', errors)
      else
        myDataSource.getRepository(User).save(usrDto);
    });
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
    const usrDto = new User();
    const {login, mail, password} = updateUserDto;

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
