import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionRole } from '@prisma/client';

export class AuthDto {
  // user
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;

  // subscription
  @IsEnum(SubscriptionRole)
  @IsNotEmpty()
  subscription: SubscriptionRole;
}
