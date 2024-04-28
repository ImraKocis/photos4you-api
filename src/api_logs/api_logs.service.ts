import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LogCreateInterface } from './interfaces';

@Injectable()
export class ApiLogsService {
  constructor(private prismaService: PrismaService) {}

  async createLog(data: LogCreateInterface): Promise<void> {
    this.prismaService.log.create({
      data: {
        action: data.action,
        userId: data.userId,
        description: data.description,
        role: data.role,
      },
    });
  }
}
