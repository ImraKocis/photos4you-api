import { Module } from '@nestjs/common';
import { RefreshTokenStrategy } from '../strategy';
import { RefreshTokenService } from './refresh_token.service';

@Module({ providers: [RefreshTokenStrategy, RefreshTokenService] })
export class RefreshTokenModule {}
