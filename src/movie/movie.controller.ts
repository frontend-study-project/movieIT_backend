import { Controller, Get, HttpCode, HttpStatus, Query, Headers, Res } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Response } from 'express';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) { }

  @HttpCode(HttpStatus.OK)
  @Get('now_playing')
  getMovies(
    @Query('page') page: number,
    @Res({ passthrough: true }) res: Response,
    @Headers('Authorization') authorization?: string,
  ) {
    return this.movieService.getMovies(page, res, authorization);
  }
}
