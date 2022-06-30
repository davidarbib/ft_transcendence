import { Request, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthenticationProvider } from "../services/auth";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtTwoFaPayload } from 'src/utils/types';

export type JwtPayload = {sub: string; login: string};

@Injectable()
export class JwtTwoFaStrategy extends PassportStrategy(Strategy, 'jwt-two-factor')
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

    async validate(payload: JwtTwoFaPayload)
    {
        const user = await this.authService.findUser(payload.login);
        if (!user) {
            throw new UnauthorizedException();
        }

        if (!user.twoFactorEnabled) {
            return user;
        }

        if (payload.twoFactorAuthentified) {
            return user;
        }

        throw new UnauthorizedException('2FA needed');
    }
}