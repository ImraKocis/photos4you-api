import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { IGetUserService, UserModal } from '../../user/interface';
import { SubscriptionService } from '../../subscription/subscription.service';
import {
  CreateSubscriptionInterface,
  SubscriptionData,
} from '../../subscription/interface';
import {
  SignTokenPayloadProps,
  TokenReturnInterface,
} from '../token/interface';
import { SubscriptionRole } from '@prisma/client';
import { RegisterAuthAbstract } from '../auth.service';
import { IRegisterAuthService } from '../interface';

// Single Responsibility Principle (SRP)
@Injectable()
export class RegisterAuthService
  extends RegisterAuthAbstract
  implements IRegisterAuthService
{
  constructor(
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokenService,
    private subscriptionService: SubscriptionService,
    @Inject(IGetUserService) private readonly getUserService: IGetUserService
  ) {
    super();
  }
  async getUserByEmail(email: string): Promise<UserModal | null> {
    return await this.getUserService.getUserByEmail(email);
  }
  async createUserSubscription(
    data: CreateSubscriptionInterface
  ): Promise<void> {
    await this.subscriptionService.create(data);
  }
  async signTokens(data: SignTokenPayloadProps): Promise<TokenReturnInterface> {
    return await this.tokenService.signToken(data);
  }
  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await this.refreshTokenService.updateRtHash(userId, refreshToken);
  }

  async getSubscriptionData(
    subscription: SubscriptionRole
  ): Promise<SubscriptionData> {
    return await this.subscriptionService.getSubscriptionData(subscription);
  }
}
