import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserCreateModal, UserCreateReturnModal, UserModal } from './interface';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  UserUpdatePasswordDto,
  UserUpdatePersonalDataDto,
  UserUpdateSubscriptionDto,
} from './dto';
import * as argon from 'argon2';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private dailyLimitService: DailyLimitService,
    private uploadSizeService: UploadSizeService,
    private subscriptionService: SubscriptionService
  ) {}

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
          avatar: data.picture,
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

  async updatePersonalData(
    dto: UserUpdatePersonalDataDto
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.update({
      where: {
        id: Number(dto.id),
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });

    return this.prisma.exclude(user, ['passwordHash']);
  }

  async updateUserPassword(
    dto: UserUpdatePasswordDto
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(dto.id) },
    });
    const passwordMatches = await argon.verify(
      user.passwordHash,
      dto.currentPassword
    );
    if (!passwordMatches) throw new ForbiddenException('incorrect credentials');
    const newPasswordHash = await argon.hash(dto.newPassword);

    const newUserData = await this.prisma.user.update({
      where: { id: Number(dto.id) },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return this.prisma.exclude(newUserData, ['passwordHash']);
  }

  async updateUserSubscription(
    data: UserUpdateSubscriptionDto
  ): Promise<UserModal | null> {
    const uploadSizes = await this.uploadSizeService.getAll();
    const dailyLimits = await this.dailyLimitService.getAll();

    const newSubscription = await this.subscriptionService.update({
      id: Number(data.subscriptionId),
      uploadSizeId: uploadSizes.find(
        (element) => element.subscriptionName == data.subscriptionName
      ).id,
      dailyLimitId: dailyLimits.find(
        (element) => element.subscriptionName == data.subscriptionName
      ).id,
      oldSubscriptionName: data.odlSubscriptionName,
      newSubscriptionName: data.subscriptionName,
    });

    const user = await this.prisma.user.update({
      where: {
        id: newSubscription.userId,
      },
      data: {
        lastSubscriptionChange: newSubscription.updatedAt,
      },
      include: { posts: true, subscription: true },
    });

    return this.prisma.exclude(user, ['passwordHash']);
  }
}
