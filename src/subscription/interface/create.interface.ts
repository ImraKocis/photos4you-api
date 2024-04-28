import { SubscriptionRole } from '@prisma/client';

export interface CreateSubscriptionInterface {
  name: SubscriptionRole;
  userId: number;
  uploadSizeId: number;
  dailyLimitId: number;
}
