import { Controller, Get, HttpCode, HttpStatus, Query, Headers, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Response } from 'express';
import { Public } from 'src/auth/auth.guard';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {
    this.movieService.saveTheater()
   }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('now_playing')
  getMovies(
    @Query('page') page: number,
    @Res({ passthrough: true }) res: Response,
    @Headers('Authorization') authorization?: string,
  ) {
    return this.movieService.getMovies(page, res, authorization);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('theater')
  getTheater() {
    return this.movieService.getTheater();
  }
}
