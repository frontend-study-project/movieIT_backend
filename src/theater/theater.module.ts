import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { TheaterService } from './theater.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('MOVIE_API_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  exports: [TheaterService],
  controllers: [TheaterController],
  providers: [TheaterService, PrismaService]
})
export class TheaterModule { }
