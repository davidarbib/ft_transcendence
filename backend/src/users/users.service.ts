import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';
import { Repository } from 'typeorm';
import { myDataSource } from 'src/app-data-source';
import { Match } from 'src/matches/entities/match.entity';
export interface historic
{
  winner:boolean;
  vs:string;
  score1:number;
  score2:number;
}

@Injectable()
export class UsersService {

  constructor (private userRepo: Repository<User>)
  {
    this.userRepo = myDataSource.getRepository(User);
  }
  payload : historic[] = [];
  create(createUserDto: CreateUserDto) {
    return myDataSource.getRepository(User).save(createUserDto);
  }

  async findHistoric(login:string)
  {
    console.log(login)
    this.payload =[];
    const arr= [];
    const match = await myDataSource.getRepository(Match).find({relations: ['players']});
    match.forEach(element => {

       arr.push(element.players);
    //   console.log(element.players);
     });
     arr.forEach(element => {
       if (element[0].userRef.login == login)
       {
        console.log("1");
         this.payload.push({winner:element[0].winner, vs:element[1].userRef.login, score1:element[0].score, score2:element[1].score, });
       }
       else if (element[1].userRef.login == login)
       {
        console.log("2");

         this.payload.push({winner:element[1].winner, vs:element[0].userRef.login, score1:element[1].score, score2:element[0].score, });
       }
     })

     return this.payload;
  }
  findAll() {
    return this.userRepo.find();
  }

  async findName(login:string)
  {
    const userRepository = await myDataSource.getRepository(User);
    return userRepository.findOne({ where: { login} })
  }

  findOne(id:string) {
    console.log(`id : ${id}`);
    return this.userRepo.findOne({ where: {id
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

  findByLogin(login:string)
  {
    return this.userRepo.findOne({
      where: { login: login }
    });
  }

  async remove(id: string) {
    const usrToUpdate= await  this.userRepo.findOneBy({id});
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
    await this.userRepo.save(user);
    return "my user is created";
  }

  async switchStatus(id: string, status: UserStatus)
  {
    const usrToUpdate= await this.userRepo.findOneBy({id});
    usrToUpdate.status = status;
    return this.userRepo.save(usrToUpdate);
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

  async setTwoFactorSecret(userId: string, secret: string)
  {
    return this.userRepo.update(userId, {twoFactorSecret: secret});
  }
  
  async turnOnTwoFactor(userId: string)
  {
    return this.userRepo.update(userId, {twoFactorEnabled: true});
  }

  async turnOffTwoFactor(userId: string)
  {
    return this.userRepo.update(userId, {twoFactorEnabled: false});
  }

  async incWinCount(userId: string)
  {
    let user = await this.userRepo.findOne({
      where : { id : userId }
    });
    user.winCount++;
    return this.userRepo.save(user);
  }

  async incLossCount(userId: string)
  {
    let user = await this.userRepo.findOne({
      where : { id : userId }
    });
    user.lossCount++;
    return this.userRepo.save(user);
  }

  async getUserName(userId: string) : Promise<string>
  {
    let user = await this.userRepo.findOne({
      where : { id : userId }
    });
    return user.username;
  }
}
