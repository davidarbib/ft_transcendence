import { Body, Controller, Get, Post, Res, Req, UseGuards} from '@nestjs/common';
import { Response } from 'express'
import { Request } from 'express'
import { User } from 'src/users/entities/user.entity';
import { Api42Guard } from './guards/api42.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtTwoFaGuard } from './guards/jwtTwoFa.guard';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DiscordGuard } from './guards/discord.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Get('login')
    @UseGuards(Api42Guard)
    login()
    {
        return ;
    }
    
    @Get('redirect')
    @UseGuards(Api42Guard)
    async redirect(@Req() req: Request, @Res({ passthrough: true }) response: Response)
    {
        const { accessToken } = await this.authService.login(req.user);
        this.authService.generateCookie(response, accessToken);
        //return req.user;
        //return accessToken; //uncomment to obtain bearer token for curl/postman tests
        return response.redirect('http://localhost:8000');
        //return "Logged with 42";
    }

    @Post('localLogin')
    @UseGuards(LocalGuard)
    localLogin(@Req() request: Request): any
    {
        return this.authService.login(request.user);
    }

    @Get('discordLogin')
    @UseGuards(DiscordGuard)
    discordLogin()
    {
        return ;
    }

    @Get('discordRedirect')
    @UseGuards(DiscordGuard)
    async discordRedirect(@Req() req: Request, @Res({ passthrough: true }) response: Response)
    {
        const { accessToken } = await this.authService.login(req.user);
        this.authService.generateCookie(response, accessToken);
        //return req.user;
        //return accessToken; //uncomment to obtain bearer token for curl/postman tests
        return response.redirect('http://localhost:8000');
        //return "Logged with Discord";
    }

    @Get('current')
    @UseGuards(JwtTwoFaGuard)
    getHello(@Req() request: Request): any
    {
        return request.user;
    }

    @Get('logout')
    @UseGuards(JwtGuard)
    logout
    (
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ): string
    {
        //update user status
        this.authService.generateCookie(response, "xxxxxxxxxxx");
        return "Logout successful";
    }

    @Get('status')
    status()
    {
    }
}