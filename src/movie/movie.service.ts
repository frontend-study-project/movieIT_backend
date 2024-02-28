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

  async getMovies(page: number, res: Response, authorization?: string): Promise<Movie[]> {
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

    await Promise.allSettled(data.results.map((movie) => {
      return this.httpService.axiosRef.get<CertificationListResponse>(`/movie/${movie.id}/release_dates`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.MOVIE_READ_API}`,
        }
      }).then(({ data }) => {
        movie.certification = data.results
          ?.find(({ iso_3166_1 }) => iso_3166_1 === 'KR')
          ?.release_dates[0]
          ?.certification || 'all';
      })
    }));

    res.setHeader('totalPages', String(data.totalPages));
    const userId = this.authService.getUserId(authorization);

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

  async getMovieImages(movieId: number) {
    const { data } = await firstValueFrom(this.httpService
      .get<MovieImagesResponse>(`/movie/${movieId}/images?include_image_language=ko`, {
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

    return data;
  }

  async getMovieDetail(movieId: number) {
    const { data } = await firstValueFrom(this.httpService
      .get<Movie>(`/movie/${movieId}?language=ko-KR`, {
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

    return data;
  }
}
