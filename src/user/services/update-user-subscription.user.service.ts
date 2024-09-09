import { Injectable } from '@nestjs/common';
import { IUpdateUserSubscriptionService, UserModal } from '../interface';
import { UpdateInterface } from 'src/subscription/interface';
import { UserUpdateSubscriptionDto } from '../dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadSizeService } from '../../upload_size/upload_size.service';
import { DailyLimitService } from '../../daily_limit/daily_limit.service';
import { SubscriptionService } from '../../subscription/subscription.service';

@Injectable()
export class UpdateUserSubscriptionUserService
  implements IUpdateUserSubscriptionService
{
  constructor(
    private prisma: PrismaService,
    private uploadSizeService: UploadSizeService,
    private dailyLimitService: DailyLimitService,
    private subscriptionService: SubscriptionService
  ) {}
  async handleDataForSubscriptionUpdate(
    dto: UserUpdateSubscriptionDto
  ): Promise<UpdateInterface> {
    const uploadSizes = await this.uploadSizeService.getAll();
    const dailyLimits = await this.dailyLimitService.getAll();

    return {
      id: Number(dto.subscriptionId),
      uploadSizeId: uploadSizes.find(
        (element) => element.subscriptionName == dto.subscriptionName
      ).id,
      dailyLimitId: dailyLimits.find(
        (element) => element.subscriptionName == dto.subscriptionName
      ).id,
      oldSubscriptionName: dto.odlSubscriptionName,
      newSubscriptionName: dto.subscriptionName,
    };
  }
  async updateUserSubscription(
    dto: UserUpdateSubscriptionDto
  ): Promise<UserModal | null> {
    const subscriptionData = await this.handleDataForSubscriptionUpdate(dto);
    const newSubscription = await this.subscriptionService.update(
      subscriptionData,
      Number(dto.id)
    );

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
