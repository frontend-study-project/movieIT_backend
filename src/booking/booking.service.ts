import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BookingResponse, BookingSearchParam, ReservationDto, ReservationResponse } from './interface';
import { MovieService } from 'src/movie/movie.service';
import { getFormattedDateTime } from 'src/utils/Date';
import { User } from '@prisma/client';
import { generateBookingId } from 'src/utils/PatternGenerator';
import { TheaterService } from 'src/theater/theater.service';
import { SearchBookingSeatListRequest, SearchSeatListRequest } from './dto/Booking';

@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private readonly movieService: MovieService,
    private readonly theaterService: TheaterService,
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

  reserve({ theaterId, ...rest }: ReservationDto, user: User) {
    return this.prisma.booking.create({
      data: {
        ...rest,
        id: generateBookingId(),
        seat: rest.seat.join(','),
        user: {
          connect: {
            id: user.id,
          },
        },
        screen: {
          connect: {
            id: theaterId,
          }
        },
      },
      select: {
        id: true,
        auditorium: true,
        movieId: true,
        date: true,
        money: true,
        people: true,
        theaterId: true,
        seat: true,
        reserve_date: true,
      }
    })
      .then(({ movieId, theaterId, reserve_date, ...reservation }: ReservationResponse) => {
        reservation.reserveDate = getFormattedDateTime(reserve_date);

        return Promise.all([
          this.movieService.getMovieDetail(movieId),
          reservation,
        ])
      })
      .then(([movie, reservation]) => {
        reservation.title = movie.title;

        return Promise.all([
          this.theaterService.getTheaterById(theaterId),
          reservation,
        ])
      })
      .then(([screen, reservation]) => {
        reservation.theater = screen.name;
        return reservation;
      });
  }

  getBookingListByMovieAndTheater({ movieId, theaterId, hour }: SearchBookingSeatListRequest) {
    return this.prisma.booking
      .findMany({
        where: {
          movieId: movieId,
          theaterId: theaterId,
        },
        select: {
          date: true,
          seat: true,
        }
      })
      .then((bookingList) => (
        bookingList
          .filter((booking) => {
            const reservationDate = new Date(booking.date);
            const now = new Date();
            return reservationDate.getHours() === hour &&
              reservationDate.getFullYear() === now.getFullYear() &&
              reservationDate.getMonth() === now.getMonth() &&
              reservationDate.getDate() === now.getDate();
          })
          .reduce((acc, { date, seat }) => {
            const minutes = new Date(date).getMinutes();
            const index = (minutes - 10) / 5;
            acc[index] = (acc[index] || 0) + seat.split(',').length
            return acc;
          }, Array(10).fill(0))
      ));
  }

  getSeatListByMovieAndTheater({ movieId, theaterId, date }: SearchSeatListRequest) {
    return this.prisma.booking
      .findMany({
        where: {
          AND: {
            movieId: movieId,
            theaterId: theaterId,
            date
          }
        },
        select: {
          date: true,
          seat: true,
        }
      })
      .then((bookingList) => (
        bookingList
          .map(({ seat }) => seat.split(','))
          .flat()
      ));
  }
}
