declare namespace NodeJS
{
    export interface ProcessEnv
    {
        PORT?: number;
        COOKIE_SECRET?: string;
        API42_UID?: string;
        API42_SECRET?: string;
        API42_REDIRECT?: string;
    }
}