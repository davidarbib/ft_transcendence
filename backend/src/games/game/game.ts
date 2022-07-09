import { GameState, PowerUp, PlayerState, BallState } from "./gameState";
import {
    Vector2D,
    normalize,
    invertX,
    invertY,
} from "./vector.utils";
import * as param from "./constants";
import { initialize } from "passport";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { GameFinishEvent, ScoreEvent } from "./game.event";
import { Player } from "src/players/entities/player.entity";
import { InternalServerErrorException } from "@nestjs/common";
import { Socket } from "socket.io";

interface GameOptions
{
    winThresh : number,
    p1Handicap: number,
    p2Handicap: number,
}

//interface Ids
//{
//    gameId: string,
//    playerOneId: string,
//    playerTwoId: string,
//    playerOneSocket: Socket,
//    playerTwoSocket: Socket,
//}

interface Ids
{
    gameId: string,
    playerOneId: string,
    playerTwoId: string,
}

export interface LoopDetails
{
    score: boolean,
    isP1Score: boolean,
    win: boolean,
    isP1Win: boolean,
}

export enum PadCmd
{
    UP,
    DOWN
}

export enum Pad
{
    P1,
    P2,
    NONE
}

export enum Wall
{
    UP,
    DOWN,
    NONE
}

export class Game
{
    private state : GameState;
    private emitter: EventEmitter2;

    constructor
    (
        gameId : string,
        playerOneId : string,
        playerTwoId : string,
        //playerOneSocket: Socket,
        //playerTwoSocket: Socket,
        winThresh : number = param.WINTHRESH,
        p1Handicap : number = param.HANDICAP,
        p2Handicap : number = param.HANDICAP,
    )
    {
        this.state = new GameState();
        this.state.player1 = new PlayerState();
        this.state.player2 = new PlayerState();
        this.state.ball = new BallState();
        this.emitter = new EventEmitter2();

        this.init(
            { gameId, playerOneId, playerTwoId },
            //{ gameId, playerOneId, playerTwoId, playerOneSocket, playerTwoSocket },
            { winThresh, p1Handicap, p2Handicap },
        );
    }

    public setReady(playerId: string)
    {
        this.playerSelector(playerId).ready = true;
    }

    public arePlayersReady()
    {
        if (this.state.player1.ready && this.state.player2.ready)
            return true;
        return false;
    }

    public getState()
    {
        return this.state;
    }

    public loop()
    {
        ////---static ball to debug---
        //this.state.ball.xPos = 0;  
        //this.state.ball.yPos = 0;
        ////--------------------------

        let wall: Wall;
        let pad: Pad;

        wall = this.touchWall();
        if (wall != Wall.NONE)
            this.wallBounce(wall);

        pad = this.touchPad();
        if (pad != Pad.NONE)
            this.padBounce(pad);

        let p1Win: boolean = false;
        let p2Win: boolean = false;
        let score: boolean = false;
        let scoreP1: boolean = false;

        pad = this.goal();
        console.log(`pad : ${pad}`);
        if (pad == Pad.P1)
        {
            p2Win = this.scorePoint(this.state.player2);
            score = true;
        }
        if (pad == Pad.P2)
        {
            p1Win = this.scorePoint(this.state.player1);
            score = true;
            scoreP1 = true;
        }

        if (p1Win)
        {
            //this.notifyGameFinished(
            //    this.state.player1.id,
            //    this.state.player2.id,
            //    true);
            let loopDetails : LoopDetails=
            {
                score: score,
                isP1Score: scoreP1,
                isP1Win: true,
                win : true,
            }
            return { endGame: true, details: loopDetails };
        }
        if (p2Win)
        {
            //this.notifyGameFinished(
            //    this.state.player2.id,
            //    this.state.player1.id,
            //    false);
            let loopDetails : LoopDetails =
            {
                score: score,
                isP1Score: false,
                isP1Win: false,
                win : true,
            }
            return { endGame: true, details: loopDetails };
        }
        
        this.moveBall();

        let loopDetails : LoopDetails = 
        {
            score: score,
            isP1Score: scoreP1,
            isP1Win: false,
            win: false,
        }
        return { endGame: false, details: loopDetails };
    }
    
