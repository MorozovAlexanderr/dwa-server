import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { OrganizationDto } from './dtos/organization.dto';
import { AuthUser } from '../../decorators/auth-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { UserWorkspaceRole } from '../../common/enums/workspace-roles.enum';
import JwtAuthGuard from '../../guards/jwt.-auth.guard';
import { WorkspaceRolesGuard } from '../../guards/workspace-roles.guard';
import { WorkspaceRoles } from '../../decorators/workspace-roles.decorator';
import { DocumentDto } from '../documents/dto/document.dto';

@ApiTags('organizations')
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly _organizationsService: OrganizationsService) {}

  @ApiOperation({ summary: 'Create organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiCreatedResponse({
    description: 'Successfully created',
    type: OrganizationDto,
  })
  @ApiBearerAuth()
  @Post()
  async create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @AuthUser() user: UserEntity,
  ): Promise<OrganizationDto> {
    const organization = await this._organizationsService.create(
      createOrganizationDto,
      user,
    );
    return organization.toDto();
  }

  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({
    status: 200,
    type: DocumentDto,
  })
  @ApiBearerAuth()
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(UserWorkspaceRole.ADMIN)
  @Patch('update-current')
  async update(
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @AuthUser() user: UserEntity,
  ): Promise<OrganizationDto> {
    const organization = await this._organizationsService.update(
      user.userWorkspace.id,
      updateOrganizationDto,
    );
    return organization.toDto();
  }

  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({
    status: 200,
  })
  @ApiForbiddenResponse({
    description: 'Forbidden resource',
  })
  @ApiBearerAuth()
  @UseGuards(WorkspaceRolesGuard)
  @WorkspaceRoles(UserWorkspaceRole.ADMIN)
  @Delete('delete-current')
  remove(@AuthUser() user: UserEntity) {
    return this._organizationsService.remove(user.userWorkspace.id);
  }
}
