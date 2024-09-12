import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { SubscriptionService } from '../subscription/subscription.service';
import {
  CreateUserService,
  DeleteUserService,
  GetUserService,
  UpdateUserService,
  UpdateUserSubscriptionUserService,
} from './services';
import {
  ICreateUserService,
  IDeleteUserService,
  IGetUserService,
  IUpdateUserService,
  IUpdateUserSubscriptionService,
} from './interface';
import { UploadSizeService } from '../upload_size/upload_size.service';

@Module({
  providers: [
    { provide: IGetUserService, useClass: GetUserService },
    { provide: IUpdateUserService, useClass: UpdateUserService },
    {
      provide: IUpdateUserSubscriptionService,
      useClass: UpdateUserSubscriptionUserService,
    },
    { provide: ICreateUserService, useClass: CreateUserService },
    { provide: IDeleteUserService, useClass: DeleteUserService },
    DailyLimitService,
    UploadSizeService,
    SubscriptionService,
  ],
  controllers: [UserController],
})
export class UserModule {}
