import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    })
  }

  save(user: User) {
    user.password = bcrypt.hashSync(user.password, 10);
    this.prisma.user.create({
      data: user
    })
  }

  async isExistId(id: number) {
    const count = await this.prisma.user.count({
      where: {
        id
      }
    });

    return count > 0;
  }

  update(id: number, user: Partial<User>) {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10);
    }

    this.prisma.user.update({
      data: {
        ...user
      },
      where: {
        id
      }
    })
  }
}
