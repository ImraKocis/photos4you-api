import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async googleCache(req: any, res: any) {
    const userTempId = req.query['state'];
    await this.cacheManager.set(`google_user_${userTempId}`, req.user, 50000);
    res.send('<script>window.close()</script>');
  }

  async githubCache(req: any, res: any) {
    const userTempId = req.query['state'];
    await this.cacheManager.set(`github_user_${userTempId}`, req.user, 50000);
    res.send('<script>window.close()</script>');
  }
}
