import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';
import { UserModal } from '../../user/interface';
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
import { GetUserService } from '../../user/services';

@Injectable()
export class RegisterAuthService extends RegisterAuthAbstract {
  constructor(
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokenService,
    private getUserService: GetUserService,
    private subscriptionService: SubscriptionService
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
