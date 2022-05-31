import { Request, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
import { Strategy, ExtractJwt } from 'passport-jwt';

export type JwtPayload = {sub: number; login: string};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super({
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //uncomment to access protected routes with non-browser app,
                                                                        //dont forget to provide bearer token in request
            jwtFromRequest: (req) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies[process.env.JWT_COOKIE_KEY];
                }
                return token;
            },
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload)
    {
        console.log('validation');
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