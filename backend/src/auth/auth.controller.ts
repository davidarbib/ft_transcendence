import { Body, Controller, Get, Post, Res, Req, UseGuards, HttpCode} from '@nestjs/common';
import { Response, Request } from 'express';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { Api42Guard } from './guards/api42.guard';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtTwoFaGuard } from './guards/jwtTwoFa.guard';
import { AuthService } from './services/auth.service';
import { UsersService } from 'src/users/users.service';
import { DiscordGuard } from './guards/discord.guard';
import { UsersGateway } from 'src/users/users.gateway';

@Controller('auth')
export class AuthController {
    private redirectAddress = 'http://' + process.env.HOST + ':8000';
    constructor
    (
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly usersGateway: UsersGateway) {}
    
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
        const user : User = await this.usersService.findOne(req.user.id);
        const { accessToken } = await this.authService.login(req.user, user.twoFactorEnabled);
        this.authService.generateCookie(response, accessToken);
        this.usersGateway.handleStatusSwitch(user.id, UserStatus.ONLINE);
        return response.redirect(this.redirectAddress);
        //return "Logged with 42";
    }

    @Post('localLogin')
    @UseGuards(LocalGuard)
    localLogin(@Req() request: Request): any
    {
        this.usersGateway.handleStatusSwitch(request.user.id, UserStatus.ONLINE);
        return this.authService.login(request.user);
    }

    @Get('strawman')
    async strawman(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    )
    {
        const details = { login: 'strawman', username: 'strawman'}
        const user = await this.authService.validateUser(details);
        const { accessToken } = await this.authService.login(user, false);
        this.authService.generateCookie(response, accessToken);
        this.usersGateway.handleStatusSwitch(user.id, UserStatus.ONLINE);
        return response.redirect(this.redirectAddress);
    }

    @Get('jack')
    async jack(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    )
    {
        const details = { login: 'jack', username: 'jack'}
        const user = await this.authService.validateUser(details);
        const { accessToken } = await this.authService.login(user, false);
        this.authService.generateCookie(response, accessToken);
        this.usersGateway.handleStatusSwitch(user.id, UserStatus.ONLINE);
        return response.redirect(this.redirectAddress);
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
        const user : User = await this.usersService.findOne(req.user.id);
        const { accessToken } = await this.authService.login(req.user, user.twoFactorEnabled);
        this.authService.generateCookie(response, accessToken);
        this.usersGateway.handleStatusSwitch(user.id, UserStatus.ONLINE);
        return response.redirect(this.redirectAddress);
        //return "Logged with Discord";
    }

    @Get('current')
    @UseGuards(JwtTwoFaGuard)
    getHello(@Req() request: Request): any
    {
        return request.user;
    }

    @HttpCode(200)
    @Post('logout')
    @UseGuards(JwtGuard)
    logout
    (
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response
    ): string
    {
        //update user status
        console.log(request.user.id);
        this.usersGateway.handleStatusSwitch(request.user.id, UserStatus.OFFLINE);
        return "Logout successful";
    }

    @Get('status')
    status()
    {
    }
}