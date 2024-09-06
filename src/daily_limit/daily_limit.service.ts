import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyLimit, SubscriptionRole } from '@prisma/client';

@Injectable()
export class DailyLimitService {
  constructor(private prismaService: PrismaService) {}

  async createInitial(): Promise<void> {
    await this.prismaService.dailyLimit.createMany({
      data: [
        {
          limit: 3,
          subscriptionName: 'FREE',
        },
        {
          limit: 7,
          subscriptionName: 'PRO',
        },
        {
          limit: 10,
          subscriptionName: 'GOLD',
        },
      ],
    });
  }

  async getAll(): Promise<DailyLimit[]> {
    return this.prismaService.dailyLimit.findMany();
  }

  async getId(subscription: SubscriptionRole): Promise<number> {
    const result = await this.prismaService.dailyLimit.findFirst({
      where: {
        subscriptionName: subscription,
      },
    });
    return result.id;
  }
}
