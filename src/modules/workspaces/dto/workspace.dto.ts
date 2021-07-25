import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { StructureDto } from '../../structures/dto/structure.dto';
import { PositionDto } from '../../positions/dtos/position.dto';
import { WorkspaceEntity } from '../entities/workspace.entity';
import { UserWorkspaceRole } from '../../../common/enums/workspace-roles.enum';

export class WorkspaceDto extends AbstractDto {
  // @ApiProperty({ type: UserDto })
  // readonly user: UserDto;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  readonly structure: StructureDto;

  @ApiProperty({ type: PositionDto })
  readonly position: PositionDto;

  @ApiProperty()
  readonly isCurrent: boolean;

  @ApiProperty({ enum: UserWorkspaceRole })
  readonly accessLevel: UserWorkspaceRole;

  constructor(workspace: WorkspaceEntity) {
    super(workspace);
    // this.user = workspace.user;
    this.organization = workspace.organization;
    this.structure = workspace.structure;
    this.position = workspace.position;
    this.isCurrent = workspace.isCurrent;
    this.accessLevel = workspace.accessLevel;
  }
}
