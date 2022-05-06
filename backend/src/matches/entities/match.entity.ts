import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { ApiProperty } from "@nestjs/swagger"
import { Player } from "src/players/entities/player.entity";

@Entity()
export class Match {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ApiProperty()
    @Column({
        type: "boolean",
        nullable: false,
        default: true
    })
    active: boolean;

    @OneToMany(() => Player, (player : Player) => player.matchRef)
    players : Player[]
}
