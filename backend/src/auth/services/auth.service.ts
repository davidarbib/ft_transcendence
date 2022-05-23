import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source'
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity'
import { AuthenticationProvider } from './auth';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService implements AuthenticationProvider
{
    constructor(private userRepo : Repository<User>)
    {
      this.userRepo = myDataSource.getRepository(User);
    }

    async validateUser(details: UserDetails)
    {
      const { login } = details;
      const user = this.userRepo.findBy({login: login});
      if (user)
        return user;
      //const newUser = await this.createUser(details);
      return this.createUser(details);
    }
      
    createUser(details: UserDetails)
    {
      console.log(`Creating user : ${details.login}`);
      const user = this.userRepo.create(details);
      return this.userRepo.save(user);
    }

    findUser(login42: string): Promise<User> | undefined
    {
      return this.userRepo.findOne(
      { 
        where:
        { login: login42, }
      })
    }
}
