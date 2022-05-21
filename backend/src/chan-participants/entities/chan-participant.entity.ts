import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Channel } from "src/channels/entities/channel.entity";
import { timeStamp } from "console";

@Entity()
export class ChanParticipant extends BaseEntity{
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @ManyToOne(() => User, (user) => user.id)
    participant: User;

    @ApiProperty()
    @ManyToOne(() => Channel, (channel) => channel.id)
    chan: Channel;

    @ApiProperty()
    @Column({
        type: "boolean",
        nullable: false
    })
    admin: boolean;

    @ApiProperty()
    @Column({
        type: "boolean",
        nullable: false
    })
    mute: boolean;

    @ApiProperty()
    @Column({
        type: "boolean",
        nullable: false
    })
    ban: boolean;

    @ApiProperty()
    @Column({
        type: "timestamp",
        nullable: true
    })
    end_timestamp: Date;
}
