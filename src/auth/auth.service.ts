import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserCredentials(
    username: string,
    password: string,
  ): Promise<any> {
    console.log(username, password);
    const user = await this.usersService.getUser({ username, password });

    return user ?? null;
  }

  async loginWithCredentials(user: any) {
    const payload = { username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
