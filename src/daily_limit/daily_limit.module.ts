import { Module } from "@nestjs/common";
import { DailyLimitService } from "./daily_limit.service";
import { DailyLimitController } from "./daily_limit.controller";

@Module({
  providers: [DailyLimitService],
  controllers: [DailyLimitController],
})
export class DailyLimitModule {}
