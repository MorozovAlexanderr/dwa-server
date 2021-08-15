import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/user-register.dto';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UsersService } from '../users/services/users.service';
import JwtRefreshGuard from '../../guards/jwt-refresh.guard';
import { UserLoginDto } from './dtos/user-login.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { UserDto } from '../users/dtos/user.dto';
import JwtAuthGuard from '../../guards/jwt.-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    type: [UserDto],
  })
  @HttpCode(201)
  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
    const user = await this._usersService.create(registerUserDto);
    return user.toDto();
  }

  // TODO: decompose login and refresh methods logic as it`s related
  //  to the violation of the DRY principle

  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Return access and refresh auth tokens',
    type: LoginPayloadDto,
  })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<LoginPayloadDto> {
    const { user } = request;
    const tokens = this._authService.generateTokens(user.uuid);

    const cookie = this._authService.getCookieWithJwtRefreshToken(
      tokens.refreshToken,
    );

    await this._usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [cookie]);

    return { ...tokens, user: user.toDto() };
  }

  @ApiOperation({ summary: 'Refresh user auth and refresh token' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: LoginPayloadDto,
  })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser): Promise<LoginPayloadDto> {
    const { user } = request;
    const tokens = this._authService.generateTokens(user.uuid);

    const cookie = this._authService.getCookieWithJwtRefreshToken(
      tokens.refreshToken,
    );

    await this._usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [cookie]);

    return { ...tokens, user: user.toDto() };
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this._usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this._authService.getCookiesForLogOut(),
    );
  }
}
