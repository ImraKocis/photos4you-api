import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { LogCreateInterface } from "./interfaces";
import { Log } from "@prisma/client";

@Injectable()
export class ApiLogsService {
  constructor(private prismaService: PrismaService) {}

  async createLog(data: LogCreateInterface): Promise<void> {
    await this.prismaService.log.create({
      data: {
        action: data.action,
        userId: data.userId,
        description: data.description,
        role: data.role,
      },
    });
  }

  async getLogs(): Promise<Log[]> {
    return this.prismaService.log.findMany();
  }
}
