import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Request, Res } from '@nestjs/common';
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
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import {v4 as uuidv4} from 'uuid'
import { Observable, of } from 'rxjs';
import path = require('path')
export const storage = {
  storage: diskStorage({
    destination: './uploads/profile-image',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name + uuidv4()
      const ext :string = path.parse(file.originalname).ext;
      cb(null,`${filename}${ext}`);
    }
})}
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
 async create(@Body() createUserDto: CreateUserDto)
  {
    plainToClass(CreateUserDto, createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }, 
      },
    },
  })
uploadFile(@UploadedFile() file, @Request()  req) : Observable<Object> {
  //const user: User = req.user.user
  //user.avatarRef = file.path;
  return of({ImagePath: file.path});
}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('profile-image/:login')
  async findProfileImage(@Param('login') login:string, @Res() res) {
    const usr = await myDataSource.getRepository(User).findOneBy({login})
    return usr.avatarRef;
  }
  
  @Get('/byId')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  @Get(':login/2FA')
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
  @Patch(':login/2FA')
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
