import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super();
    }

    async validate(username: string, password: string)
    {
        const details = {login: username, username: username};
        const user = this.authService.validateUser(details);

        if (!user)
        {
            throw new UnauthorizedException();
        }

        return user;
    }
}