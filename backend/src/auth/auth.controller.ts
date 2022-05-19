import { Body, Controller, Get, Post, Res, UseGuards} from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './services/auth.service';
import * as passport from 'passport'
import * as bcrypt from 'bcrypt'
import { Api42Guard } from './guards/api42.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Get('login')
    @UseGuards(Api42Guard)
    login()
    {
        return ;
    }

    @Get('status')
    status()
    {

    }
    
    @Get('redirect')
    @UseGuards(Api42Guard)
    redirect(@Res() response: Response)
    {
        response.sendStatus(200);
    }

    //@Post('register')
    //async register(
    //    @Body('login') login : string,
    //    @Body('password') password : string,
    //    @Body('mail') mail : string
    //)
    //{
    //    const hashPassword = await bcrypt.hash(password, 10);
    //    
    //    return this.authService.create({
    //        login,
    //        password,
    //        mail
    //    });
    //}
}
