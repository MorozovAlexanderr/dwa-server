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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/user-register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { UserLoginDto } from './dtos/user-login.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { UserDto } from '../users/dtos/user.dto';

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
    description: 'Successfully registered',
    type: [UserDto],
  })
  @ApiBadRequestResponse({
    description: 'Registration failed',
  })
  @HttpCode(201)
  @Post('register')
  async register(@Body() registerData: RegisterUserDto): Promise<UserDto> {
    return this._authService.register(registerData);
  }

  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Return access and refresh auth tokens',
    type: LoginPayloadDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<LoginPayloadDto> {
    const { user } = request;
    const tokens = this._authService.generateTokens(user.id);

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

  @ApiOperation({ summary: 'Refresh user auth token' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Return new access auth token',
    status: 200,
    type: LoginPayloadDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser): Promise<LoginPayloadDto> {
    const { user } = request;
    const tokens = this._authService.generateTokens(user.id);

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
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @HttpCode(200)
  @Auth(UserRole.ADMIN, UserRole.USER)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser) {
    await this._usersService.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this._authService.getCookiesForLogOut(),
    );
  }
}
