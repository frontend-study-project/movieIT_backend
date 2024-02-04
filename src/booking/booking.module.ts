import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { MovieModule } from 'src/movie/movie.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('MOVIE_API_URL'),
      }),
      inject: [ConfigService],
    }),
    MovieModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, PrismaService]
})
export class BookingModule { }
