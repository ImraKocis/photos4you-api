import { Prisma } from '@prisma/client';
export const initialDailyLimits =
  Prisma.validator<Prisma.DailyLimitCreateManyArgs>()({
    data: [
      {
        limit: 3,
        subscriptionName: 'FREE',
      },
      {
        limit: 7,
        subscriptionName: 'PRO',
      },
      {
        limit: 10,
        subscriptionName: 'GOLD',
      },
    ],
  });
