import { Body, Controller, Get, Post, Res, Req, UseGuards, Injectable, UseInterceptors, ClassSerializerInterceptor} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Api42Guard } from './guards/api42.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordGuard } from './guards/discord.guard';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { UsersService } from 'src/users/users.service';
import { TwoFactorSecret } from 'src/utils/types';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController
{
    constructor
    (
        private twoFactorAuthService : TwoFactorAuthService,
        private usersService : UsersService,
    )
    { }

    @Post('generate')
    @UseGuards(JwtGuard)
    async register(@Res() response: Response, @Req() request: Request)
    {
        let user : User = await this.usersService.findOne(request.user.id);
        let twoFactor : TwoFactorSecret = await this.twoFactorAuthService.generateTwoFactorSecret(user);
        return this.twoFactorAuthService.pipeQrCodeStream(response, twoFactor.uri);
    }
}