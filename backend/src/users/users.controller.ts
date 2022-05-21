import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { myDataSource } from 'src/app-data-source';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
 async create(@Body() createUserDto: CreateUserDto)
  {
    plainToClass(CreateUserDto, createUserDto);
    return this.usersService.create(createUserDto);
  }

  // PARTIAL dans friend et plus  bc ca te permet d'avoir q'un bout d'une classe/entity et du coup de recup les info neccesaire

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  
  @Get('/byId')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
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


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
    return 
  }
}
