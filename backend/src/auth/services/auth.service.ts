import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source'
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity'
import { AuthenticationProvider } from './auth';

@Injectable()
export class AuthService implements AuthenticationProvider{
    userRepository : Repository<User> = myDataSource.getRepository(User);
    constructor( private usersService: UsersService)
    {
    }

    //async validateUser(username: string, pass: string): Promise<any> {
    //    const user = await this.usersService.findOne(username);
    //    if (user && user.password === pass) {
    //      const { password, ...result } = user;
    //      return result;
    //    }
    //    return null;
    //}
    
    validateUser()
    {
      throw new Error('Method non implemented');
    }

    createUser()
    {
      throw new Error('Method non implemented');
    }

    findUser()
    {
      throw new Error('Method non implemented');
    }
}
