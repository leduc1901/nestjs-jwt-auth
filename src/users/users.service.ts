import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(username: string, password: string): Promise<User> {
    console.log(username, password);
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
}
