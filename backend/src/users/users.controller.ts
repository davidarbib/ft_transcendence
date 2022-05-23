import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { myDataSource } from 'src/app-data-source';
import { Express } from 'express'
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
 async create(@Body() createUserDto: CreateUserDto)
  {
    plainToClass(CreateUserDto, createUserDto);
    return this.usersService.create(createUserDto);
  }


  @Post('upload')
@UseInterceptors(FileInterceptor('file', {
  dest: 'uploads/'
}))
uploadFile(@UploadedFile() file) {
  console.log(file);
}
  

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get('/byId')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Get('/2FA/:login')
  dfa_bool(@Param('login') login: string) {
    return this.usersService.dfa_bool(login);
  }
  @Get(':login')
  async findName(@Param('login') login: string) {
  //  return this.usersService.findOne(login);
    const userRepo = myDataSource.getRepository(User);
     const lol1 = await userRepo.findOne({ where: {login
     } });
     const userToGet = plainToClass(CreateUserDto, lol1)
     return userToGet;
  }


  @Patch(':login')
  update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(login, updateUserDto);
  }
  @Patch('/2FA/:login')
  dfa_update(@Param('login') login: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.dfa_update(login, updateUserDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
    return 
  }

  @Get('faker')
  faker()
  {
    return this.usersService.faker();
  }

}
