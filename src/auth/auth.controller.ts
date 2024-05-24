import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthRegisterDto } from './dto';
import { GithubGuard, GoogleGuard } from './guard';
import { UserService } from '../user/user.service';
import { TokenReturnInterface } from './interface';
import { RtGuard } from './guard/rt.guard';
import { GetCurrentUserId, GetCurrentUser, Public } from './decorator';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

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

  @Post('google/login')
  async googleLogin(@Req() req: any): Promise<TokenReturnInterface> {
    const data = await this.authService.googleLogin(req);
    const user = await this.userService.userByEmail(data.email);
    if (!user) {
      return await this.authService.registerWithProvider({
        provider: 'GOOGLE',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        picture: data.picture,
      });
    }
    return await this.authService.signToken({
      sub: user.id,
      email: user.email,
    });
  }

  @UseGuards(GoogleGuard)
  @Get('callback/google')
  async googleCallback(@Req() req: any, @Res() res: any): Promise<void> {
    return await this.authService.googleCache(req, res);
  }

  // @UseGuards(GithubGuard)
  @Post('github/login')
  async githubLogin(@Req() req: any): Promise<TokenReturnInterface> {
    const data = await this.authService.githubLogin(req);
    const user = await this.userService.userByEmail(data.email);
    if (!user) {
      return await this.authService.registerWithProvider({
        provider: 'GITHUB',
        email: data.email,
        firstName: data.fullName,
        lastName: data.lastName,
      });
    }

    return await this.authService.signToken({
      sub: user.id,
      email: user.email,
    });
  }

  @UseGuards(GithubGuard)
  @Get('callback/github')
  async githubCallback(@Req() req: any, @Res() res: any) {
    // return this.providerCallback(req, 'GITHUB');
    return await this.authService.githubCache(req, res);
  }
}
