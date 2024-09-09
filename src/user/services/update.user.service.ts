import { Injectable } from '@nestjs/common';
import { IUpdateUserService, UserModal } from '../interface';
import { UserUpdatePersonalDataDto, UserUpdateRoleDto } from '../dto';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiLogsService } from '../../api_logs/api_logs.service';

@Injectable()
export class UpdateUserService implements IUpdateUserService {
  constructor(
    private prisma: PrismaService,
    private logService: ApiLogsService
  ) {}
  async updatePersonalData(
    dto: UserUpdatePersonalDataDto
  ): Promise<UserModal | null> {
    const user = await this.prisma.user.update({
      where: {
        id: Number(dto.id),
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    await this.logService.createLog({
      action: 'User updated',
      description: `User with ID: ${dto.id} personal data updated`,
      userId: Number(dto.id),
    });
    return this.prisma.exclude(user, ['passwordHash']);
  }

  async updateRole(dto: UserUpdateRoleDto): Promise<UserModal> {
    await this.logService.createLog({
      action: 'User role updated',
      description: `User with ID: ${dto.id} role updated to ${dto.role}`,
      userId: Number(dto.id),
    });
    const user = await this.prisma.user.update({
      where: {
        id: Number(dto.id),
      },
      data: {
        role: dto.role,
      },
    });

    return this.prisma.exclude(user, ['passwordHash', 'hashedRt']);
  }
}
