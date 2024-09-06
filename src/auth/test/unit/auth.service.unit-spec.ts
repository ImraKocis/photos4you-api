import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { AuthService } from '../../auth.service';
import { UserService } from '../../../user/user.service';
import { SubscriptionService } from '../../../subscription/subscription.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { DailyLimitService } from '../../../daily_limit/daily_limit.service';
import { UploadSizeService } from '../../../upload_size/upload_size.service';
import { mock } from 'jest-mock-extended';
import { AuthRegisterDto } from '../../dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let subscriptionService: SubscriptionService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let dailyLimitService: DailyLimitService;
  let uploadSizeService: UploadSizeService;
  let cacheManager: Cache;

  beforeEach(async () => {
    userService = mock<UserService>();
    subscriptionService = mock<SubscriptionService>();
    prismaService = mock<PrismaService>();
    jwtService = mock<JwtService>();
    configService = mock<ConfigService>();
    dailyLimitService = mock<DailyLimitService>();
    uploadSizeService = mock<UploadSizeService>();
    cacheManager = mock<Cache>();

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: SubscriptionService, useValue: subscriptionService },
        { provide: PrismaService, useValue: prismaService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: DailyLimitService, useValue: dailyLimitService },
        { provide: UploadSizeService, useValue: uploadSizeService },
        { provide: 'CACHE_MANAGER', useValue: cacheManager },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  it('should register a new user successfully', async () => {
    const dto: AuthRegisterDto = {
      email: 'unit-test@example.com',
      password: 'password',
      subscription: 'FREE',
      firstName: 'John',
      lastName: 'Doe',
    };

    userService.userByEmail = jest.fn().mockResolvedValue(null);
    userService.createUser = jest
      .fn()
      .mockResolvedValue({ id: 1, email: dto.email });
    subscriptionService.create = jest.fn().mockResolvedValue({});
    jwtService.signAsync = jest.fn().mockResolvedValue('token');
    prismaService.user.update = jest.fn().mockResolvedValue({});

    const result = await authService.register(dto);

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('refreshToken');
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('ok');
  });

  it('should not register a user with an existing email', async () => {
    const dto: AuthRegisterDto = {
      email: 'unit-test@example.com',
      password: 'password',
      subscription: 'FREE',
      firstName: 'John',
      lastName: 'Doe',
    };

    userService.userByEmail = jest.fn().mockResolvedValue({});

    const result = await authService.register(dto);

    expect(result).toEqual({
      id: 0,
      refreshToken: '',
      token: '',
      ok: false,
    });
  });
});
