import { Prisma, Role, User } from '@prisma/client';
import {
  UserUpdatePersonalDataDto,
  UserUpdateRoleDto,
  UserUpdateSubscriptionDto,
} from '../dto';
import { UpdateInterface as SubscriptionUpdateInterface } from '../../subscription/interface';
import {
  UserCreateModal,
  UserCreateReturnModal,
  UserModal,
} from './user.interface';

export interface IGetUserService {
  getUserByEmail(email: string): Promise<UserModal | null>;
  getCriticalUserDataWithEmail(email: string): Promise<User | null>;
  getUserById(id: Prisma.UserWhereUniqueInput): Promise<UserModal | null>;
  getAll(role: Role): Promise<UserModal[]>;
}
export const IGetUserService = Symbol('IGetUserService');

export interface ICreateUserService {
  createUser(data: UserCreateModal): Promise<UserCreateReturnModal>;
}

export const ICreateUserService = Symbol('ICreateUserService');

export interface IDeleteUserService {
  deleteUser(id: number): Promise<boolean | null>;
}

export const IDeleteUserService = Symbol('IDeleteUserService');

export interface IUpdateUserService {
  updatePersonalData(dto: UserUpdatePersonalDataDto): Promise<UserModal | null>;
  updateRole(dto: UserUpdateRoleDto): Promise<UserModal | null>;
}

export const IUpdateUserService = Symbol('IUpdateUserService');
export interface IUpdateUserSubscriptionService {
  handleDataForSubscriptionUpdate(
    dto: UserUpdateSubscriptionDto
  ): Promise<SubscriptionUpdateInterface>;
  updateUserSubscription(
    dto: UserUpdateSubscriptionDto
  ): Promise<UserModal | null>;
}
export const IUpdateUserSubscriptionService = Symbol(
  'IUpdateUserSubscriptionService'
);
