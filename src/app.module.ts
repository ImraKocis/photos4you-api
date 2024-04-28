import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HardwareModule } from './hardware/hardware.module';
import { ReviewModule } from './review/review.module';
import { PostModule } from './post/post.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { DailyLimitModule } from './daily_limit/daily_limit.module';
import { UploadSizeModule } from './upload_size/upload_size.module';
import { ImageModule } from './image/image.module';
import { ApiLogsModule } from './api_logs/api_logs.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    HardwareModule,
    ReviewModule,
    PostModule,
    SubscriptionModule,
    DailyLimitModule,
    UploadSizeModule,
    ImageModule,
    ApiLogsModule,
  ],
})
export class AppModule {}
