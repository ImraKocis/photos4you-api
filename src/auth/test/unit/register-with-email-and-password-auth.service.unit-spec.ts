import { Test, TestingModule } from '@nestjs/testing';
import { RegisterWithEmailAndPasswordAuthService } from '../../services';
import { AuthRegisterDto } from '../../dto';
import * as argon from 'argon2';
import {
  IRegisterAuthService,
  IRegisterWithEmailAndPasswordAuthService,
} from '../../interface';
import { ICreateUserService } from '../../../user/interface';

describe('RegisterWithEmailAndPasswordAuthService', () => {
  let service: IRegisterWithEmailAndPasswordAuthService;
  let registerAuthService: IRegisterAuthService;
  let createUserService: ICreateUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IRegisterWithEmailAndPasswordAuthService,
          useClass: RegisterWithEmailAndPasswordAuthService,
        },
        {
          provide: IRegisterAuthService,
          useValue: {
            getUserByEmail: jest.fn(),
            getSubscriptionData: jest.fn(),
            createUserSubscription: jest.fn(),
            signTokens: jest.fn(),
            updateRefreshTokenHash: jest.fn(),
          },
        },
        {
          provide: ICreateUserService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IRegisterWithEmailAndPasswordAuthService>(
      IRegisterWithEmailAndPasswordAuthService
    );
    registerAuthService =
      module.get<IRegisterAuthService>(IRegisterAuthService);
    createUserService = module.get<ICreateUserService>(ICreateUserService);
  });

  it('should register a new user successfully', async () => {
    const dto: AuthRegisterDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      subscription: 'FREE',
    };

    jest.spyOn(registerAuthService, 'getUserByEmail').mockResolvedValue({
      id: 1,
      email: 'test@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 'USER',
      firstName: 'John',
      lastName: 'Doe',
    });

    const result = await service.register(dto);

    expect(result).toEqual({ id: 0, refreshToken: '', token: '', ok: false });
    expect(registerAuthService.getUserByEmail).toHaveBeenCalledWith(dto.email);
  });

  it('should hash the password and create a user', async () => {
    const dto: AuthRegisterDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      subscription: 'FREE',
    };

    jest.spyOn(registerAuthService, 'getUserByEmail').mockResolvedValue(null);
    jest.spyOn(argon, 'hash').mockResolvedValue('hashedPassword');
    jest
      .spyOn(createUserService, 'createUser')
      .mockResolvedValue({ id: 1, email: dto.email, createdAt: new Date() });

    jest
      .spyOn(registerAuthService, 'getSubscriptionData')
      .mockResolvedValue({ size: 100, limit: 10 });
    jest.spyOn(registerAuthService, 'signTokens').mockResolvedValue({
      token: 'token',
      refreshToken: 'refreshToken',
      id: 1,
      ok: true,
    });
    jest
      .spyOn(registerAuthService, 'updateRefreshTokenHash')
      .mockResolvedValue();

    const result = await service.register(dto);

    expect(argon.hash).toHaveBeenCalledWith(dto.password);
    expect(createUserService.createUser).toHaveBeenCalledWith({
      passwordHash: 'hashedPassword',
      ...dto,
    });
    expect(result).toEqual({
      token: 'token',
      refreshToken: 'refreshToken',
      id: 1,
      ok: true,
    });
  });
});
