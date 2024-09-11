import { AuthDto, AuthRegisterDto, AuthWithProviderDto } from '../dto';
import {
  SignTokenPayloadProps,
  TokenReturnInterface,
} from '../token/interface';
import {
  CreateUserWithEmailAndPassword,
  CreateUserWithProvider,
  UserCreateReturnModal,
  UserModal,
} from '../../user/interface';
import { SubscriptionRole, User } from '@prisma/client';
import { GithubProfile, GoogleProfile } from './provider-profiles';
import {
  CreateSubscriptionInterface,
  SubscriptionData,
} from '../../subscription/interface';

// Interface Segregation Principle (ISP)
export interface IRegisterAuthAbstract {
  getUserByEmail(email: string): Promise<UserModal | null>;
  createUserSubscription(data: CreateSubscriptionInterface): Promise<void>;
  signTokens(data: SignTokenPayloadProps): Promise<TokenReturnInterface>;
  updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void>;
  getSubscriptionData(
    subscription: SubscriptionRole
  ): Promise<SubscriptionData>;
}

export interface IRegisterWithEmailAndPasswordAuthService {
  register(dto: AuthRegisterDto): Promise<TokenReturnInterface | null>;
  hashUserPassword(password: string): Promise<string>;
  createUserWithEmailAndPassword(
    data: CreateUserWithEmailAndPassword
  ): Promise<UserCreateReturnModal>;
}

export interface IRegisterWithProviderAuthService {
  register(dto: AuthWithProviderDto): Promise<TokenReturnInterface | null>;
  createUserWithProvider(
    data: CreateUserWithProvider
  ): Promise<UserCreateReturnModal>;
}

export interface ILoginWithEmailAndPasswordAuthService {
  login(dto: AuthDto): Promise<TokenReturnInterface>;
  checkPassword(passwordHash: string, password: string): Promise<boolean>;
  signTokens(data: SignTokenPayloadProps): Promise<TokenReturnInterface>;
  updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
  getUserByEmail(email: string): Promise<User>;
}

export interface IProviderAuthService {
  googleLogin(req: any): Promise<GoogleProfile>;
  githubLogin(req: any): Promise<GithubProfile>;
}
