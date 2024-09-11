import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { UploadSizeService } from '../upload_size/upload_size.service';

@Module({
  providers: [SubscriptionService, DailyLimitService, UploadSizeService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
