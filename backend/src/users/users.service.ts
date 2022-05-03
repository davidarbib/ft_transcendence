import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { DataSource } from 'typeorm';
import { myDataSource } from 'src/app-data-source';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async insertUser() : Promise<string>
  {
    const user : User = new User;
    user.login = 'jojo';
    user.mail = 'jojo@randomail.com';
    user.status = UserStatus.INGAME;
    await myDataSource.getRepository(User).save(user);
    return "my user is created";
  }
}
