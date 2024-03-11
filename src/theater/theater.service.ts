import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import theaterList from './theater.data';
import { TheaterResponse } from './interface';

@Injectable()
export class TheaterService {
  constructor(private prisma: PrismaService) { }

  /* data.ts 영화관 데이터 DB Setting */
  async saveTheater() {
    const result = await this.prisma.theater.findFirst();

    if (result) return;

    await Promise.allSettled(
      theaterList.map((ele) => {
        return this.prisma.theater.create({
          data: {
            name: ele.area_depth1,
            id: ele.id,
          },
        });
      }),
    );

    for await (const theater of theaterList) {
      for await (const screen of theater.area_depth2) {
        await this.prisma.screen.create({
          data: {
            id: screen.id,
            name: screen.txt,
            lat: (screen as any).lat || '',
            lng: (screen as any).lng || '',
            loc: (screen as any).loc || '',
            theater: {
              connect: {
                id: theater.id,
              },
            },
          },
        });
      }
    }
  }

  /* 영화관 정보 가져오기 */
  async getTheater() {
    return this.prisma.theater
      .findMany()
      .then((theater) => {
        return Promise.allSettled(
          theater.map(async (theater) => {
            const screenList = await this.prisma.screen.findMany({
              where: {
                theaterId: theater.id,
              },
            });

            return {
              id: theater.id,
              area_depth1: theater.name,
              area_depth2: screenList.map((screen) => ({
                id: screen.id,
                txt: screen.name,
                lat: screen.lat,
                lng: screen.lng,
                loc: screen.loc,
              })),
            };
          }),
        );
      })
      .then((result) => {
        return result
          .filter(({ status }) => status === 'fulfilled')
          .map(
            (result) =>
              (result as PromiseFulfilledResult<TheaterResponse>).value,
          );
      });
  }

  getTheaterList(region?: string) {
    return this.prisma.theater
      .findMany({
        where: {
          name: {
            contains: region,
          },
        },
        select: {
          id: true,
          name: true,
          screen: true,
        },
      })
      .then((result) => {
        return result.map(({ id, name, screen }) => ({
          id,
          region: name,
          theaters: screen.map(({ theaterId, ...rest }) => rest),
        }));
      });
  }

  /* 선호 영화관 가져오기 */
  getTheaterById(screenId: number) {
    return this.prisma.screen
      .findFirst({
        where: {
          id: screenId,
        },
        include: {
          theater: true,
        },
      })
      .then((result) => {
        return {
          id: result.id,
          name: result.name,
          region: result.theater.name,
          location_LO: 127.0263387,
          location_LA: 37.50166171,
        };
      });
  }
}
