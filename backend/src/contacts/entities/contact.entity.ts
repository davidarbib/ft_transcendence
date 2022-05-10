import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

export enum ContactStatus
{
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    BLOCK = 'blocked'
}

@Entity()
export class Contact {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "enum",
        enum: ContactStatus,
        nullable: false
    })
    status: ContactStatus; 
    
    @ApiProperty()
    @Column({
        type : "varchar",
        nullable: false
    })
    senderId: string

    @ApiProperty()
    @Column({
        type : "varchar",
        nullable: false
    })
    receiverId: string
}