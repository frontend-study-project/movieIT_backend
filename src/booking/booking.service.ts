import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BookingResponse, BookingSearchParam, ReservationDto } from './interface';
import { MovieService } from 'src/movie/movie.service';
import { getFormattedDateTime } from 'src/utils/Date';
import { User } from '@prisma/client';
import { generateBookingId } from 'src/utils/PatternGenerator';

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

  reserve(reservationDto: ReservationDto, user: User) {
    return this.prisma.booking.create({
      data: {
        ...reservationDto,
        id: generateBookingId(),
        seat: reservationDto.seat.join(','),
        user: {
          connect: {
            id: user.id
          }
        },
      },
    })
  }
}
