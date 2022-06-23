import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { MatchesService } from 'src/matches/matches.service';
import { Match } from 'src/matches/entities/match.entity';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { Player } from 'src/players/entities/player.entity';
import { PlayersService } from 'src/players/players.service';

@WebSocketGateway()
export class GamesGateway {


  constructor(private readonly gamesService: GamesService, public readonly playerService : PlayersService,  public readonly matchesService : MatchesService) {
  }

  @SubscribeMessage('createGame')
  async create(@MessageBody('player1') user: User, @MessageBody('player2') user1: User) {
  
   return this.gamesService.create( user, user1);
  }
  @SubscribeMessage('matchMakingList')
  userWaiting(@MessageBody('user') usr:User) {
    return this.gamesService.userWaiting(usr);
  }
  @SubscribeMessage('stopmatchMakingList')
  userStopWaiting(@MessageBody('user') usr:User) {
    return this.gamesService.userStopWaiting(usr);
  }
/*
  @SubscribeMessage('findAllGames')
  findAll() {
    return this.gamesService.findAll();
  }*/
  @SubscribeMessage('matchmaking')
  async matchmaking() {
    return  await this.gamesService.matchmaking()
  }

  @SubscribeMessage('findOneGame') // return the matches
  async findOne(@MessageBody() id: string) {
    return await this.gamesService.findOne(id);
  }
}
