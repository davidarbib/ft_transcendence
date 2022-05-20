import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';
import { UserStatus } from 'src/users/entities/user.entity';
import { Contact } from 'src/contacts/entities/contact.entity';
import { ChanParticipant } from 'src/chan-participants/entities/chan-participant.entity';
import { Match } from 'src/matches/entities/match.entity';
import { Player } from 'src/players/entities/player.entity';
@Injectable()
export class createDataService{


   async insertdata(): Promise<string>
   {
/*
*   MSG
*/
const msg : Message = new Message;
msg.content =  'Message de base, afin de remplir la base de donnees';
msg.time = new Date();
await myDataSource.getRepository(Message).save(msg);
console.log("my msg is created");
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
*   CONTACT
*   il manque le nom de l'ami !!!!! dans l 'entity voir avec daav
*/
    //const contact : Contact = new Contact;
/*
*   CHAN PARTICIPANT
*/
    const chanPart : ChanParticipant = new ChanParticipant;
    chanPart.participant = user;
   chanPart.chan = channel;
    chanPart.admin = false;
    chanPart.mute = true;
    chanPart.ban = false;
    await myDataSource.getRepository(ChanParticipant).save(chanPart);
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

        return "data insert";
   }
}