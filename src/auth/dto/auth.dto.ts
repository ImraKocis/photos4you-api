import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Provider, SubscriptionRole } from '@prisma/client';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthRegisterDto extends AuthDto {
  // subscription
  @IsEnum(SubscriptionRole)
  @IsNotEmpty()
  subscription: SubscriptionRole;

  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class AuthWithProviderDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsEnum(Provider)
  @IsNotEmpty()
  provider: Provider;
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @IsString()
  @IsOptional()
  picture?: string;
}
