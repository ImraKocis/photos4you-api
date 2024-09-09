import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtStrategy } from '../strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtStrategy, TokenService, JwtService],
})
export class TokenModule {}
