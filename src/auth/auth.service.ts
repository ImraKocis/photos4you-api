import { SubscriptionRole } from '@prisma/client';
import { UserModal } from '../user/interface';
import {
  CreateSubscriptionInterface,
  SubscriptionData,
} from '../subscription/interface';
import { SignTokenPayloadProps, TokenReturnInterface } from './token/interface';
import { IRegisterAuthAbstract } from './interface';

// Dependency Inversion Principle (DIP)
export abstract class RegisterAuthAbstract implements IRegisterAuthAbstract {
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
