import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { WorkspaceRolesGuard } from '../../guards/workspace-roles.guard';
import { WorkspaceRoles } from '../../decorators/workspace-roles.decorator';
import { UserWorkspaceRole } from '../../common/enums/workspace-roles.enum';
import { UsersInviteService } from './services/users-invite.service';
import { UserInviteDto } from './dtos/user-invite.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _usersInviteService: UsersInviteService,
    private readonly _configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
  @WorkspaceRoles(UserWorkspaceRole.ADMIN, UserWorkspaceRole.MEMBER)
  @Get()
  async getAllUsers(@AuthUser() user: UserEntity): Promise<UserDto[]> {
    const users = await this._usersService.getAllUsers(user);
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
    const updatedUser = await this._usersService.updateUserData(
      user,
      updateUserDto,
    );
    return updatedUser.toDto();
  }

  @ApiOperation({ summary: 'Invite user to organization' })
  @ApiResponse({
    status: 200,
    type: UserInviteDto,
  })
  @UseGuards(JwtAuthGuard, WorkspaceRolesGuard)
  @WorkspaceRoles(UserWorkspaceRole.ADMIN)
  @Post(':email/invite')
  async inviteUser(
    @AuthUser() user: UserEntity,
    @Param('email') email: string,
  ): Promise<UserInviteDto> {
    const userInvite = await this._usersInviteService.createInvite(
      user.userWorkspace.organization,
      email,
    );
    await this._usersInviteService.sendInvite(userInvite);
    return userInvite.toDto();
  }

  @ApiOperation({ summary: 'Confirm invite to organization' })
  @ApiResponse({
    status: 200,
  })
  @Get('confirm-invite/:uuid')
  async confirmInvite(
    @Param('uuid') uuid: string,
    @Res() res: Response,
  ): Promise<void> {
    await this._usersInviteService.confirmInvite(uuid);
    res.redirect(this._configService.get('CLIENT_URL'));
  }
}
