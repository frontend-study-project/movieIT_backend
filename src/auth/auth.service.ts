import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Payload, SignUpCineDto, SignUpDto } from './interface';
import { UpdateDto, UpdatePasswordDto } from 'src/users/dto/update-user.dto';
import { CURRENT_PASSWORD_EQUAL, CURRENT_PASSWORD_NOT_EQUAL } from 'src/error/error-code';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(userId: string, pass: string) {
    const user = await this.userService.findOne(userId);
    const isMatch = await bcrypt.compare(pass, user?.password || '');

    if (!isMatch) {
      throw new HttpException('유저정보가 존재하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const { password, ...result } = user;
    const payload = { sub: user.id, user: result };

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.jwt_secret
      }),
      user: result
    }
  }

  async signUp(signUpDto: SignUpDto) {
    if (await this.userService.isExistUserId(signUpDto.userId)) {
      throw new HttpException('이미 존재하는 아이디입니다.', HttpStatus.BAD_REQUEST);
    }

    if (await this.userService.isExistNickname(signUpDto.nickname)) {
      throw new HttpException('이미 존재하는 닉네임입니다.', HttpStatus.BAD_REQUEST);
    }

    if (signUpDto.password !== signUpDto.passwordConfirm) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.BAD_REQUEST);
    }

    return this.userService.save(signUpDto);
  }

  async checkUserId(userId: string) {
    const existed = await this.userService.isExistUserId(userId);

    if (!existed) return;

    throw new HttpException('중복 된 아이디입니다.', HttpStatus.BAD_REQUEST);
  }

  changeNickname(id: number, updateDto: UpdateDto) {
    return this.userService.update(id, updateDto);
  }

  async changePassword(id: number, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.userService.findOneById(id);
    let isMatch = await bcrypt.compare(updatePasswordDto?.password, user.password);

    if (!isMatch) {
      throw new BadRequestException(CURRENT_PASSWORD_NOT_EQUAL);
    }

    isMatch = await bcrypt.compare(updatePasswordDto?.newPassword, user.password);

    if (isMatch) {
      throw new BadRequestException(CURRENT_PASSWORD_EQUAL);
    }

    return this.userService.update(id, { password: updatePasswordDto.newPassword });
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
