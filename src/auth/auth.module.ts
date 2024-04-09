import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { GithubStrategy, JwtStrategy } from './strategy';
import { GoogleStrategy } from './strategy';
import { UserService } from '../user/user.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
