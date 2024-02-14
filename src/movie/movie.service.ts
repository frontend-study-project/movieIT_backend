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

  async getMovieImages(moveId: number) {
    const { data } = await firstValueFrom(this.httpService
      .get<MovieImagesResponse>(`/movie/${moveId}/images?include_image_language=ko`, {
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

  async saveTheater() {
    const theaterList = [
      {
        id: 1,
        area_depth1: "서울",
        area_depth2: [
          { id: "11", txt: "강남" },
          { id: "12", txt: "강남대로" },
          { id: "13", txt: "강동" },
          { id: "14", txt: "군자" },
          { id: "15", txt: "더부티크 목동현대백화점" },
          { id: "16", txt: "동대문" },
          { id: "17", txt: "더부티크 목동현대백화점" },
          { id: "18", txt: "마곡" },
          { id: "19", txt: "남양주현대아울렛 스페이스원" },
          { id: "20", txt: "더부티크 목동현대백화점" },
          { id: "21", txt: "더부티크 목동현대백화점" },
          { id: "22", txt: "더부티크 목동현대백화점" },
          { id: "23", txt: "더부티크 목동현대백화점" },
          { id: "24", txt: "더부티크 목동현대백화점" },
          { id: "25", txt: "더부티크 목동현대백화점" },
          { id: "26", txt: "더부티크 목동현대백화점" },
          { id: "27", txt: "더부티크 목동현대백화점" },
          { id: "28", txt: "더부티크 목동현대백화점" },
          { id: "29", txt: "더부티크 목동현대백화점" },
          { id: "30", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 2,
        area_depth1: "경기",
        area_depth2: [
          { id: "31", txt: "고양스타필드" },
          { id: "32", txt: "광명AK플라자" },
          { id: "33", txt: "광명소호" },
          { id: "34", txt: "군자" },
          { id: "35", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 3,
        area_depth1: "인천",
        area_depth2: [
          { id: "41", txt: "고양스타필드" },
          { id: "42", txt: "광명AK플라자" },
          { id: "43", txt: "광명소호" },
          { id: "44", txt: "군자" },
          { id: "45", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 4,
        area_depth1: "대전/충청/세종",
        area_depth2: [
          { id: "51", txt: "고양스타필드" },
          { id: "52", txt: "광명AK플라자" },
          { id: "53", txt: "광명소호" },
          { id: "54", txt: "군자" },
          { id: "55", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 5,
        area_depth1: "부산/대구/경상",
        area_depth2: [
          { id: "61", txt: "고양스타필드" },
          { id: "62", txt: "광명AK플라자" },
          { id: "63", txt: "광명소호" },
          { id: "64", txt: "군자" },
          { id: "65", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 6,
        area_depth1: "광주/전라",
        area_depth2: [
          { id: "71", txt: "고양스타필드" },
          { id: "72", txt: "광명AK플라자" },
          { id: "73", txt: "광명소호" },
          { id: "74", txt: "군자" },
          { id: "75", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 7,
        area_depth1: "강원",
        area_depth2: [
          { id: "81", txt: "고양스타필드" },
          { id: "82", txt: "광명AK플라자" },
          { id: "83", txt: "광명소호" },
          { id: "84", txt: "군자" },
          { id: "85", txt: "더부티크 목동현대백화점" },
        ],
      },
      {
        id: 8,
        area_depth1: "제주",
        area_depth2: [
          { id: "91", txt: "고양스타필드" },
          { id: "92", txt: "광명AK플라자" },
          { id: "93", txt: "광명소호" },
          { id: "94", txt: "군자" },
          { id: "95", txt: "더부티크 목동현대백화점" },
        ],
      },
    ]
    theaterList.forEach((ele) => {
      this.prisma.theater.create({
        data: {id: ele.id , name: ele.area_depth1}
      })
    })

    theaterList.forEach((ele1) => {
      ele1.area_depth2.forEach((ele2) => {
        this.prisma.screen.create({
          data: {theaterId: ele1.id, name: ele2.txt}
        })
      })
    })

  }
}
