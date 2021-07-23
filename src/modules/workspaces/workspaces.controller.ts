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
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { Auth } from '../../decorators/auth.decorator';
import { UserRole } from '../../common/enums/roles.enum';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { WorkspaceDto } from './dto/workspace.dto';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspacesService.create(createWorkspaceDto);
  }

  @Auth(UserRole.ADMIN, UserRole.USER)
  @Get()
  getAll(@AuthUser() user: UserEntity): Promise<WorkspaceDto[]> {
    return this.workspacesService.getAll(user);
  }

  @Auth(UserRole.ADMIN, UserRole.USER)
  @Get(':id')
  getOne(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ): Promise<WorkspaceDto> {
    return this.workspacesService.getById(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return this.workspacesService.update(+id, updateWorkspaceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workspacesService.remove(+id);
  }
}
