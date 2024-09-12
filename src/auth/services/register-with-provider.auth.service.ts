import { Inject, Injectable } from '@nestjs/common';
import {
  IRegisterAuthService,
  IRegisterWithProviderAuthService,
} from '../interface';
import {
  CreateUserWithProvider,
  ICreateUserService,
  UserCreateReturnModal,
} from 'src/user/interface';
import { TokenReturnInterface } from '../token/interface';
import { AuthWithProviderDto } from '../dto';

@Injectable()
export class RegisterWithProviderAuthService
  implements IRegisterWithProviderAuthService
{
  constructor(
    @Inject(IRegisterAuthService)
    private readonly registerAuthService: IRegisterAuthService,
    @Inject(ICreateUserService)
    private readonly createUserService: ICreateUserService
  ) {}

  async register(dto: AuthWithProviderDto): Promise<TokenReturnInterface> {
    const subscriptionData =
      await this.registerAuthService.getSubscriptionData('FREE');
    const user = await this.createUserWithProvider(dto);
    await this.registerAuthService.createUserSubscription({
      name: 'FREE',
      uploadSizeId: subscriptionData.size,
      dailyLimitId: subscriptionData.limit,
      userId: user.id,
    });

    const tokens = await this.registerAuthService.signTokens({
      sub: user.id,
      email: user.email,
    });
    await this.registerAuthService.updateRefreshTokenHash(
      user.id,
      tokens.refreshToken
    );
    return tokens;
  }
  async createUserWithProvider(
    data: CreateUserWithProvider
  ): Promise<UserCreateReturnModal> {
    return await this.createUserService.createUser(data);
  }
}
