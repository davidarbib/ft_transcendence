import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import * as node2fa from 'node-2fa';
import { TwoFactorSecret } from 'src/utils/types';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { encrypt, decrypt } from 'src/utils/encryption';

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
        
        const encryptedSecret = encrypt(
            secret.secret,
            process.env.TWOFA_KEY,
            process.env.TWOFA_IV
        );

        //await this.usersService.setTwoFactorSecret(user.id, secret.secret);
        await this.usersService.setTwoFactorSecret(user.id, encryptedSecret);
        return secret;
    }

    public async isTwoFactorAuthValid(token: string, user: User) : Promise<boolean>
    {
        const secret = decrypt(
            user.twoFactorSecret,
            process.env.TWOFA_KEY,
            process.env.TWOFA_IV
        );
        const result = node2fa.verifyToken(secret, token);
        //const result = node2fa.verifyToken(user.twoFactorSecret, token);
        if (!result)
            return false;
        const { delta } = result;
        if (delta !== 0)
            return false;
        return true;
    }
}