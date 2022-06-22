import { GameState, PowerUp, PlayerState } from "./gameState";
import { Vector2D, getAngle, normalize, getReflectedVector } from "./vector.utils"
import * as param from "./constants";
import { initialize } from "passport";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { GameFinishEvent, ScoreEvent } from "./game.event";
import { Player } from "src/players/entities/player.entity";
import { InternalServerErrorException } from "@nestjs/common";

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

export enum PadCmd
{
    UP,
    DOWN
}

export enum Wall
{
    UP,
    DOWN
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

    public loop()
    {
    }
    
    public movePad(playerId: string, cmd: PadCmd)
    {
        let playerState : PlayerState = this.playerSelector(playerId);
        let velocity : number = playerState.velocity;
        switch (cmd)
        {
            case PadCmd.UP:
                playerState.yPos += Math.min(velocity, playerState.yPos);
                break;
            case PadCmd.DOWN:
                const wallDistance : number = this.state.height - playerState.yPos;
                playerState.yPos -= Math.min(velocity, wallDistance);
                break;
            default:
                throw new InternalServerErrorException("Bad command");
                break;
        }
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
            size: param.PADSIZE,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p1Handicap,
            velocity: param.PADVELOCITY,
        }

        this.state.player2 = {
            id: ids.playerTwoId, 
            xPos: param.P2PADX,
            yPos: param.PADY,
            size: param.PADSIZE,
            score: 0,
            powerUp: PowerUp.NONE,
            handicap: options.p2Handicap,
            velocity: param.PADVELOCITY,
        }
    }
    
    /*
    ** pick a side for ball service
    */
    private randomSide(): number
    {
        if (Math.random() < 0.5)
            return -1;
        return 1;
    }

    private wallBounce(wall: Wall)
    {
        let normal: Vector2D;

        if (wall == Wall.UP)
            normal = new Vector2D(0, 1);
        else
            normal = new Vector2D(0, -1);
        
        this.state.ball.direction = getReflectedVector(this.state.ball.direction, normal);
    }

    /*
    ** different types of bounce :
    ** - 50% center pad : wallBounce algorithm
    ** - edges : bounce up for up edge, bounce down for down edge
    */

    private padBounce(pad: PlayerState)
    {
        let 
        let boundaries = { }                
    }

    private notifyScore(playerId: string)
    {
        this.emitter.emit(
            'score',
            new ScoreEvent(playerId, {}),
        );
    }

    private notifyGameFinished()
    {
        this.emitter.emit(
            'game_finished',
            new GameFinishEvent(this.state.id, {}),
        );
    }

    private didPlayerWins(player: PlayerState) : boolean
    {
        return (player.score >= this.state.winThresh);
    }

    private playerSelector(playerId: string) : PlayerState
    {
        if (playerId === this.state.player1.id)
            return this.state.player1;
        else
            return this.state.player2;
    }

    private scorePoint(player: PlayerState) : boolean
    {
        let xDirection : number;
        let yDirection : number;

        player.score++;

        this.notifyScore(player.id);
        if (this.didPlayerWins(player))
            return true;

        this.state.serviceSide *= -1;
        xDirection = this.state.serviceSide;
        yDirection = this.randomSide();  
        this.state.ball.direction = normalize(new Vector2D(xDirection, yDirection));
        this.state.ball.xPos = this.state.width/2;
        this.state.ball.yPos = this.state.height/2;

        this.state.player1.yPos = this.state.height/2;
        this.state.player2.yPos = this.state.height/2;
        return false;
    }
}