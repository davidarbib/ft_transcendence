import { Controller, Get, Post } from '@nestjs/common';
import { InsertValuesMissingError } from 'typeorm';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController
{
    constructor(private usersService: UsersService) { }

    @Get()
    getUsers() {
        return this.usersService.listUsers();
    }

    @Post('new')
    postUsers() {
        console.log("add user");
        this.usersService.insertUser();
    }
}
