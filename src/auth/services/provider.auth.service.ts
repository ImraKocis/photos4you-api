import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  GoogleProfile,
  GithubProfile,
  IProviderAuthService,
} from '../interface';
import { validate as uuidValidate } from 'uuid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProviderAuthService implements IProviderAuthService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async googleLogin(req: any): Promise<GoogleProfile> {
    const auth: string = req.get('Authorization');
    if (!auth) throw new UnauthorizedException();

    const userTempId = auth.replace('Bearer ', '');
    if (!uuidValidate(userTempId)) throw new UnauthorizedException();

    return await this.cacheManager.get(`google_user_${userTempId}`);
  }

  async githubLogin(req: any): Promise<GithubProfile> {
    const auth: string = req.get('Authorization');
    if (!auth) throw new UnauthorizedException();

    const userTempId = auth.replace('Bearer ', '');
    if (!uuidValidate(userTempId)) throw new UnauthorizedException();

    return await this.cacheManager.get(`github_user_${userTempId}`);
  }
}
