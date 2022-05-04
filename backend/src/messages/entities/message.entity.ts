import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Channel } from "src/channels/entities/channel.entity";

@Entity()
export class Message {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    content: string;

    @ApiProperty()
    @ManyToOne( () => User, (user) => user.id)
    author: User;

 /*   @ApiProperty()
    @ManyToOne( () => Channel, (channel) => channel.id)
    chan: Channel;*/
    
    @ApiProperty()
    @Column({
        type: 'timestamp',
        nullable: false
    })
    time: Date;
}
