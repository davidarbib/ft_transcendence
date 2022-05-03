import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
