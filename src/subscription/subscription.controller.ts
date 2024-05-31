import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  UseGuards,
} from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { JwtGuard } from "../auth/guard";
import { GetCurrentUserRole } from "../auth/decorator";

@Controller("subscription")
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(JwtGuard)
  @Get(":id")
  async getSubscription(
    @Param("id") id: string,
    @GetCurrentUserRole() role: string,
  ) {
    if (role === "ADMIN") return await this.subscriptionService.get(Number(id));
    throw new ForbiddenException("Forbidden action");
  }
}
