import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { SubscriptionService } from '../subscription/subscription.service';
import {
  CreateUserService,
  DeleteUserService,
  GetUserService,
  UpdateUserService,
  UpdateUserSubscriptionUserService,
} from './services';

@Module({
  providers: [
    UserService,
    GetUserService,
    UpdateUserService,
    UpdateUserSubscriptionUserService,
    CreateUserService,
    DeleteUserService,
    UploadSizeService,
    DailyLimitService,
    SubscriptionService,
  ],
  controllers: [UserController],
})
export class UserModule {}
