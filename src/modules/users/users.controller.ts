import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserRole } from '../../common/enums/roles.enum';
import { Auth } from '../../decorators/auth.decorator';
import { UserDto } from './dtos/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Auth(UserRole.ADMIN, UserRole.USER)
@Controller('users')
export class UsersController {
  constructor(private readonly _usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':id')
  getUserData(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this._usersService.getById(id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Patch(':id')
  setUserData(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this._usersService.update(id, updateUserDto);
  }
}
