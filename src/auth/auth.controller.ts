import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthDto, AuthRegisterDto } from './dto';
import { GithubGuard, GoogleGuard } from './guard';
import { TokenService } from './token/token.service';
import { CacheService } from './cache/cache.service';
import { TokenReturnInterface } from './token/interface';
import {
  ILoginWithEmailAndPasswordAuthService,
  IProviderAuthService,
  IRegisterWithEmailAndPasswordAuthService,
  IRegisterWithProviderAuthService,
} from './interface';
import { IGetUserService } from '../user/interface';

@Controller('api/auth')
export class AuthController {
  constructor(
    @Inject(IRegisterWithProviderAuthService)
    private readonly registerWithProviderAuthService: IRegisterWithProviderAuthService,
    @Inject(IRegisterWithEmailAndPasswordAuthService)
    private readonly registerWithEmailAndPasswordAuthService: IRegisterWithEmailAndPasswordAuthService,
    @Inject(ILoginWithEmailAndPasswordAuthService)
    private readonly loginAuthService: ILoginWithEmailAndPasswordAuthService,
    @Inject(IProviderAuthService)
    private readonly providerAuthService: IProviderAuthService,
    @Inject(IGetUserService) private readonly getUserService: IGetUserService,
    private tokenService: TokenService,
    private cacheService: CacheService
  ) {}

  @Post('register')
  register(@Body() dto: AuthRegisterDto) {
    return this.registerWithEmailAndPasswordAuthService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.loginAuthService.login(dto);
  }

  @Post('google/login')
  async googleLogin(@Req() req: any): Promise<TokenReturnInterface> {
    const data = await this.providerAuthService.googleLogin(req);
    const user = await this.getUserService.getUserByEmail(data.email);
    if (!user) {
      return await this.registerWithProviderAuthService.register({
        provider: 'GOOGLE',
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        picture: data.picture,
      });
    }

    return await this.tokenService.signToken({
      sub: user.id,
      email: user.email,
    });
  }

  @UseGuards(GoogleGuard)
  @Get('callback/google')
  async googleCallback(@Req() req: any, @Res() res: any): Promise<void> {
    return await this.cacheService.googleCache(req, res);
  }

  @Post('github/login')
  async githubLogin(@Req() req: any): Promise<TokenReturnInterface> {
    const data = await this.providerAuthService.githubLogin(req);
    const user = await this.getUserService.getUserByEmail(data.email);
    if (!user) {
      return await this.registerWithProviderAuthService.register({
        provider: 'GITHUB',
        email: data.email,
        firstName: data.fullName,
        lastName: data.lastName,
      });
    }

    return await this.tokenService.signToken({
      sub: user.id,
      email: user.email,
    });
  }

  @UseGuards(GithubGuard)
  @Get('callback/github')
  async githubCallback(@Req() req: any, @Res() res: any) {
    return await this.cacheService.githubCache(req, res);
  }
}
