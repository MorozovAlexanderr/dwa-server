import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRegisterDto } from './dtos/user-register.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOne({ email });
    const isMatchPass = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (user && isMatchPass) {
      return user;
    }
    return null;
  }

  async register(user: UserRegisterDto): Promise<RegistrationStatus> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered',
    };
    try {
      await this.usersService.create({
        ...user,
        password: hashedPassword,
      });
    } catch (err) {
      status = {
        success: false,
        message: err.message,
      };
    }
    return status;
  }

  getJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }

  getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}`,
    });
  }
}
