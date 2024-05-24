import { SubscriptionRole } from '@prisma/client';

export interface UpdateInterface {
  id: number;
  uploadSizeId: number;
  dailyLimitId: number;
  newSubscriptionName: SubscriptionRole;
  oldSubscriptionName: SubscriptionRole;
}
