import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import theaterList from './theater.data'
import { TheaterResponse } from './interface';

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
          data: {
            name: ele2.txt,
            theater: {
              connect: {
                id: ele1.id
              }
            }
          },
        })
      })
    }).reduce((acc, cur) => [...acc, ...cur], []));
  }

  async getTheater() {
    return this.prisma.theater.findMany()
      .then((theater) => {
        return Promise.allSettled(
          theater.map(async (theater) => {
            const screenList = await this.prisma.screen.findMany({
              where: {
                theaterId: theater.id
              }
            });

            return {
              id: theater.id,
              area_depth1: theater.name,
              area_depth2: screenList.map((screen) => ({
                id: screen.id,
                txt: screen.name,
              }))
            }
          })
        );
      })
      .then((result) => {
        return result
          .filter(({ status }) => (
            status === 'fulfilled'
          ))
          .map((result) => (result as PromiseFulfilledResult<TheaterResponse>).value);
      });
  }

  getScreenById(screenId: number) {
    return this.prisma.screen.findFirst({
      where: {
        id: screenId
      }
    });
  }
} 