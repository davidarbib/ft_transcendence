import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity"
import { Message } from "src/messages/entities/message.entity"

export enum ChanType
{
    DM = 'dm',
    PUBLIC = 'public',
    PRIVATE = 'private',
    PASSWD = 'passwd'
}

@Entity()
export class Channel
{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: false
    })
    name: string;

    @ApiProperty()
    @Column({
        type: "enum",
        nullable: false
    })
    type: ChanType;

    @ApiProperty()
    @Column({
        type: "varchar",
        nullable: true
    })
    password: string;

    @ApiProperty()
    @OneToMany(() => ChanParticipant, (chanParticipant : ChanParticipant) => chanParticipant.chan)
    participants: ChanParticipant[];

    @ApiProperty()
    @OneToMany(() => Message, (message : Message) => message.chan)
    messages: Message[];
}
