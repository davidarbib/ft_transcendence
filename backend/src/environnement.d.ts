declare namespace NodeJS
{
    export interface ProcessEnv
    {
        PORT?: number;
        JWT_SECRET?: string;
        API42_UID?: string;
        API42_SECRET?: string;
        API42_REDIRECT?: string;
        DISCORD_UID?: string;
        DISCORD_SECRET?: string;
        DISCORD_REDIRECT?: string;
    }
}