import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interface/payload.interface';
import { SubscriptionRole } from '@prisma/client';

//https://www.youtube.com/watch?v=uAKzFhE3rxU
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}
  async register(dto: AuthDto) {
    const passwordHash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      const uploadSizeId = await this.getUploadSize(dto.subscription);
      const dailyLimitId = await this.getDailyLimit(dto.subscription);

      await this.prisma.subscription.create({
        data: {
          name: dto.subscription,
          userId: user.id,
          uploadSizeId: uploadSizeId,
          dailyLimitId: dailyLimitId,
        },
      });
      return this.signToken({ sub: user.id, email: user.email });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ForbiddenException('Email already exists');
      }
      throw e;
    }
  }

  async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('incorrect credentials');

    const passwordMatches = await argon.verify(user.passwordHash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('incorrect credentials');

    return this.signToken({ sub: user.id, email: user.email });
  }

  async signToken(
    payload: JwtPayload
  ): Promise<{ token: string; userId: number }> {
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      token,
      userId: payload.sub,
    };
  }

  async getToken(payload: JwtPayload): Promise<string> {
    return await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '30m',
    });
  }

  async getUploadSize(subscription: SubscriptionRole): Promise<number> {
    const size = await this.prisma.uploadSize.findFirst({
      where: {
        subscriptionName: subscription,
      },
      select: { id: true },
    });
    return size.id;
  }

  async getDailyLimit(subscription: SubscriptionRole): Promise<number> {
    const limit = await this.prisma.dailyLimit.findFirst({
      where: {
        subscriptionName: subscription,
      },
      select: {
        id: true,
      },
    });
    return limit.id;
  }
}
