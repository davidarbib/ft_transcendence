import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';
import { UserStatus } from 'src/users/entities/user.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import { ChanParticipant, ChanPartStatus } from 'src/chan-participants/entities/chan-participant.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';

@Injectable()
export class createDataService{


   async insertdata(): Promise<string>
   {

const contact1 : Contact = new Contact;
contact1.userLogin = "Whaou";
contact1.followedLogin = "faker"

/*
*   MSG
*/

/*
*   USER
*/
const user : User = new User;
user.login = 'user_base';
user.username = 'user_base';
user.status = UserStatus.OFFLINE;
user.authToken="1234";
await myDataSource.getRepository(User).save(user);

const user1 : User = new User;
user1.login = 'user_bas1';
user1.username = 'user_bas1';
user1.status = UserStatus.ONLINE;
user1.authToken="jjjjjj";
await myDataSource.getRepository(User).save(user1);

const faker : User = new User;
faker.login = 'faker';
faker.username = 'faker';
faker.status = UserStatus.OFFLINE;
faker.authToken="uhafe";
faker.winCount=4;
faker.lossCount=8;
await myDataSource.getRepository(User).save(faker);

console.log("users are created");

/*
* channel
*/
    const channel : Channel  = new Channel;
    channel.name = "channel_base0";
    channel.type = ChanType.PRIVATE;
    await myDataSource.getRepository(Channel).save(channel);
    console.log("chan are created");

/*
*   CHAN PARTICIPANT
*/
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = user;
    chanPart.chan = channel;
    chanPart.privilege = ChanPartStatus.NORMAL;
    chanPart.mute = true;
    chanPart.ban = false;
    await myDataSource.getRepository(ChanParticipant).save(chanPart);

    const chanPart1 : ChanParticipant = new ChanParticipant;
    chanPart1.participant = faker;
    chanPart1.chan = channel;
    chanPart1.privilege = ChanPartStatus.ADMIN;
    chanPart1.mute = false;
    chanPart1.ban = false;
    await myDataSource.getRepository(ChanParticipant).save(chanPart1);

/*
*  MATCH
*/
    const match : Match = new Match;
    match.active = true;
 //   match.players = players;
    await myDataSource.getRepository(Match).save(match);
/*
* PLAYER
*/
    const player : Player = new Player;
    player.matchRef = match;
    player.userRef = user;
    player.score = 0;
    await myDataSource.getRepository(Player).save(player);

    const contact : Contact = new Contact;

    contact.userLogin = faker.login;
    contact.followedLogin = user1.login;
    await myDataSource.getRepository(Contact).save(contact);

  /*  const contact2 : Contact = new Contact;

    contact.userLogin = faker.login;
    contact.followedLogin = user.login;
    await myDataSource.getRepository(Contact).save(contact);*/
        return "data insert";
   }
}