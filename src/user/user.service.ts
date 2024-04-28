import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreateModal, UserCreateReturnModal, UserModal } from './interface';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async userByEmail(email: string): Promise<UserModal | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return this.prisma.exclude(user, ['passwordHash']);
    } catch (e) {
      return null;
      // throw new NotFoundException('User dose not exists');
    }
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.userByEmail(email);
    return !!user;
  }

  async createUser(data: UserCreateModal): Promise<UserCreateReturnModal> {
    try {
      return this.prisma.user.create({
        data: {
          email: data.email,
          provider: data.provider,
          firstName: data.firstName,
          lastName: data.lastName,
          passwordHash: data.passwordHash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ForbiddenException('Email already exists');
      }
      throw e;
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
}
