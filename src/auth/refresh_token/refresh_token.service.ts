import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class RefreshTokenService {
  constructor(private prismaService: PrismaService) {}

  async updateRtHash(userId: number, rt: string) {
    const hash = await argon.hash(rt);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { hashedRt: hash },
    });
  }
}
