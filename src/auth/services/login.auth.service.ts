import { ForbiddenException, Injectable } from '@nestjs/common';
import { ILoginWithEmailAndPasswordAuthService } from '../interface/auth.service.interfaces';
import { AuthDto } from '../dto';
import {
  TokenReturnInterface,
  SignTokenPayloadProps,
} from '../token/interface';
import { User } from '@prisma/client';
import { GetUserService } from '../../user/services';
import { TokenService } from '../token/token.service';
import { RefreshTokenService } from '../refresh_token/refresh_token.service';

import * as argon from 'argon2';

@Injectable()
export class LoginAuthService implements ILoginWithEmailAndPasswordAuthService {
  constructor(
    private getUserService: GetUserService,
    private tokenService: TokenService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    return await this.getUserService.getCriticalUserDataWithEmail(email);
  }

  async checkPassword(
    passwordHash: string,
    password: string
  ): Promise<boolean> {
    return await argon.verify(passwordHash, password);
  }

  async signTokens(data: SignTokenPayloadProps): Promise<TokenReturnInterface> {
    return await this.tokenService.signToken(data);
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<void> {
    await this.refreshTokenService.updateRtHash(userId, refreshToken);
  }

  async login(dto: AuthDto): Promise<TokenReturnInterface> {
    const user = await this.getUserByEmail(dto.email);
    if (!user)
      throw new ForbiddenException('User with this email dose not exits');

    const passwordMatches = await this.checkPassword(
      user.passwordHash,
      dto.password
    );

    if (!passwordMatches)
      throw new ForbiddenException('Email or password are wrong');

    const tokens = await this.signTokens({ sub: user.id, email: user.email });
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
