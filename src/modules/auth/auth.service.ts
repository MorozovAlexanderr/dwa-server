import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterUserDto } from './dtos/user-register.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UserDto } from '../users/dtos/user.dto';
import { UtilsService } from '../../utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this._usersService.findOne({ email });
    const isMatchPass = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (user && isMatchPass) {
      return user;
    }
    return null;
  }

  async register(user: RegisterUserDto): Promise<UserDto> {
    const candidate = await this._usersService.findOne({ email: user.email });
    if (candidate) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = UtilsService.generateHash(user.password);
    const registeredUser = await this._usersService.create({
      ...user,
      password: hashedPassword,
    });

    return registeredUser;
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
