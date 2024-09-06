import { Test } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { UserService } from '../../user.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DailyLimitService } from '../../../daily_limit/daily_limit.service';
import { UploadSizeService } from '../../../upload_size/upload_size.service';
import { SubscriptionService } from '../../../subscription/subscription.service';
import { ApiLogsService } from '../../../api_logs/api_logs.service';
import { UserCreateModal } from '../../interface';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  let dailyLimitService: DailyLimitService;
  let uploadSizeService: UploadSizeService;
  let subscriptionService: SubscriptionService;
  let logService: ApiLogsService;

  beforeEach(async () => {
    prismaService = mock<PrismaService>();
    dailyLimitService = mock<DailyLimitService>();
    uploadSizeService = mock<UploadSizeService>();
    subscriptionService = mock<SubscriptionService>();
    logService = mock<ApiLogsService>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prismaService },
        { provide: DailyLimitService, useValue: dailyLimitService },
        { provide: UploadSizeService, useValue: uploadSizeService },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: ApiLogsService, useValue: logService },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
  });

  it('should create a new user successfully', async () => {
    const dto: UserCreateModal = {
      email: 'test@example.com',
      passwordHash: 'password',
      provider: 'EMAIL',
      firstName: 'Test',
      lastName: 'User',
      picture: 'test.jpg',
    };

    prismaService.user.create = jest.fn().mockResolvedValue({
      id: 1,
      email: dto.email,
      createdAt: new Date(),
    });

    const result = await userService.createUser(dto);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('email');
    expect(result).toHaveProperty('createdAt');
  });

  it('should not create a user with an existing email', async () => {
    const dto: UserCreateModal = {
      email: 'test@example.com',
      passwordHash: 'password',
      provider: 'EMAIL',
      firstName: 'Test',
      lastName: 'User',
      picture: 'test.jpg',
    };

    prismaService.user.create = jest.fn().mockRejectedValue(new Error());

    await expect(userService.createUser(dto)).rejects.toThrow(Error);
  });
});
