import { Injectable } from '@nestjs/common';
import { myDataSource } from 'src/app-data-source';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChanType } from 'src/channels/entities/channel.entity';
import { UserStatus } from 'src/users/entities/user.entity';
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
user.login = 'user_base1';
user.mail = 'user_base1@randomail.com';
user.status = UserStatus.OFFLINE;
user.password='1234';
user.authToken="1234";
user.winCount=0;
user.lossCount=0;
await myDataSource.getRepository(User).save(user);
/*
* channel
*/
    const channel : Channel  = new Channel;
    channel.name = "channel_base0";
    channel.type = ChanType.PRIVATE;
/*
*
*/
    return "data insert";
   }
}