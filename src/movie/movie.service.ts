import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Response } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private authService: AuthService,
  ) { }

  async getMovies(page: number, res: Response, authorization?: string) {
    const { data } = await firstValueFrom(this.httpService
      .get<MovieListResponse>(`/movie/now_playing?language=ko-KR&region=KR&page=${page}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.MOVIE_READ_API}`
        }
      })
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw '에러 발생';
        })
      ));

    res.setHeader('totalPages', String(data.totalPages));
    const userId = this.authService.getId(authorization);

    if (!userId) return data.results;

    return Promise.allSettled(
      data.results.map(async (movie) => (
        this.prisma.movieLike
          .findFirst({
            where: {
              userId,
              movieId: movie.id
            }
          })
          .then(({ like }) => ({ ...movie, like }))
          .catch(() => {
            return movie;
          })
      )))
      .then(results => (
        results.map((result) => (
          result.status === 'fulfilled'
            ? result.value
            : result.reason
        ))
      ));
  }
}
