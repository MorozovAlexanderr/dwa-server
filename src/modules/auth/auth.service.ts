import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/services/users.service';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UserEntity } from '../users/entities/user.entity';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this._usersService.getUser({ email });

    const isMatchPass = UtilsService.validateHash(password, user.password);

    if (user && isMatchPass) {
      return user;
    }
    return null;
  }

  getJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this._configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this._configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  getCookieWithJwtRefreshToken(token: string) {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this._configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  generateTokens(userId: number) {
    const accessToken = this.getJwtAccessToken(userId);
    const refreshToken = this.getJwtRefreshToken(userId);
    return { accessToken, refreshToken };
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
