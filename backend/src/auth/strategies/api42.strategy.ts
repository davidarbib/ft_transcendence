import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
//import { Strategy } from 'passport-42';
//import { AuthService } from 'src/auth/services/auth.service'
const Strategy = require('passport-42');

@Injectable()
export class Api42Strategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super({
            clientID: process.env.API42_UID,
            clientSecret: process.env.API42_SECRET,
            callbackURL: process.env.API42_CALLBACK_URL
        });
    }

    async validate(accessToken: string, refreshToken: string, profile42: any)
    {
        const {id, username} = profile42;
        //console.log(id, username);
        const details = {login: username, username: username};
        return this.authService.validateUser(details);
    }
}