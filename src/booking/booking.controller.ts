import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingSearchType, ReservationDto } from './interface';
import { User } from '@prisma/client';

@Controller()
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get('booking/user/:id')
  getBookingListById(
    @Param('id') id: string,
    @Query('type') type: BookingSearchType,
    @Query('date') date?: string,
  ) {
    this.bookingService.getBookingListById({ userId: Number(id), type, date });
  }

  @Post('reservation')
  reserve(
    @Body() reservationDto: ReservationDto,
    @Req() req: { user: User }
  ) {
    return this.bookingService.reserve(reservationDto, req.user);
  }

  @Get('booking/movie/:movieId/theater/:theaterId')
  getBookingListByMovieAndTheater(
    @Param('movieId') movieId: string,
    @Param('theaterId') theaterId: string,
    @Query('time') time: string,
  ) {
    return this.bookingService.getBookingListByMovieAndTheater({
      movieId: Number(movieId),
      theaterId: Number(theaterId),
      time: Number(time)
    });
  }
}
