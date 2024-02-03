import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MovieModule } from './movie/movie.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MovieModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local']
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
