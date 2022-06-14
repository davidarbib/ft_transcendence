import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source'
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User, UserStatus } from 'src/users/entities/user.entity'
import { AuthenticationProvider } from './auth';
import { UserDetails } from 'src/utils/types';
import { JwtService } from '@nestjs/jwt';
import { JwtTwoFaPayload } from 'src/utils/types';

@Injectable()
export class AuthService implements AuthenticationProvider
{
    constructor (
      private userRepo : Repository<User>,
      private userService : UsersService,
      private jwtService : JwtService,
    )
    {
      this.userRepo = myDataSource.getRepository(User);
    }

    public async login(user: any, twoFactorAuthentified: boolean = false)
    {
        const payload : JwtTwoFaPayload = {
            login: user.login, 
            sub: user.id,
            twoFactorAuthentified: twoFactorAuthentified,
        }
        return { accessToken: this.jwtService.sign(payload) };
    }

    public async validateUser(details: UserDetails)
    {
      const { login } = details;
      console.log('login: ');
      console.log(login);
      const user = await this.findUser(login);
      if (user) return user;
      return this.createUser(details);
    }
      
    createUser(details: UserDetails)
    {
      const user = this.userRepo.create(details);
      return this.userRepo.save(user);
    }

    findUser(login: string): Promise<User> | undefined
    {
      return this.userRepo.findOne(
      { 
        where:
        { login: login, }
      })
    }
}
