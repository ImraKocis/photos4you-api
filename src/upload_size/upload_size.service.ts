import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionRole, UploadSize } from '@prisma/client';

@Injectable()
export class UploadSizeService {
  constructor(private prismaService: PrismaService) {}

  async getAll(): Promise<UploadSize[]> {
    return this.prismaService.uploadSize.findMany();
  }

  async getId(subscription: SubscriptionRole): Promise<number> {
    const result = await this.prismaService.uploadSize.findFirst({
      where: {
        subscriptionName: subscription,
      },
    });
    return result.id;
  }
}
