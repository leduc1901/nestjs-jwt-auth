import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosError } from 'axios';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from './user.model';
import * as FormData from 'form-data';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    return this.userModel.create({
      username,
      password,
    });
  }
  async getUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getUser({ username, password }): Promise<User | undefined> {
    return this.userModel.findOne({
      username,
      password,
    });
  }

  async getMe(userId): Promise<User | undefined> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw 'User not found';
    }
    return user;
  }

  async uploadAvatar(
    avatar: Express.Multer.File,
    userId: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw 'User not found';
    }
    const formData = new FormData();
    formData.append('image', avatar.buffer.toString('base64'));
    const { data: imageData } = await firstValueFrom(
      this.httpService
        .post(
          `https://api.imgbb.com/1/upload?expiration=600&key=${process.env.IMG_API_KEY}`,
          formData,
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw error;
          }),
        ),
    );
    user.updateOne({ avatar: imageData.data.url }).exec();
    return imageData;
  }
}
