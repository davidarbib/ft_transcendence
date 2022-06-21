import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Match } from "src/matches/entities/match.entity";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Player {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user : User) => user.games)
    userRef: User;

    @ManyToOne(() => Match, (match : Match) => match.players)
    matchRef: Match;

    @Column({
        type : "int8",
        nullable : false,
        default: 0 
    })
    score: number;

    @Column({
        type : "boolean",
        nullable : false,
        default: false 
    })
    winner: boolean;
}
