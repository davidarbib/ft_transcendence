import { DataSource } from "typeorm"
import { User } from './users/entities/user.entity';
import { Player } from './players/entities/player.entity';
import { Contact } from './contacts/entities/contact.entity';
import { Match } from './matches/entities/match.entity';
import { Channel } from './channels/entities/channel.entity';
import { ChanParticipant } from './chan-participants/entities/chan-participant.entity';

export const myDataSource = new DataSource({
    type: "postgres",
    host: "db",
    username: "transcended",
    password: "transcended",
    database: "pong_db",
    entities: [
        User,
        Contact,
        Player,
        Match,
        Message,
        Channel,
        ChanParticipant ],
    synchronize: true,
    logging: false
})

//    entities: [ "dist /**/*.entity{.ts,.js}" ],