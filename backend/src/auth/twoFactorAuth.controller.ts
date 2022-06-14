import { Body, Controller, Get, Post, Res, Req, UseGuards, Injectable, UseInterceptors, ClassSerializerInterceptor, HttpCode, UnauthorizedException} from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { Api42Guard } from './guards/api42.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtTwoFaGuard } from './guards/jwtTwoFa.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordGuard } from './guards/discord.guard';
import { TwoFactorAuthService } from './services/twoFactorAuth.service';
import { UsersService } from 'src/users/users.service';
import { TwoFactorSecret } from 'src/utils/types';
import { toDataURL } from 'qrcode';
import { TwoFactorAuthCodeDto } from './dto/TwoFactorAuthCodeDto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController
{
    constructor
    (
        private twoFactorAuthService : TwoFactorAuthService,
        private authService : AuthService,
        private usersService : UsersService,
    )
    { }

    @Post('generate')
    @UseGuards(JwtGuard)
    async generate(@Res() response: Response, @Req() request: Request)
    {
        let user : User = await this.usersService.findOne(request.user.id);
        let twoFactor : TwoFactorSecret = await this.twoFactorAuthService.generateTwoFactorSecret(user);
        //return this.twoFactorAuthService.pipeQrCodeStream(response, twoFactor.uri);
        await toDataURL(twoFactor.uri)
        .then(url => {
            console.log(url);
            response.send(url);
        })
        .catch(err => {
            console.log(err);
        });
        return ;
    }

    @HttpCode(200)
    @Post('turn-on')
    @UseGuards(JwtGuard)
    async turnOnTwoFactorAuth
    (
        @Req() request: Request, 
        @Body() { code } : TwoFactorAuthCodeDto,
    )
    {
        console.log(`code: ${code}`);
        const user : User = await this.usersService.findOne(request.user.id);
        const isCodeValid : boolean = await this.twoFactorAuthService.isTwoFactorAuthValid(code, user);
        console.log(`valid code: ${isCodeValid}`);
        
        if (!isCodeValid) {
            throw new UnauthorizedException("Wrong code");
        }

        await this.usersService.turnOnTwoFactor(request.user.id);
    }

    @HttpCode(200)
    @Post('turn-off')
    @UseGuards(JwtTwoFaGuard)
    async turnOffTwoFactorAuth(@Req() request: Request)
    {
        await this.usersService.turnOffTwoFactor(request.user.id);
    }

    @HttpCode(200)
    @Post('authenticate')
    @UseGuards(JwtGuard)
    async authenticate
    (
        @Req() request: Request,
        @Body() { code } : TwoFactorAuthCodeDto,
        @Res() response : Response,
    )
    {
        const user : User = await this.usersService.findOne(request.user.id);
        const isCodeValid : boolean = await this.twoFactorAuthService.isTwoFactorAuthValid(code, user);
        
        if (!isCodeValid) {
            throw new UnauthorizedException("Wrong code");
        }

        const { accessToken } = await this.authService.login(request.user, true);

        response.cookie(
            process.env.JWT_COOKIE_KEY,
            accessToken,
            {
                httpOnly: false, //toggle to true on prod
                expires: new Date(Date.now() + process.env.JWT_EXPIRATION_MS),
                sameSite: "none",
            }
        );

        return response.redirect('http://localhost:8000');
    }
}