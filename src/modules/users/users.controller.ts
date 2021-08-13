import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './services/users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from './entities/user.entity';
import JwtAuthGuard from '../../guards/jwt.-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Get('/current')
  async getUserData(@AuthUser() user: UserEntity): Promise<UserDto> {
    const userEntity = await this._usersService.getUser({ id: user.id });
    return userEntity.toDto();
  }

  @ApiOperation({ summary: 'Get users' })
  @ApiResponse({
    status: 200,
    type: [UserDto],
  })
  @Get()
  async getAll(@AuthUser() user: UserEntity): Promise<UserDto[]> {
    const users = await this._usersService.getAll(user);
    return users.map((u) => u.toDto());
  }

  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @Patch('update-current')
  async setUserData(
    @AuthUser() user: UserEntity,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    const updatedUser = await this._usersService.update(user, updateUserDto);
    return updatedUser.toDto();
  }
}
