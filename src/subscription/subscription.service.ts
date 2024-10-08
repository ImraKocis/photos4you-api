import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription, SubscriptionRole } from '@prisma/client';
import {
  CreateSubscriptionInterface,
  SubscriptionData,
  UpdateInterface,
} from './interface';
import { ApiLogsService } from '../api_logs/api_logs.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { UploadSizeService } from '../upload_size/upload_size.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private logService: ApiLogsService,
    private dailyLimitService: DailyLimitService,
    private uploadSizeService: UploadSizeService
  ) {}

  async create(data: CreateSubscriptionInterface): Promise<Subscription> {
    const subscription = await this.prismaService.subscription.create({
      data: {
        userId: data.userId,
        name: data.name,
        uploadSizeId: data.uploadSizeId,
        dailyLimitId: data.dailyLimitId,
      },
    });

    await this.logService.createLog({
      action: 'Create subscription',
      description: `Created ${data.name} subscription`,
      userId: data.userId,
    });

    return subscription;
  }

  async update(data: UpdateInterface, userId: number): Promise<Subscription> {
    const now = new Date();
    const oneDay = 1000 * 3600 * 24;
    const validFrom = now.getTime() + oneDay;
    await this.logService.createLog({
      action: 'Update subscription',
      description: `Updated ${data.oldSubscriptionName} subscription to ${data.newSubscriptionName}`,
      userId,
    });
    return this.prismaService.subscription.update({
      where: {
        id: Number(data.id),
      },
      data: {
        dailyLimitId: data.dailyLimitId,
        uploadSizeId: data.uploadSizeId,
        name: data.newSubscriptionName,
        odlSubscription: data.oldSubscriptionName,
        validFrom: new Date(validFrom),
      },
    });
  }

  async get(id: number): Promise<Subscription> {
    return this.prismaService.subscription.findUnique({
      where: {
        id: id,
      },
      include: {
        DailyLimit: true,
        UploadSize: true,
      },
    });
  }

  async getSubscriptionData(
    subscription: SubscriptionRole
  ): Promise<SubscriptionData> {
    const size = await this.uploadSizeService.getId(subscription);
    const limit = await this.dailyLimitService.getId(subscription);

    return { size, limit };
  }
}
