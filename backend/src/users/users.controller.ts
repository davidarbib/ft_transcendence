import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
//import { Request } from 'express';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from './entities/user.entity';
import {plainToClass} from 'class-transformer';
import {myDataSource} from 'src/app-data-source';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBody, ApiConsumes, ApiTags} from '@nestjs/swagger';

import {Imagestorage} from './images-ref/image.storage';
import {JwtTwoFaGuard} from 'src/auth/guards/jwtTwoFa.guard';

type ValidMimeTYpe = 'image/png' | 'image/jpg' | 'image/jpeg ';

const validMimeTYpe: ValidMimeTYpe[] = [
  'image/png',
  'image/jpg',
  'image/jpeg ',
];

@Controller('users')
@UseGuards(JwtTwoFaGuard)
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * POST
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    plainToClass(CreateUserDto, createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Post('upload')
  // @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file', Imagestorage))
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
  uploadFile(@UploadedFile() file, @Request() req): any {
    if (file) {
      const allowMimeType: ValidMimeTYpe[] = validMimeTYpe;
      // const fileext = allowMimeType.includes(file.mimetype);
      //if (!fileext) return of({error: 'File must be a png'});
      const user: User = req.user;
      user.avatarRef = file.filename;
      console.log(user.avatarRef);
      return myDataSource.getRepository(User).save(user);
    }
  }
  /*
   * GET
   *
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
  @Get('login/:login')
  async findName(@Param('login') login: string) {
    return this.usersService.findName(login);
  }

  @Get(':login/profil-image')
  async findProfileImage(@Param('login') login: string) {
    const usr = await myDataSource.getRepository(User).findOneBy({ login });
    return usr.avatarRef;
  }

  @Get(':login/test/historic')
  async findHistoric(@Param('login') login: string) {
    console.log("on veut lhistorique !!!!!!!!!!!");
    return await this.usersService.findHistoric(login);
  }

  @Get(':login/2FA')
  dfa_bool(@Request() req) {
    const usr: User = req.user;
    return usr.doubleFA;
  }
  /*
   *  PATCH
   *
   */
  @Patch(':login')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    plainToClass(UpdateUserDto, updateUserDto);
    const usr: User = req.user;
    return this.usersService.update(usr, updateUserDto);
  }
  @Patch('2FA')
  dfa_update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const usr: User = req.user;
    return this.usersService.dfa_update(usr, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
    return;
  }

  @Get('faker')
  faker() {
    //console.log('hola');
    return this.usersService.faker();
  }

  //@Get('current')
  //@UseGuards(JwtGuard)
  //current(@Req() req: Request)
  //{
  //  return 'cc';
  //  //console.log('cc');
  //  //return "hfdkjfhkdjfh";
  //  //return req.user;
  //  return this.usersService.findOne(req.user.id);
  //}
}
