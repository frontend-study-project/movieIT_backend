import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingSearchType } from './interface';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get('user/:id')
  @UseGuards(AuthGuard)
  getBookingListById(
    @Param('id') userId: number,
    @Query('type') type: BookingSearchType,
    @Query('date') date?: string,
  ) {
    this.bookingService.getBookingListById({ userId, type, date });
  }
}
