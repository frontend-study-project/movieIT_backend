import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './interface';
import { AuthGuard } from './auth.guard';
import { UpdateDto } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('join')
  signup(@Body() signUpDto: SignUpDto) {
    this.authService.signUp(signUpDto);
  }

  @Post('duplication-check')
  checkId(@Body() id: number) {
    this.authService.checkId(id);
  }

  @Patch('user/:id')
  changeNickname(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
  ) {
    this.authService.changeNickname(id, updateDto);
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
