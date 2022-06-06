import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as node2fa from 'node-2fa';
import { TwoFactorSecret } from 'src/utils/types';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthService
{
    constructor(private usersService : UsersService)
    { }

    public async generateTwoFactorSecret(user: User) : Promise<TwoFactorSecret>
    {
        const secret = node2fa.generateSecret({
            name: process.env.APP_NAME_2FA,
            account: user.login,
        });

        await this.usersService.setTwoFactorSecret(user.id, secret.secret);
        return secret;
    }

    public async pipeQrCodeStream(stream: Response, url: string)
    {
        return toFileStream(stream, url);
    }
}