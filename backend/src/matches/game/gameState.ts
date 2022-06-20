export enum PowerUp{
    NONE,
}

export class BallState
{
    public xPos: number;
    public yPos: number;
    public size: number;
    public velocity: number; 
}

export class PlayerState
{
    public yPos: number;
    public score: number;
    public powerUp: PowerUp;
    public handicap: number;
}

export class GameState
{
    public height: number;
    public width: number;
    public player1: PlayerState;
    public player2: PlayerState;
    public ball: BallState;
    public winThresh: number;
}