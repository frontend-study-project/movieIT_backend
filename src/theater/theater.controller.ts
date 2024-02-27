import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/auth/auth.guard';
import { TheaterService } from 'src/theater/theater.service';

@Controller('theater')
export class TheaterController {
  constructor(private theaterService: TheaterService) {
    this.theaterService.saveTheater()
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  getTheater() {
    return this.theaterService.getTheater();
  }
}
