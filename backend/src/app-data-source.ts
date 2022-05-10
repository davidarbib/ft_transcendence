import { DataSource } from "typeorm"
import { Message } from "./messages/entities/message.entity";
import { User } from './users/entities/user.entity';
import { Player } from './players/entities/player.entity';
import { Contact } from './contacts/entities/contact.entity';
import { Match } from './matches/entities/match.entity';
import { Message } from './messages/entities/message.entity';
import { Channel } from './channels/entities/channel.entity';
import { ChanParticipant } from './chan-participants/entities/chan-participant.entity';

export const myDataSource = new DataSource({
    type: "postgres",
    host: "db",
    username: "transcended",
    password: "transcended",
    database: "pong_db",
<<<<<<< HEAD
    entities: [
        User,
        Contact,
        Player,
        Match,
        Message,
        Channel,
        ChanParticipant ],
=======
    entities: [ User, Message ],
>>>>>>> entity_mel
    synchronize: true,
    logging: false
})

//    entities: [ "dist /**/*.entity{.ts,.js}" ],