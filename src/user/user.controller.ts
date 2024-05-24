import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { UserModal } from './interface';
import { UserUpdatePersonalDataDto, UserUpdateSubscriptionDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getUser(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserModal | null> {
    return this.userService.getUserById({ id: Number(id) });
  }
  @Get('email')
  getUserByEmail(@Query() data: { email: string }) {
    return this.userService.userByEmail(data.email);
  }

  @UseGuards(JwtGuard)
  @Patch('update/personal')
  updateUserPersonalData(
    @Body() data: UserUpdatePersonalDataDto,
    @Req() req: any
  ): Promise<UserModal | null> {
    const user: UserModal = req.user;
    if (user.id.toString() === data.id || user.role === 'ADMIN')
      return this.userService.updatePersonalData(data);
    throw new ForbiddenException('Forbidden action');
  }

  @UseGuards(JwtGuard)
  @Patch('update/subscription')
  updateUserSubscription(
    @Body() data: UserUpdateSubscriptionDto,
    @Req() req: any
  ): Promise<UserModal | null> {
    const user: UserModal = req.user;
    if (user.id.toString() === data.id || user.role === 'ADMIN')
      return this.userService.updateUserSubscription(data);
    throw new ForbiddenException('Forbidden action');
  }
}
