import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthRegisterDto } from './dto';
import { GithubGuard, GoogleGuard } from './guard';
import { UserService } from '../user/user.service';
import { TokenReturnInterface } from './interface';
import { RtGuard } from './guard/rt.guard';
import { GetCurrentUserId, GetCurrentUser, Public } from './decorator';
import { Provider } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  private async providerCallback(
    req: any,
    provider: Provider
  ): Promise<TokenReturnInterface> {
    const user = await this.userService.userByEmail(req.user.email);
    if (!user) {
      return await this.authService.registerWithProvider({
        provider: provider,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      });
    }
    return await this.authService.signToken({
      sub: user.id,
      email: user.email,
    });
  }

  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string
  ): Promise<TokenReturnInterface> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(GoogleGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: any): Promise<TokenReturnInterface> {
    return this.providerCallback(req, 'GOOGLE');
  }

  @UseGuards(GithubGuard)
  @Get('github/login')
  async githubLogin() {}

  @UseGuards(GithubGuard)
  @Get('github/callback')
  async githubCallback(@Req() req: any) {
    return this.providerCallback(req, 'GITHUB');
  }
}
