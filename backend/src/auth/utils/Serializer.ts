import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity'

@Injectable()
export class SessionSerializer extends PassportSerializer
{
    constructor()
    {
        super();
    }

    serializeUser(user: User, done: (err: Error, user: User) => void)
    {
        done(null, user);
    }

    deserializeUser(user: User, done: (err: Error, user: User) => void)
    {
        const userDb = null;
        done(null, user);
    }
}