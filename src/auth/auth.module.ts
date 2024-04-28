import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy, JwtStrategy } from './strategy';
import { GoogleStrategy } from './strategy';
import { UserService } from '../user/user.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { RefreshTokenStrategy } from './strategy/refresh-token.strategy';
import { ApiLogsService } from '../api_logs/api_logs.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    GithubStrategy,
    UserService,
    SubscriptionService,
    UploadSizeService,
    DailyLimitService,
    ApiLogsService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
