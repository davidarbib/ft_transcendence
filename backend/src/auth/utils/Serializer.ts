import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity'
import { Done } from 'src/utils/types'
import { AuthenticationProvider } from '../services/auth';

@Injectable()
export class SessionSerializer extends PassportSerializer
{
    constructor(
        @Inject('AUTH_SERVICE')
        private readonly authService: AuthenticationProvider,
    )
    {
        super();
    }

    serializeUser(user: User, done: Done)
    {
        done(null, user);
    }

    async deserializeUser(user: User, done: Done)
    {
        const userDb = await this.authService.findUser(user.login);
        console.log(userDb);
        return userDb ? done(null, userDb) : done(null, null);
    }
}