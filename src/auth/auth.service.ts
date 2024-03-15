import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      return this.signToken(user.id, user.email, user.createdAt);
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

    return this.signToken(user.id, user.email, user.createdAt);
  }

  async signToken(
    userId: number,
    email: string,
    createdAt: Date
  ): Promise<{ access_token: string; userId: number }> {
    const payload = {
      sub: userId,
      email,
      createdAt,
    };
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '30m',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token,
      userId,
    };
  }
}
