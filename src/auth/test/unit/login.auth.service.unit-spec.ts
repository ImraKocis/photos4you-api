import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { LoginAuthService } from '../../services';
import { TokenService } from '../../token/token.service';
import { RefreshTokenService } from '../../refresh_token/refresh_token.service';
import { AuthDto } from '../../dto';
import { User } from '@prisma/client';
import { IGetUserService } from '../../../user/interface';

describe('LoginAuthService', () => {
  let service: LoginAuthService;
  let getUserService: IGetUserService;
  let tokenService: TokenService;
  let refreshTokenService: RefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginAuthService,
        {
          provide: IGetUserService,
          useValue: {
            getCriticalUserDataWithEmail: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            signToken: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            updateRtHash: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoginAuthService>(LoginAuthService);
    getUserService = module.get<IGetUserService>(IGetUserService);
    tokenService = module.get<TokenService>(TokenService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
  });

  it('should throw a ForbiddenException if the user does not exist', async () => {
    // Arrange
    const dto: AuthDto = { email: 'test@example.com', password: 'password' };
    jest
      .spyOn(getUserService, 'getCriticalUserDataWithEmail')
      .mockResolvedValue(null);

    // Act & Assert
    await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    expect(getUserService.getCriticalUserDataWithEmail).toHaveBeenCalledWith(
      dto.email
    );
  });

  it('should throw a ForbiddenException if the password is incorrect', async () => {
    // Arrange
    const dto: AuthDto = {
      email: 'test@example.com',
      password: 'wrong-password',
    };
    const user: User = {
      avatar: '',
      createdAt: undefined,
      firstName: '',
      hashedRt: '',
      lastName: '',
      lastSubscriptionChange: undefined,
      provider: undefined,
      role: undefined,
      updatedAt: undefined,
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
    };
    jest
      .spyOn(getUserService, 'getCriticalUserDataWithEmail')
      .mockResolvedValue(user);
    jest.spyOn(argon, 'verify').mockResolvedValue(false);

    // Act & Assert
    await expect(service.login(dto)).rejects.toThrow(ForbiddenException);
    expect(argon.verify).toHaveBeenCalledWith(user.passwordHash, dto.password);
  });

  it('should return tokens if the user is authenticated', async () => {
    // Arrange
    const dto: AuthDto = { email: 'test@example.com', password: 'password' };
    const user: User = {
      avatar: '',
      createdAt: undefined,
      firstName: '',
      hashedRt: '',
      lastName: '',
      lastSubscriptionChange: undefined,
      provider: undefined,
      role: undefined,
      updatedAt: undefined,
      id: 1,
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
    };
    const tokens = {
      token: 'token',
      refreshToken: 'refreshToken',
      id: 1,
      ok: true,
    };

    jest
      .spyOn(getUserService, 'getCriticalUserDataWithEmail')
      .mockResolvedValue(user);
    jest.spyOn(argon, 'verify').mockResolvedValue(true);
    jest.spyOn(tokenService, 'signToken').mockResolvedValue(tokens);
    jest.spyOn(refreshTokenService, 'updateRtHash').mockResolvedValue();

    // Act
    const result = await service.login(dto);

    // Assert
    expect(result).toEqual(tokens);
    expect(argon.verify).toHaveBeenCalledWith(user.passwordHash, dto.password);
    expect(tokenService.signToken).toHaveBeenCalledWith({
      sub: user.id,
      email: user.email,
    });
    expect(refreshTokenService.updateRtHash).toHaveBeenCalledWith(
      user.id,
      tokens.refreshToken
    );
  });
});
