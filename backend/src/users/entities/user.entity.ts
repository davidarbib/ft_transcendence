import { ApiProperty } from "@nestjs/swagger";
import { Message } from "src/messages/entities/message.entity";
import { Player } from "src/players/entities/player.entity";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserStatus
{
    ONLINE = 'online',
    OFFLINE = 'offline',
    INGAME = 'ingame',
    SPECTATE = 'spectate'
}

// PASSPORT / PASSPORT42 //PASSPORTJWT  // JWT NESTJS
//pour auth 42 cree un module expres pour ca, apres dans API (dans 42)
@Entity()
export class User extends BaseEntity
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })
    login: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    username: string;

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
        nullable: true
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

    @ApiProperty()
    @Column({
        type: "bool",
        default: false 
    })
    twoFactorEnabled: boolean;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: true
    })
    twoFactorSecret: string;
    
/*    @ApiProperty()
    @Column({
      //  type: "varchar",
        nullable:true
    })
    friend:User[];*/

    @OneToMany(() => Message, message => message.author)
    messages : Message[]

    @OneToMany(() => Player, (player : Player) => player.userRef)
    games : Player[]

    @OneToMany(() => ChanParticipant, (chanParticipant : ChanParticipant) => chanParticipant.participant)
    chanParticipations : ChanParticipant[]
}
