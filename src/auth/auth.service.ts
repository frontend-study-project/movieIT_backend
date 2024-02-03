import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload } from './interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(email: string, pass: string) {
    const user = await this.userService.findOne(email);
    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;
    const payload = { sub: user.id, user: result };

    return {
      access_token: await this.jwtService.signAsync(payload)
    }
  }

  getUserId(authorization: string = '') {
    const token = authorization
      .replace('Bearer', '')
      .trim();

    if (!token) return null;

    const { sub: userId } = this.jwtService.verify<Payload>(token);
    return userId;
  }
}
