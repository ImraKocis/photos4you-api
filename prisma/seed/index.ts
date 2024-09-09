import { PrismaClient } from '@prisma/client';
import { initialDailyLimits } from './daily_limit.seed';
import { initialUploadSizes } from './upload_size.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.dailyLimit.createMany(initialDailyLimits);
  await prisma.uploadSize.createMany(initialUploadSizes);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
