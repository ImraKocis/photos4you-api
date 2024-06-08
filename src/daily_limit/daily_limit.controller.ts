import { Controller, Get, UseGuards } from "@nestjs/common";
import { DailyLimitService } from "./daily_limit.service";
import { JwtGuard } from "../auth/guard";

@Controller("daily-limit")
export class DailyLimitController {
  constructor(private dailyLimitService: DailyLimitService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getDailyLimit() {
    return await this.dailyLimitService.getAll();
  }
}
