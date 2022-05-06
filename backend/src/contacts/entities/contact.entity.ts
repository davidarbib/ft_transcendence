import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export enum ContactStatus
{
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    BLOCK = 'blocked'
}

@Entity()
export class Contact {
    
    @ApiProperty()
    @Column({
        type : "enum",
        nullable: false
    })
    status: ContactStatus; 
    
    @ApiProperty()
    @Column({
        type : "string",
        nullable: false
    })
    senderId: string

    @ApiProperty()
    @Column({
        type : "string",
        nullable: false
    })
    receiverId: string
}