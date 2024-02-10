import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/auth/interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findOne(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        userId
      }
    })
  }

  async save(user: SignUpDto) {
    user.password = bcrypt.hashSync(user.password, 10);
    delete user.passwordConfirm;

    await this.prisma.user.create({
      data: user
    })
  }

  async isExistUserId(userId: string) {
    const count = await this.prisma.user.count({
      where: {
        userId
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
