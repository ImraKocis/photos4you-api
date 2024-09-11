import { Injectable } from '@nestjs/common';
import { IDeleteUserService } from '../interface';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiLogsService } from '../../api_logs/api_logs.service';

@Injectable()
export class DeleteUserService implements IDeleteUserService {
  constructor(
    private prisma: PrismaService,
    private logService: ApiLogsService
  ) {}
  async deleteUser(id: number): Promise<boolean | null> {
    try {
      await this.logService.createLog({
        action: 'User deleted',
        description: `User with ID: ${id} deleted`,
        userId: id,
      });
      const user = await this.prisma.user.delete({
        where: {
          id: id,
        },
        include: { posts: true, subscription: true },
      });
      return !!user;
    } catch (e) {
      return null;
    }
  }
}
