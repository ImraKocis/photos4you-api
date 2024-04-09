import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreateModal, UserModal } from './interface/user.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private exclude<User, Key extends keyof User>(
    user: User,
    keys: Key[]
  ): Omit<User, Key> {
    return Object.fromEntries(
      Object.entries(user).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<User, Key>;
  }

  async userByEmail(email: string): Promise<UserModal | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      return this.exclude(user, ['passwordHash']);
    } catch (e) {
      return null;
      // throw new NotFoundException('User dose not exists');
    }
  }

  async checkIfUserExists(email: string): Promise<boolean> {
    const user = await this.userByEmail(email);
    return !!user;
  }

  async createUserWithProvider(
    data: UserCreateModal
  ): Promise<UserModal | null> {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          provider: data.provider,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      });
      return this.exclude(user, ['passwordHash']);
    } catch {
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
    return this.exclude(user, ['passwordHash']);
  }
}
