import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthRegisterDto, AuthWithProviderDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interface';
import { SubscriptionRole } from '@prisma/client';
import { TokenReturnInterface } from './interface';
import { UserService } from '../user/user.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { DailyLimitService } from '../daily_limit/daily_limit.service';
import { UploadSizeService } from '../upload_size/upload_size.service';
import { ApiLogsService } from '../api_logs/api_logs.service';

//https://www.youtube.com/watch?v=uAKzFhE3rxU
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
    private dailyLimitService: DailyLimitService,
    private uploadSizeService: UploadSizeService,
    private logService: ApiLogsService
  ) {}
  async register(dto: AuthRegisterDto): Promise<TokenReturnInterface> {
    const passwordHash = await argon.hash(dto.password);
    const subscriptionData = await this.getSubscriptionData(dto.subscription);

    const user = await this.userService.createUser({ passwordHash, ...dto });

    await this.subscriptionService.create({
      name: dto.subscription,
      userId: user.id,
      uploadSizeId: subscriptionData.size,
      dailyLimitId: subscriptionData.limit,
    });

    await this.logService.createLog({
      action: 'User created',
      description: 'User created with email and password',
      userId: user.id,
    });
    const tokens = await this.signToken({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async registerWithProvider(
    dto: AuthWithProviderDto
  ): Promise<TokenReturnInterface> {
    const subscriptionData = await this.getSubscriptionData('FREE');

    const user = await this.userService.createUser(dto);

    await this.subscriptionService.create({
      name: 'FREE',
      userId: user.id,
      uploadSizeId: subscriptionData.size,
      dailyLimitId: subscriptionData.limit,
    });

    await this.logService.createLog({
      action: 'User created',
      description: 'User created with email and password',
      userId: user.id,
    });

    const tokens = await this.signToken({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async login(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('incorrect credentials');

    const passwordMatches = await argon.verify(user.passwordHash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('incorrect credentials');

    const tokens = await this.signToken({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async signToken(payload: JwtPayload): Promise<TokenReturnInterface> {
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
      email: payload.email,
    };
  }

  async refreshTokens(
    userId: number,
    rt: string
  ): Promise<TokenReturnInterface> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.signToken({ sub: user.id, email: user.email });
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async getToken(payload: JwtPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30m',
    });
  }

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }

  async getSubscriptionData(
    subscription: SubscriptionRole
  ): Promise<{ size: number; limit: number }> {
    const size = await this.uploadSizeService.getId(subscription);
    const limit = await this.dailyLimitService.getId(subscription);

    return { size, limit };
  }
}
