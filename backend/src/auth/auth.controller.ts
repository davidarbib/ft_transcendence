import { Body, Controller, Get, Post, Res} from '@nestjs/common';
import { Response } from 'express'
import { AuthService } from './auth.service';
import * as passport from 'passport'
import * as bcrypt from 'bcrypt'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Get('login')
    login()
    {
        //
    }

    @Get('status')
    status()
    {

    }
    
    @Get('redirect')
    redirect(@Res() response: Response)
    {
        response.send(200);
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
