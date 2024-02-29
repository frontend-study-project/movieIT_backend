import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
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

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("/list")
  getTheaterList(
    @Query("region") region?: string,
  ) {
    return this.theaterService.getTheaterList(region);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get(":id")
  getTheaterDetail(@Param('id') id: string,) {
    return this.theaterService.getTheaterById(Number(id));
  }
}
