import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspaceDto } from './dto/workspace.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('workspaces')
@ApiBearerAuth()
@Auth(UserRole.ADMIN, UserRole.USER)
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: 'Create workspace' })
  @ApiBody({ type: CreateWorkspaceDto })
  @ApiCreatedResponse({
    description: 'Successfully created',
    type: WorkspaceDto,
  })
  @Post()
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    return this.workspacesService.create(createWorkspaceDto, user);
  }

  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({
    status: 200,
    type: [WorkspaceDto],
  })
  @Get()
  getAll(@AuthUser() user: UserEntity): Promise<WorkspaceDto[]> {
    return this.workspacesService.getAll(user);
  }

  @ApiOperation({ summary: 'Get current workspace' })
  @ApiResponse({
    status: 200,
    type: WorkspaceDto,
  })
  @Get('current')
  getCurrent(@AuthUser() user: UserEntity): Promise<WorkspaceDto> {
    return this.workspacesService.getCurrent(user);
  }

  @ApiOperation({ summary: 'Get workspace by id' })
  @ApiResponse({
    status: 200,
    type: WorkspaceDto,
  })
  @ApiNotFoundResponse({
    description: 'Workspace not found',
  })
  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    return this.workspacesService.getById(id, user);
  }

  @ApiOperation({ summary: 'Switch workspace' })
  @ApiResponse({
    status: 200,
    type: WorkspaceDto,
  })
  @ApiNotFoundResponse({
    description: 'Workspace not found',
  })
  @Patch(':id/switch')
  switch(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    return this.workspacesService.switch(id, user);
  }

  @ApiOperation({ summary: 'Delete workspace by id' })
  @ApiResponse({
    status: 200,
  })
  @ApiNotFoundResponse({
    description: 'Workspace not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(+id);
  }
}
