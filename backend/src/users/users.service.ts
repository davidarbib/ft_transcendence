import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User, UserStatus} from './entities/user.entity';
import {Repository} from 'typeorm';
import {myDataSource} from 'src/app-data-source';
import {Match} from 'src/matches/entities/match.entity';
import {Player} from '../players/entities/player.entity';

export interface historic {
  winner: boolean;
  vs: string;
  score1: number;
  score2: number;
}

@Injectable()
export class UsersService {
  constructor(private userRepo: Repository<User>) {
    this.userRepo = myDataSource.getRepository(User);
  }
  payload: historic[] = [];
  create(createUserDto: CreateUserDto) {
    return myDataSource.getRepository(User).save(createUserDto);
  }

  /*
  async findHistoric(login: string) {
    console.log("------------------------");
    const historicRequest = myDataSource
      .createQueryBuilder()
      .select(['player.score', 'player.winner', 'user.username'])
      .from(Player, 'player')
      .innerJoin(User, 'user', 'user.id = player.userRef')
      .innerJoin(Match, 'match', 'player.matchRef = match.id')
      .where('match.active = :active', { active: false })
      .andWhere('user.login = :login', { login: login })
      .andWhere('user.login = :login', { login: login });

    console.log(historicRequest.getMany());
    console.log("------------------------");
    return await historicRequest.getMany();
  }
  */

  async findHistoric(username: string) {
    this.payload = [];
    const arr = [];
    const matches = await myDataSource
      .getRepository(Match)
      .find({ relations: ['players'] });
    //console.log(`p1 login ${match[0].players[0].userRef.login}`);
    matches.forEach((match) => {
      arr.push(match.players);
    });
    console.log(matches);
    arr.forEach((players) => {
      if (players[0].userRef.username == username) {
        this.payload.push({
          winner: players[0].winner,
          vs: players[1].userRef.username,
          score1: players[0].score,
          score2: players[1].score,
        });
      } else {
        if (players[1].userRef.username == username) {
          this.payload.push({
            winner: players[1].winner,
            vs: players[0].userRef.username,
            score1: players[1].score,
            score2: players[0].score,
          });
        }
      }
    });

    return this.payload;
  }

  findAll() {
    return this.userRepo.find();
  }

  async findName(login: string) {
    const userRepository = await myDataSource.getRepository(User);
    return userRepository.findOne({ where: { login } });
  }

  findOne(id: string) {
    console.log(`id : ${id}`);
    return this.userRepo.findOne({ where: { id } });
  }

  async update(usr: User, updateUserDto: UpdateUserDto) {
    let bool = true;
    const { username } = updateUserDto;
    const listUser = await myDataSource.getRepository(User).find();
    listUser.forEach((element) => {
      if (element.username == username) bool = false;
    });
    if (bool == true) {
      usr.username = username;
      return myDataSource.getRepository(User).save(usr);
    }
  }

  async dfa_update(usr: User, updatedto: UpdateUserDto) {
    const { doubleFA } = updatedto;
    usr.doubleFA = doubleFA;
    return myDataSource.getRepository(User).save(usr);
  }

  findByLogin(login: string) {
    return this.userRepo.findOne({
      where: { login: login },
    });
  }

  async remove(id: string) {
    const usrToUpdate = await this.userRepo.findOneBy({ id });
    return usrToUpdate.remove();
  }

  async insertUser(): Promise<string> {
    const user: User = new User();
    user.login = 'jojo';
    user.username = 'jojo';
    user.status = UserStatus.INGAME;
    user.authToken = '1234';
    user.winCount = 0;
    user.lossCount = 0;
    await this.userRepo.save(user);
    return 'my user is created';
  }

  async switchStatus(id: string, status: UserStatus) {
    const usrToUpdate = await this.userRepo.findOneBy({ id });
    usrToUpdate.status = status;
    return this.userRepo.save(usrToUpdate);
  }

  async faker(): Promise<User> {
    const user = await myDataSource.getRepository(User).findOne({
      where: {
        login: 'faker',
      },
    });
    return user;
  }

  async setTwoFactorSecret(userId: string, secret: string) {
    return this.userRepo.update(userId, { twoFactorSecret: secret });
  }

  async turnOnTwoFactor(userId: string) {
    return this.userRepo.update(userId, { twoFactorEnabled: true });
  }

  async turnOffTwoFactor(userId: string) {
    return this.userRepo.update(userId, { twoFactorEnabled: false });
  }

  async incWinCount(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    user.winCount++;
    return this.userRepo.save(user);
  }

  async incLossCount(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    user.lossCount++;
    return this.userRepo.save(user);
  }

  async getUserName(userId: string): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    return user.username;
  }
}
