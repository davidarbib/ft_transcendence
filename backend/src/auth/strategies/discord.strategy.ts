import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
import { Profile, Strategy } from 'passport-discord';
//import { AuthService } from 'src/auth/services/auth.service'

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super({
            clientID: process.env.DISCORD_UID,
            clientSecret: process.env.DISCORD_SECRET,
            callbackURL: process.env.DISCORD_REDIRECT,
            scope: ['identify']
        });
    }

    async validate(accessToken: string, refreshToken: string, profileDiscord: Profile)
    {
        const {id, username} = profileDiscord;
        console.log(id, username);
        const details = {login: username, username: username};
        const user = await this.authService.validateUser(details);
        console.log(user);
        return user;
        //return this.authService.validateUser(details);
    }
}