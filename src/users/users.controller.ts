import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async createUser(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    return this.userService.createUser(username, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getMe(@Param() params) {
    return this.userService.getMe(params.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param() params,
  ) {
    return this.userService.uploadAvatar(file, params.id);
  }
}
