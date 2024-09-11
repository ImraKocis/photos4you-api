import { Prisma } from '@prisma/client';
export const initialUploadSizes =
  Prisma.validator<Prisma.UploadSizeCreateManyArgs>()({
    data: [
      {
        size: 2,
        subscriptionName: 'FREE',
      },
      {
        size: 5,
        subscriptionName: 'PRO',
      },
      {
        size: 10,
        subscriptionName: 'GOLD',
      },
    ],
  });
