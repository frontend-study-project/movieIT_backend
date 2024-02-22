import { Controller, Get, HttpCode, HttpStatus, Query, Headers, Res } from '@nestjs/common';
import { Public } from 'src/auth/auth.guard';
import { TheaterService } from 'src/theater/theater.service';

@Controller('theater')
export class TheaterController {
  constructor(private theaterService: TheaterService) {
    this.theaterService.saveTheater()
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  getTheater() {
    return this.theaterService.getTheater();
  }
}
