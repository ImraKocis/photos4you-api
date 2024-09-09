import { Injectable } from '@nestjs/common';
import { SubscriptionRole } from '@prisma/client';
import { UserModal } from '../user/interface';
import {
  CreateSubscriptionInterface,
  SubscriptionData,
} from '../subscription/interface';
import { SignTokenPayloadProps, TokenReturnInterface } from './token/interface';

export abstract class RegisterAuthAbstract {
  abstract getUserByEmail(email: string): Promise<UserModal | null>;
  abstract createUserSubscription(
    data: CreateSubscriptionInterface
  ): Promise<void>;
  abstract signTokens(
    data: SignTokenPayloadProps
  ): Promise<TokenReturnInterface>;
  abstract updateRefreshTokenHash(
    userId: number,
    refreshToken: string
  ): Promise<void>;
  abstract getSubscriptionData(
    subscription: SubscriptionRole
  ): Promise<SubscriptionData>;
}

@Injectable()
export class AuthService {
  constructor() {}
}
