import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import {
  GetCurrentUserId,
  GetCurrentUserRole,
  GetUser,
} from '../auth/decorator';
import { Role, User } from '@prisma/client';
import { UserModal } from './interface';
import {
  UserUpdatePersonalDataDto,
  UserUpdateRoleDto,
  UserUpdateSubscriptionDto,
} from './dto';
import {
  DeleteUserService,
  GetUserService,
  UpdateUserService,
  UpdateUserSubscriptionUserService,
} from './services';

@Controller('user')
export class UserController {
  constructor(
    private getUserService: GetUserService,
    private updateUserService: UpdateUserService,
    private updateUserSubscriptionService: UpdateUserSubscriptionUserService,
    private deleteUserService: DeleteUserService
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserModal | null> {
    return this.getUserService.getUserById({ id: Number(id) });
  }
  @Get('email')
  getUserByEmail(@Query() data: { email: string }) {
    return this.getUserService.getUserByEmail(data.email);
  }

  @UseGuards(JwtGuard)
  @Patch('update/personal')
  updateUserPersonalData(
    @Body() data: UserUpdatePersonalDataDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserRole() role: Role
  ): Promise<UserModal | null> {
    if (userId.toString() === data.id || role === 'ADMIN')
      return this.updateUserService.updatePersonalData(data);
    throw new ForbiddenException('Forbidden action');
  }

  @UseGuards(JwtGuard)
  @Patch('update/subscription')
  updateUserSubscription(
    @Body() data: UserUpdateSubscriptionDto,
    @GetCurrentUserId() userId: number,
    @GetCurrentUserRole() role: Role
  ): Promise<UserModal | null> {
    if (userId.toString() === data.id || role === 'ADMIN')
      return this.updateUserSubscriptionService.updateUserSubscription(data);
    throw new ForbiddenException('Forbidden action');
  }

  @UseGuards(JwtGuard)
  @Get('admin/all')
  getAllUsers(@GetCurrentUserRole() role: Role): Promise<UserModal[]> {
    return this.getUserService.getAll(role);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @GetCurrentUserRole() role: Role
  ): Promise<boolean | null> {
    if (role !== 'ADMIN') throw new ForbiddenException('Forbidden action');
    return this.deleteUserService.deleteUser(Number(id));
  }

  @UseGuards(JwtGuard)
  @Patch('update/role')
  updateUserRole(
    @Body() data: UserUpdateRoleDto,
    @GetCurrentUserRole() role: Role
  ): Promise<UserModal | null> {
    if (role !== 'ADMIN') throw new ForbiddenException('Forbidden action');
    return this.updateUserService.updateRole(data);
  }
}
