import { Injectable } from '@nestjs/common';
import { SignTokenPayloadProps, TokenReturnInterface } from './interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async signToken(
    payload: SignTokenPayloadProps
  ): Promise<TokenReturnInterface> {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '30m',
      secret: this.configService.get('JWT_SECRET'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get('REFRESH_JWT_SECRET'),
    });

    return {
      token,
      refreshToken,
      id: payload.sub,
      ok: true,
    };
  }
}
