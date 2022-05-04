import { DataSource } from "typeorm"
import { User } from './users/entities/user.entity';
import { Message } from './messages/entities/message.entity';

export const myDataSource = new DataSource({
    type: "postgres",
    host: "db",
    username: "transcended",
    password: "transcended",
    database: "pong_db",
    entities: [ User, Message ],
    synchronize: true,
    logging: false
})

//    entities: [ "dist /**/*.entity{.ts,.js}" ],