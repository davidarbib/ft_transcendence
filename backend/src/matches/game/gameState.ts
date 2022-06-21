export enum PowerUp
{
    'NONE',
}

export class Vector2D
{
    public x: number;
    public y: number;
}

export class BallState
{
    public xPos: number;
    public yPos: number;
    public size: number;
    public velocity: number; 
    public direction: Vector2D;
}

export class PlayerState
{
    public id: string;
    public xPos: number;
    public yPos: number;
    public score: number;
    public powerUp: PowerUp;
    public handicap: number;
    public velocity: number;
}

export class GameState
{
    public id: string;
    public height: number;
    public width: number;
    public player1: PlayerState;
    public player2: PlayerState;
    public ball: BallState;
    public winThresh: number;
}