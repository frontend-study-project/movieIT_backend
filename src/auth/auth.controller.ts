import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInCineDto, SignInDto, SignUpCineDto, SignUpDto } from './interface';
import { Public } from './auth.guard';
import { UpdateDto, UpdatePasswordDto } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.userId, signInDto.password);
  }

  @Public()
  @Post('join')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('cine/login')
  signInByCine(@Body() signInDto: SignInCineDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @Post('cine/join')
  signupByCine(@Body() signUpDto: SignUpCineDto) {
    return this.authService.signUpByCine(signUpDto);
  }

  @Public()
  @Get('duplication-check/:userId')
  checkId(@Param('userId') userId: string) {
    this.authService.checkUserId(userId);
  }

  @Patch('user/:id')
  changeNickname(
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ) {
    return this.authService.changeNickname(Number(id), updateDto);
  }

  @Patch('user/:id/change-password')
  changePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.changePassword(Number(id), updatePasswordDto);
  }

  @Get('user')
  profile(@Req() req) {
    return req.user;
  }
}
