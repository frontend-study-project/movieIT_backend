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
      : { lte: getFormattedDateTime(new Date(date)) };

    const bookingList = await this.prisma.booking.findMany({
      where: {
        userId,
        AND: {
          date: whereDate
        }
      },
      include: {
        screen: {
          select: {
            name: true,
          }
        }
      }
    });

    for await (const booking of bookingList) {
      try {
        const images = await this.movieService.getMovieImages(booking.movieId);
        const detail = await this.movieService.getMovieDetail(booking.movieId);
        (booking as BookingResponse).poster = images.posters[0]?.file_path;
        (booking as BookingResponse).movie = detail.title;
        (booking as BookingResponse).theater = booking.screen.name;
      } catch { }
    }

    return bookingList;
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

  getBookingListByMovieAndTheater({ movieId, theaterId, datetime }: SearchBookingSeatListRequest) {
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
            const offset = 1000 * 60 * 60 * 9
            const reservationDate = new Date(new Date(booking.date).getTime() + offset);
            const timeDate = new Date(new Date(datetime).getTime() + offset);

            return reservationDate.getHours() === timeDate.getHours() &&
              reservationDate.getFullYear() === timeDate.getFullYear() &&
              reservationDate.getMonth() === timeDate.getMonth() &&
              reservationDate.getDate() === timeDate.getDate();
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