    public movePad(playerId: string, cmd: PadCmd)
    {
        let finalPos : number;
        let playerState : PlayerState = this.playerSelector(playerId);
        let velocity : number = playerState.velocity;
        switch (cmd)
        {
            case PadCmd.UP:
                finalPos = playerState.yPos - velocity;
                playerState.yPos = Math.max(finalPos, 0);
                break;
            case PadCmd.DOWN:
                finalPos = playerState.yPos + velocity;
                playerState.yPos = Math.min(finalPos, this.state.height);
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
        //TODO four-angle random direction 
        
        let side = this.randomSide()

        const ballVector : Vector2D = {
            x : side,
            y : this.randomSide(),
        }
        
        console.log(ballVector.x + " : " + ballVector.y)

        this.state = {
            id : ids.gameId,
            height : param.HEIGHT,
            width : param.WIDTH,
            player1 : {
                id: ids.playerOneId, 
                //socket: ids.playerOneSocket,
                isP1: true,
                xPos: param.P1PADX,
                yPos: param.PADY,
                size: param.PADSIZE,
                score: 0,
                powerUp: PowerUp.NONE,
                handicap: options.p1Handicap,
                velocity: param.PADVELOCITY,
                ready: false
            },
            player2 : {
                id: ids.playerTwoId, 
                //socket: ids.playerTwoSocket,
                isP1: false,
                xPos: param.P2PADX,
                yPos: param.PADY,
                size: param.PADSIZE,
                score: 0,
                powerUp: PowerUp.NONE,
                handicap: options.p2Handicap,
                velocity: param.PADVELOCITY,
                ready: false
            },
            ball : {
                xPos: param.BALLINITX,
                yPos: param.BALLINITY,
                size: param.BALLSIZE,
                velocity: param.BALLVELOCITY,
                direction: ballVector,
            },
            winThresh : param.WINTHRESH,
            serviceSide: side,
        }

        console.log(`ball x at init : ${this.state.ball.xPos}`);
    }
    
    private padUpEdge(pad: PlayerState) : number
    {
        return pad.yPos - param.PADSIZE / 2;
    }

    private padDownEdge(pad: PlayerState) : number
    {
        return pad.yPos + param.PADSIZE / 2;
    }

    private moveBall()
    {
        //let vel = this.state.ball.velocity;
        this.state.ball.xPos += this.state.ball.direction.x;
        this.state.ball.yPos += this.state.ball.direction.y;
        //console.log(`ball x after move ball: ${this.state.ball.xPos}`);
    }

    private touchWall() : Wall
    {
        if (this.state.ball.yPos >= this.state.height)
            return Wall.DOWN;
        if (this.state.ball.yPos <= 0)
            return Wall.UP;
        return Wall.NONE;
    }

    private touchPad() : Pad
    {
        if (this.state.ball.xPos <= this.state.player1.xPos
            && this.state.ball.yPos >= this.padUpEdge(this.state.player1)
            && this.state.ball.yPos <= this.padDownEdge(this.state.player1))
            return Pad.P1;
        if (this.state.ball.xPos >= this.state.player2.xPos
            && this.state.ball.yPos >= this.padUpEdge(this.state.player2)
            && this.state.ball.yPos <= this.padDownEdge(this.state.player2))
            return Pad.P2;
        return Pad.NONE;
    }

    private goal() : Pad
    {
        //console.log("-----------------");
        //console.log("edges p1 : ");
        //console.log(this.padUpEdge(this.state.player1));
        //console.log(this.padDownEdge(this.state.player1));
        //console.log("blastzone p1: ");
        //console.log(this.state.player1.xPos)
        //console.log("ball : ")
        //console.log(this.state.ball.xPos + " , " + this.state.ball.yPos) 
        if (this.state.ball.xPos < this.state.player1.xPos
            && (this.state.ball.yPos < this.padUpEdge(this.state.player1)
                || this.state.ball.yPos > this.padDownEdge(this.state.player1)))
            return Pad.P1;
        if (this.state.ball.xPos > this.state.player2.xPos
            && (this.state.ball.yPos < this.padUpEdge(this.state.player2)
                || this.state.ball.yPos > this.padDownEdge(this.state.player2)))
            return Pad.P2;
        //console.log("no goal");
        return Pad.NONE;
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
        this.state.ball.direction = invertY(this.state.ball.direction);
        /*
        let normal: Vector2D;

        if (wall == Wall.UP)
            normal = new Vector2D(0, 1);
        else
            normal = new Vector2D(0, -1);
        
        this.state.ball.direction = getReflectedVector(this.state.ball.direction, normal);
        this.state.ball.direction = normalize(this.state.ball.direction);
        */
    }

    /*
    ** different types of bounce :
    ** - 50% center pad : wallBounce algorithm
    ** - edges : bounce up for up edge, bounce down for down edge
    */

    private padBounce(pad: Pad)
    {
        let padState: PlayerState;
        let normal: Vector2D;

        if (pad == Pad.P1)
        {
            padState = this.state.player1;
            normal = new Vector2D(1, 0);
        }
        else
        {
            padState = this.state.player2;
            normal = new Vector2D(-1, 0);
        }

        let quarterPad = padState.size / 4;
        let boundaries = {
            up: padState.yPos - quarterPad,
            down: padState.yPos + quarterPad
        }                

        if (this.state.ball.yPos > boundaries.up
            && this.state.ball.yPos < boundaries.down)
            //this.state.ball.direction = getReflectedVector(this.state.ball.direction, normal);
            this.state.ball.direction = invertX(this.state.ball.direction);
        else
        {
            if (this.state.ball.yPos <= boundaries.up)    
                this.state.ball.direction = new Vector2D(normal.x, 2);
            else
                this.state.ball.direction = new Vector2D(normal.x, -2);
        }
        this.state.ball.direction = normalize(this.state.ball.direction);
    }

    //private notifyScore(playerId: string, isP1: boolean)
    //{
    //    console.log("notify score");
    //    this.emitter.emit(
    //        'score',
    //        new ScoreEvent(this.state.id, playerId, isP1),
    //    );
    //}

    //private notifyGameFinished(winnerId: string, loserId: string, playerOneWins: boolean)
    //{
    //    console.log("notify game finished");
    //    this.emitter.emit(
    //        'game_finished',
    //        new GameFinishEvent(this.state.id, winnerId, loserId, playerOneWins),
    //    );
    //}

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
        console.log("point detected");
        let xDirection : number;
        let yDirection : number;

        player.score++;

        //this.notifyScore(player.id, player.isP1);
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