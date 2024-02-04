import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BookingResponse, BookingSearchParam } from './interface';
import { MovieService } from 'src/movie/movie.service';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly movieService: MovieService,
  ) { }

  async getBookingListById({ userId, type, date }: BookingSearchParam) {
    const whereDate = type === 'B'
      ? { gte: getFormattedDateTime(new Date()) }
      : { lte: date };

    const bookingList = await this.prisma.booking.findMany({
      where: {
        userId,
        AND: {
          date: whereDate
        }
      },
      include: {
        theater: {
          select: {
            name: true
          }
        }
      }
    });

    return Promise.allSettled(
      bookingList.map(async (booking: BookingResponse) => {
        try {
          const images = await this.movieService.getMovieImages(booking.movieId)
          booking.poster = images.posters[0]?.file_path;
        } catch { }
        return booking;
      })
    ).then((results) => (
      results.map((result) => (
        (result as PromiseFulfilledResult<BookingResponse>).value
      ))
    ));
  }
}
