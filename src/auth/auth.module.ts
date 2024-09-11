import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy, GoogleStrategy } from './strategy';
import { SubscriptionService } from '../subscription/subscription.service';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { ApiLogsService } from '../api_logs/api_logs.service';
import { RefreshTokenModule } from './refresh_token/refresh_token.module';
import { TokenModule } from './token/token.module';
import { TokenService } from './token/token.service';
import { RefreshTokenService } from './refresh_token/refresh_token.service';
import { CacheService } from './cache/cache.service';
import { CacheModule } from './cache/cache.module';
import {
  LoginAuthService,
  ProviderAuthService,
  RegisterAuthService,
  RegisterWithEmailAndPasswordAuthService,
  RegisterWithProviderAuthService,
} from './services';
import { CreateUserService, GetUserService } from '../user/services';

@Module({
  imports: [
    JwtModule.register({}),
    TokenModule,
    RefreshTokenModule,
    CacheModule,
  ],
  providers: [
    RegisterAuthService,
    RegisterWithProviderAuthService,
    RegisterWithEmailAndPasswordAuthService,
    LoginAuthService,
    ProviderAuthService,
    GoogleStrategy,
    GithubStrategy,
    GetUserService,
    CreateUserService,
    SubscriptionService,
    UploadSizeService,
    DailyLimitService,
    ApiLogsService,
    TokenService,
    RefreshTokenService,
    CacheService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
