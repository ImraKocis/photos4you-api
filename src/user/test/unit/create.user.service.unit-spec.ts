import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { CreateUserService } from '../../services';
import { PrismaService } from '../../../prisma/prisma.service';
import { ApiLogsService } from '../../../api_logs/api_logs.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Provider } from '@prisma/client';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let prismaService: PrismaService;
  let logService: ApiLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
        {
          provide: ApiLogsService,
          useValue: {
            createLog: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    prismaService = module.get<PrismaService>(PrismaService);
    logService = module.get<ApiLogsService>(ApiLogsService);
  });

  it('should create a user and log the action', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const createdUser = {
      id: 1,
      email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastName: 'John Doe',
      firstName: userData.firstName,
      passwordHash: '',
      provider: 'EMAIL',
      hashedRt: null,
      role: 'USER',
      avatar: null,
      lastSubscriptionChange: null,
    };

    jest.spyOn(prismaService.user, 'create').mockResolvedValue({
      id: 1,
      email: createdUser.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastName: createdUser.lastName,
      firstName: createdUser.firstName,
      passwordHash: createdUser.passwordHash,
      provider: createdUser.provider as Provider,
      hashedRt: null,
      role: 'USER',
      avatar: createdUser.avatar,
      lastSubscriptionChange: null,
    });

    const result = await service.createUser(userData);

    expect(logService.createLog).toHaveBeenCalledWith({
      action: 'User created',
      description: `User created with email ${userData.email}`,
    });
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
    expect(result).toEqual(createdUser);
  });

  it('should throw ForbiddenException if email already exists', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const prismaError = new PrismaClientKnownRequestError(
      'Email already exists',
      { code: 'P2002', clientVersion: '2.0.0' }
    );

    jest.spyOn(prismaService.user, 'create').mockRejectedValue(prismaError);

    await expect(service.createUser(userData)).rejects.toThrow(
      ForbiddenException
    );
  });

  it('should throw an error if an unexpected error occurs', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const unexpectedError = new Error('Unexpected Error');

    jest.spyOn(prismaService.user, 'create').mockRejectedValue(unexpectedError);

    await expect(service.createUser(userData)).rejects.toThrow(
      'Unexpected Error'
    );
  });
});
