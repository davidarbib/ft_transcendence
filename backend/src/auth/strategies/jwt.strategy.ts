import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SECRET' //todo env
        });
    }

    async validate(payload: any)
    {
        //const user = await this.usersService.getById(payload.sub)
        return {
            id: payload.sub,
            login: payload.login,
        };
        //console.log(payload);
        //const details = {login: payload.name, username: payload.name};
        //const user = this.authService.validateUser(details);

        //if (!user)
        //{
        //    throw new UnauthorizedException();
        //}

        //return user;
    }
}