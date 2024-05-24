import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SubscriptionRole } from '@prisma/client';

export class UserUpdatePersonalDataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  firstName?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsOptional()
  lastName?: string;
}

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class UserUpdateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  subscriptionId: string;

  @IsEnum(SubscriptionRole)
  @IsNotEmpty()
  subscriptionName: SubscriptionRole;

  @IsEnum(SubscriptionRole)
  @IsNotEmpty()
  odlSubscriptionName: SubscriptionRole;
}
