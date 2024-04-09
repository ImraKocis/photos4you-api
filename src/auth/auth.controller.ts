import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { GoogleGuard, GithubGuard } from './guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(GoogleGuard)
  @Get('google/login')
  async googleLogin() {}

  @UseGuards(GoogleGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: any, @Res() res: any) {
    const user = await this.userService.userByEmail(req.user.email);
    if (!user) {
      const newUser = await this.userService.createUserWithProvider({
        provider: 'GOOGLE',
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      });
      const accessToken = await this.authService.getToken({
        sub: newUser.id,
        email: newUser.email,
      });

      if (!newUser)
        throw new ServiceUnavailableException('User can not be created');

      return res.json({ token: accessToken, email: user.email });
    } else {
      const accessToken = await this.authService.getToken({
        sub: user.id,
        email: user.email,
      });
      return res.json({ token: accessToken, email: user.email });
    }
  }

  @UseGuards(GithubGuard)
  @Get('github/login')
  async githubLogin() {}

  @UseGuards(GithubGuard)
  @Get('github/callback')
  async githubCallback(@Req() req: any, @Res() res: any) {
    const user = await this.userService.userByEmail(req.user.email);
    if (!user) {
      const newUser = await this.userService.createUserWithProvider({
        provider: 'GITHUB',
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      });
      const accessToken = await this.authService.getToken({
        sub: newUser.id,
        email: newUser.email,
      });

      if (!newUser)
        throw new ServiceUnavailableException('User can not be created');

      return res.json({ token: accessToken, email: user.email });
    } else {
      const accessToken = await this.authService.getToken({
        sub: user.id,
        email: user.email,
      });
      return res.json({ token: accessToken, email: user.email });
    }
  }
}
