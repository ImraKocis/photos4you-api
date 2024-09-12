import {
  CreateUserWithEmailAndPassword,
  ICreateUserService,
  UserCreateReturnModal,
} from 'src/user/interface';
import { TokenReturnInterface } from '../token/interface';
import {
  IRegisterAuthService,
  IRegisterWithEmailAndPasswordAuthService,
} from '../interface';
import { AuthRegisterDto } from '../dto';
import { Inject, Injectable } from '@nestjs/common';

import * as argon from 'argon2';

@Injectable()
export class RegisterWithEmailAndPasswordAuthService
  implements IRegisterWithEmailAndPasswordAuthService
{
  constructor(
    @Inject(IRegisterAuthService)
    private readonly registerAuthService: IRegisterAuthService,
    @Inject(ICreateUserService)
    private readonly createUserService: ICreateUserService
  ) {}
  async hashUserPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  async createUserWithEmailAndPassword(
    data: CreateUserWithEmailAndPassword
  ): Promise<UserCreateReturnModal> {
    return await this.createUserService.createUser(data);
  }

  async register(dto: AuthRegisterDto): Promise<TokenReturnInterface> {
    const userByEmail = await this.registerAuthService.getUserByEmail(
      dto.email
    );
    if (userByEmail)
      return {
        id: 0,
        refreshToken: '',
        token: '',
        ok: false,
      };
    const passwordHash = await this.hashUserPassword(dto.password);
    const user = await this.createUserWithEmailAndPassword({
      passwordHash,
      ...dto,
    });
    const subscriptionData = await this.registerAuthService.getSubscriptionData(
      dto.subscription
    );
    await this.registerAuthService.createUserSubscription({
      name: dto.subscription,
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
}
