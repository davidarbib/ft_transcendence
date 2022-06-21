declare namespace NodeJS
{
    export interface ProcessEnv
    {
        PORT?: string;
        JWT_SECRET?: string;
        JWT_EXPIRATION_MS?: string;
        JWT_EXPIRATION_STR?: string;
        JWT_COOKIE_KEY?: string;
        API42_UID?: string;
        API42_SECRET?: string;
        API42_REDIRECT?: string;
        DISCORD_UID?: string;
        DISCORD_SECRET?: string;
        DISCORD_REDIRECT?: string;
        TWOFA_KEY?: string;
        TWOFA_IV?: string;
    }
}