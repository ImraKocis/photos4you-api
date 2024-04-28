import { Module } from '@nestjs/common';
import { DailyLimitService } from './daily_limit.service';

@Module({
  providers: [DailyLimitService],
})
export class DailyLimitModule {}
