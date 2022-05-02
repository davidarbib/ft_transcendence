import { DataSource } from "typeorm"
import { User } from './users/user.entity';

export const myDataSource = new DataSource({
    type: "postgres",
    host: "db",
    username: "transcended",
    password: "transcended",
    database: "pong_db",
    entities: [ User ],
    synchronize: true,
    logging: false
})

//    entities: [ "dist /**/*.entity{.ts,.js}" ],