import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  public exclude<T, Key extends keyof T>(entry: T, keys: Key[]): Omit<T, Key> {
    return Object.fromEntries(
      Object.entries(entry).filter(([key]) => !keys.includes(key as Key))
    ) as Omit<T, Key>;
  }
}
