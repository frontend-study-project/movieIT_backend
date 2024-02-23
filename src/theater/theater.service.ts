import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import theaterList from './theater.data'

@Injectable()
export class TheaterService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async saveTheater() {
    const result = await this.prisma.theater.findFirst();

    if (result) return;

    await Promise.allSettled(theaterList.map((ele) => {
      return this.prisma.theater.create({
        data: { name: ele.area_depth1 }
      })
    }));

    return Promise.allSettled(theaterList.map((ele1) => {
      return ele1.area_depth2.map((ele2) => {
        return this.prisma.screen.create({
          data: { name: ele2.txt }
        })
      })
    }).reduce((acc, cur) => [...acc, ...cur], []));
  }

  async getTheater() {
    return this.prisma.screen.findMany()
  }
}
