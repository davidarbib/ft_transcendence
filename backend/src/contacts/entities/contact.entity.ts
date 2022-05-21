import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Contact extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type : "boolean",
        default: false,
    })
    block: boolean; 

    @ApiProperty()
    @Column({
        type : "varchar",
        nullable: false
    })
    userLogin: string

    @ApiProperty()
    @Column({
        type : "varchar",
        nullable: false
    })
    followedLogin: string
     //afficher le blockage mm fo dire o front de faire un tchek sur ca !! 

}