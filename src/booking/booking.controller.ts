import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingSearchType, ReservationDto } from './interface';
import { User } from '@prisma/client';
import { Public } from 'src/auth/auth.guard';

@Controller()
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get('booking/user/:id')
  getBookingListById(
    @Param('id') id: string,
    @Query('type') type: BookingSearchType,
    @Query('date') date?: string,
  ) {
    return this.bookingService.getBookingListById({ userId: Number(id), type, date });
  }

  @Post('reservation')
  reserve(
    @Body() reservationDto: ReservationDto,
    @Req() req: { user: User }
  ) {
    return this.bookingService.reserve(reservationDto, req.user);
  }

  // 영화, 극장, 시각별 좌석 수
  @Public()
  @Get('booking/movie/:movieId/theater/:theaterId')
  getBookingListByMovieAndTheater(
    @Param('movieId') movieId: string,
    @Param('theaterId') theaterId: string,
    @Query('datetime') datetime: string,
  ) {
    return this.bookingService.getBookingListByMovieAndTheater({
      movieId: Number(movieId),
      theaterId: Number(theaterId),
      datetime
    });
  }

  // 영화, 극장, 시간에 따른 좌석 목록 조회
  @Get('booking/movie/:movieId/theater/:theaterId/seat')
  getSeatListByMovieAndTheater(
    @Param('movieId') movieId: string,
    @Param('theaterId') theaterId: string,
    @Query('date') date: string,
  ) {
    return this.bookingService.getSeatListByMovieAndTheater({
      movieId: Number(movieId),
      theaterId: Number(theaterId),
      date
    });
  }
}
