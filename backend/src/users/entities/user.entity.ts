import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    @Column({type: "int8"})
    winCount: number;

    @ApiProperty()
    @Column({type: "int8"})
    lossCount: number;
}