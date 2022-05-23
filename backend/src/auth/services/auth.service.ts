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
  //userRepo = myDataSource.getRepository(User);
    constructor(private userRepo : Repository<User>)
    {
      this.userRepo = myDataSource.getRepository(User);
    }
    
    //async onModuleInit(): Promise<void>
    //async onApplicationBootstrap(): Promise<void>
    async toto()
    {
      let user: UserDetails = 
      {
        login: 'faker',
        username: 'faker',
      } 

      const userTmp = await this.userRepo.find({
        where: {
          login: user.login,
        },
      });
      if (userTmp)
        return ;
      const newUser = this.userRepo.create(user);
      this.userRepo.save(newUser);

      console.log('faker created');
    }

    async validateUser(details: UserDetails)
    {
      //--------------------------
      //let userFake: UserDetails = 
      //{
      //  login: 'faker',
      //  username: 'faker',
      //} 

      ////const userTmp = await this.userRepo.findBy(userFake);
      //const userTmp = await this.userRepo.findBy({login : userFake.login});
      //if (userTmp)
      //  return ;
      //const newUserFake = this.userRepo.create(userFake);
      //this.userRepo.save(newUserFake);

      //console.log('faker created');
      //--------------------------

      const { login } = details;
      const user = this.userRepo.findBy({login: login});
      if (user)
        return user;
      const newUser = await this.createUser(details);
    }
      
    createUser(details: UserDetails)
    {
      console.log(`Creating user : ${details.login}`);
      const user = this.userRepo.create(details);
      return this.userRepo.save(user);
    }

    findUser()
    {
      throw new Error('Method non implemented');
    }
}
