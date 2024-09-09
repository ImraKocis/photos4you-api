import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ApiLogsService } from '../api_logs/api_logs.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private dailyLimitService: DailyLimitService,
    private uploadSizeService: UploadSizeService,
    private subscriptionService: SubscriptionService,
    private logService: ApiLogsService
  ) {}
}
