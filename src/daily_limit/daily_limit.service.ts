import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyLimit, SubscriptionRole } from '@prisma/client';

@Injectable()
export class DailyLimitService {
  constructor(private prismaService: PrismaService) {}

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
