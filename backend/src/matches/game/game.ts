import { GameState, Vector2D, PowerUp } from "./gameState";
import * as param from "./constants";
import { initialize } from "passport";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ScoreEvent } from "./score.event";

interface GameOptions
{
    winThresh : number,
    p1Handicap: number,
    p2Handicap: number,
}

interface Ids
{
    gameId: string,
    playerOneId: string,
    playerTwoId: string,
}

export class Game
{
    private state : GameState;

    constructor
    (
        gameId : string,
        playerOneId : string,
        playerTwoId : string,
        winThresh : number = param.WINTHRESH,
        p1Handicap : number = param.HANDICAP,
        p2Handicap : number = param.HANDICAP,
        private emitter: EventEmitter2,
    )
    {
        this.init(
            { gameId, playerOneId, playerTwoId },
            { winThresh, p1Handicap, p2Handicap },
        );
    }

    public getState()
    {
        return this.state;
    }

    private init
    (
        ids: Ids,
        options: GameOptions,
    )
    {
        this.state.id = ids.gameId;

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
            id: ids.playerOneId, 
            xPos: param.P1PADX,
            yPos: param.PADY,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p1Handicap,
            velocity: param.PADVELOCITY,
        }

        this.state.player2 = {
            id: ids.playerTwoId, 
            xPos: param.P2PADX,
            yPos: param.PADY,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p2Handicap,
            velocity: param.PADVELOCITY,
        }
    }
    
    private wallBounce()
    {
    }

    private padBounce()
    {
    }

    private notifyAboutScore()
    {
        this.emitter.emit(
            'score',
            new ScoreEvent(this.state.player1.id, {}),
        );
    }

    private didPlayer1Wins() : boolean
    {
        return (this.state.player1.score >= this.state.winThresh);
    }

    private didPlayer2Wins() : boolean
    {
        return (this.state.player2.score >= this.state.winThresh);
    }

    public loop()
    {
    }
}