import { ApiProperty } from "@nestjs/swagger";
import { Message } from "src/messages/entities/message.entity";
import { Player } from "src/players/entities/player.entity";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatus
{
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'ingame',
    SPECTATE = 'spectate'
}

@Entity()
export class User
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    login: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    mail: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    password: string;

    @ApiProperty()
    @Column({
        type : "enum",
        enum : UserStatus,
        default: UserStatus.OFFLINE
    })
    status: UserStatus;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    authToken: string;

    @ApiProperty()
    @Column({
        type : "varchar",
        nullable : true
    })
    avatarRef: string;

    @ApiProperty()
    @Column({
        type: "int8",
        default: 0
    })
    winCount: number;

    @ApiProperty()
    @Column({
        type: "int8",
        default: 0
    })
    lossCount: number;

    @OneToMany(() => Message, (message : Message) => message.author)
    messages : Message[]

    @OneToMany(() => Player, (player : Player) => player.userRef)
    games : Player[]

    @OneToMany(() => ChanParticipant, (chanParticipant : ChanParticipant) => chanParticipant.participant)
    chanParticipations : ChanParticipant[]
}