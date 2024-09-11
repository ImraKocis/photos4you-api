import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtGuard } from '../auth/guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getSubscription(@Param('id') id: string) {
    return await this.subscriptionService.get(Number(id));
  }
}
