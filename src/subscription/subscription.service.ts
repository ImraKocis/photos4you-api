import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Subscription } from '@prisma/client';
import { CreateSubscriptionInterface } from './interface';
import { ApiLogsService } from '../api_logs/api_logs.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private prismaService: PrismaService,
    private logService: ApiLogsService
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
      description: `Created ${data.name} subscription for user ${data.userId}`,
    });

    return subscription;
  }
}
