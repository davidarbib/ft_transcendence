import { GameState, Vector2D, PowerUp } from "./gameState";
import * as param from "./constants";
import { initialize } from "passport";

interface GameOptions
{
    winThresh : number,
    p1Handicap: number,
    p2Handicap: number,
}

export class Game
{
    private state : GameState;

    constructor
    (
        winThresh : number = param.WINTHRESH,
        p1Handicap : number = param.HANDICAP,
        p2Handicap : number = param.HANDICAP,
    )
    {
        this.init({winThresh, p1Handicap, p2Handicap});
    }

    private init(options: GameOptions)
    {
        //TODO four-angle random direction 
        const ballVector : Vector2D = {
            x : 0,
            y : 0
        }

        this.state.ball = {
            xPos: param.BALLINITX,
            yPos: param.BALLINITY,
            size: param.BALLSIZE,
            velocity: param.BALLVELOCITY,
            direction: ballVector,
        };

        this.state.player1 = {
            xPos: param.P1PADX,
            yPos: param.PADY,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p1Handicap,
            velocity: param.PADVELOCITY,
        }

        this.state.player2 = {
            xPos: param.P2PADX,
            yPos: param.PADY,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p2Handicap,
            velocity: param.PADVELOCITY,
        }
    }
    
    public loop()
    {

    }
}