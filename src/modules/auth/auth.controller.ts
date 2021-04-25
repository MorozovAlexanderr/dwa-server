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
import { UserRegisterDto } from './dto/user-register.dto';
import { RegistrationStatus } from './interfaces/registration-status.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { UserEntity } from '../users/entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';
import { Auth } from './decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: UserRegisterDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: [UserEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Registration failed',
  })
  @Post('register')
  register(@Body() registerData: UserRegisterDto): Promise<RegistrationStatus> {
    return this.authService.register(registerData);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Auth user' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Returns access and refresh auth tokens',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }

  @ApiOperation({ summary: 'Refresh user auth token' })
  @ApiBearerAuth()
  @ApiResponse({
    description: 'Returns new access auth token',
    status: 200,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorised',
  })
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessToken = this.authService.getJwtAccessToken(request.user.id);
    return { accessToken };
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
  }
}
