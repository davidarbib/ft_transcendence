export class ScoreEvent
{
    constructor
    (
        public gameId: string,
        public playerId: string,
        public p1: boolean,
    )
    { }
}

export class GameFinishEvent
{
    constructor
    (
        public gameId: string,
        public winnerId: string,
        public loserId: string,
        public didPlayerOneWin: boolean,
    )
    { }
}