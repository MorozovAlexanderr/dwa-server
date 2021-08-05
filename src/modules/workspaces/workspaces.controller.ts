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
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspacesService.create(
      createWorkspaceDto,
      user,
    );
    return workspace.toDto();
  }

  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({
    status: 200,
    type: [WorkspaceDto],
  })
  @Get()
  async getAll(@AuthUser() user: UserEntity): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspacesService.getAll(user);
    return workspaces.map((w) => w.toDto());
  }

  @ApiOperation({ summary: 'Get current workspace' })
  @ApiResponse({
    status: 200,
    type: WorkspaceDto,
  })
  @Get('current')
  async getCurrent(@AuthUser() user: UserEntity): Promise<WorkspaceDto> {
    const workspaceEntity = await this.workspacesService.getCurrent(user);
    return workspaceEntity.toDto();
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
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspacesService.getById(id, user);
    return workspace.toDto();
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
  async switch(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspacesService.switch(id, user);
    return workspace.toDto();
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
