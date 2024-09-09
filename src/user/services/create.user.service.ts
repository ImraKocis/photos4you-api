import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  ICreateUserService,
  UserCreateModal,
  UserCreateReturnModal,
} from '../interface';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiLogsService } from '../../api_logs/api_logs.service';

@Injectable()
export class CreateUserService implements ICreateUserService {
  constructor(
    private prisma: PrismaService,
    private logService: ApiLogsService
  ) {}
  async createUser(data: UserCreateModal): Promise<UserCreateReturnModal> {
    try {
      await this.logService.createLog({
        action: 'User created',
        description: `User created with email ${data.email}`,
      });
      return await this.prisma.user.create({
        data: {
          email: data.email,
          provider: data.provider,
          firstName: data.firstName,
          lastName: data.lastName,
          passwordHash: data.passwordHash,
          avatar: data.picture,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new ForbiddenException('Email already exists');
      }
      throw e;
    }
  }
}
