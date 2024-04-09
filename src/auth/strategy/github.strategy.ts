import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github-oauth20';
import { VerifyCallback, Profile } from 'passport-google-oauth20';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GITHUB_CLIENT_ID'),
      clientSecret: config.get('GITHUB_CLIENT_SECRET'),
      callbackURL: config.get('GITHUB_CALLBACK_URL'),
    });
  }

  async validate(
    _access_token: string,
    _refresh_token: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    const { id, emails, username, displayName, photos } = profile;
    const fullName = displayName.split(' ');
    const user = {
      id,
      displayName,
      username,
      email: emails[0]?.value,
      photo: photos[0]?.value,
      fullName: fullName[0],
      lastName: fullName[1],
    };
    done(null, user);
  }
}
