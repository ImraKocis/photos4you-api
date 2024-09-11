import { ForbiddenException, Injectable } from '@nestjs/common';
import { IGetUserService, UserModal } from '../interface';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GetUserService implements IGetUserService {
  constructor(private prisma: PrismaService) {}

  async getCriticalUserDataWithEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  async getUserByEmail(email: string): Promise<UserModal | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return this.prisma.exclude(user, ['passwordHash']);
    } catch (e) {
      return null;
    }
  }
  async getUserById(
    id: Prisma.UserWhereUniqueInput
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.findUnique({
      where: id,
      include: { posts: true, subscription: true },
    });
    return this.prisma.exclude(user, ['passwordHash']);
  }
  async getAll(role: Role): Promise<UserModal[]> {
    if (role !== 'ADMIN') throw new ForbiddenException('Forbidden access');
    const users = await this.prisma.user.findMany({
      include: { posts: true, subscription: true },
      orderBy: { id: 'asc' },
    });

    return users.map((user) => this.prisma.exclude(user, ['passwordHash']));
  }
}
