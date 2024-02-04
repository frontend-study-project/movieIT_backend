import { Controller, Get, Param, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingSearchType } from './interface';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) { }

  @Get('user/:id')
  getBookingListById(
    @Param('id') userId: number,
    @Query('type') type: BookingSearchType,
    @Query('date') date?: string,
  ) {
    this.bookingService.getBookingListById({ userId, type, date });
  }
}
