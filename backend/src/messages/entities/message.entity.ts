import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Channel } from "src/channels/entities/channel.entity";

@Entity()
export class Messages {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    content: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    login: string;

    @ApiProperty()
    @ManyToOne(type => User, (user) => user.messages)
    author: User;

    @ApiProperty()
    @ManyToOne(() => Channel, (channel) => channel.messages)
    chan: Channel;
    
    @ApiProperty()
    @Column({
        type: "timestamp",
        nullable: false
    })
    time: Date;
}