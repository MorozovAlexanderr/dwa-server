import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseInterceptors,
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
import { UserEntity } from './entities/user.entity';
import { UserRole } from '../../common/enums/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserDto } from './dtos/user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Auth(UserRole.ADMIN, UserRole.USER)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.usersService.getUser(id);
  }

  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
