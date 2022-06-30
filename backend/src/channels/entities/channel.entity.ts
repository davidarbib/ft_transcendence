import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, BaseEntity , JoinColumn} from "typeorm";
import { ChanParticipant } from "src/chan-participants/entities/chan-participant.entity"
import { Messages } from "src/messages/entities/message.entity"

export enum ChanType
{
    DM = 'dm',
    PUBLIC = 'public',
    PRIVATE = 'private',
    PASSWD = 'passwd'
}

@Entity()
export class Channel extends BaseEntity
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
        nullable: false,
        enum : ChanType,
        default: ChanType.DM
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
    @OneToMany(() => Messages, (message : Messages) => message.chan)
    messages: Messages[];
}
