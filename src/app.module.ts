import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { DailyLimitModule } from "./daily_limit/daily_limit.module";
import { UploadSizeModule } from "./upload_size/upload_size.module";
import { ImageModule } from "./image/image.module";
import { ApiLogsModule } from "./api_logs/api_logs.module";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./logging.interceptor";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    SubscriptionModule,
    DailyLimitModule,
    UploadSizeModule,
    ImageModule,
    ApiLogsModule,
    PrometheusModule.register(),
    CacheModule.register({ isGlobal: true }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
