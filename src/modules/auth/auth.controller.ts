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
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: [UserDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Registration failed',
  })
  @Post('register')
  async register(@Body() registerData: RegisterUserDto): Promise<UserDto> {
    return this.authService.register(registerData);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh auth tokens',
    type: LoginPayloadDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser): Promise<LoginPayloadDto> {
    const { user } = request;
    const tokens = this.authService.generateTokens(user.id);

    const cookie = this.authService.getCookieWithJwtRefreshToken(
      tokens.refreshToken,
    );

    await this.usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [cookie]);

    return { ...tokens, user };
  }

  @ApiOperation({ summary: 'Refresh user auth token' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns new access auth token',
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
    const tokens = this.authService.generateTokens(user.id);

    const cookie = this.authService.getCookieWithJwtRefreshToken(
      tokens.refreshToken,
    );

    await this.usersService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );

    request.res.setHeader('Set-Cookie', [cookie]);

    return { ...tokens, user };
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
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}
