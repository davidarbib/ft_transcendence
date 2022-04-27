import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { myDataSource } from 'src/app-data-source';

@Injectable()
export class UsersService
{ 
  constructor() { }

  async insertUser() : Promise<string>
  {
    const user : User = new User;
    user.login = 'jojo'
    user.firstName = 'Jojo';
    user.lastName = 'lasticot';
    await myDataSource.getRepository(User).save(user);
    return "my user is created";
  }

  async listUsers() : Promise<any>
  {
    return myDataSource.manager.find(User);
  }
}
