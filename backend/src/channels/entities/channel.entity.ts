import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity"

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
    @ManyToOne(() => ChanParticipant, (chanParticipant : ChanParticipant) => chanParticipant.chan)
    participants: ChanParticipant[];

    @ApiProperty()
    @ManyToOne(() => Message, (message : Message) => message.chan)
    messages: Message[];
}
