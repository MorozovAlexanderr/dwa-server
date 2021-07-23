import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { StructureDto } from '../../structures/dto/structure.dto';
import { PositionDto } from '../../positions/dtos/position.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { WorkspaceEntity } from '../entities/workspace.entity';

export class WorkspaceDto extends AbstractDto {
  // @ApiProperty({ type: UserDto })
  // readonly user: UserDto;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  readonly structure: StructureDto;

  @ApiProperty({ type: PositionDto })
  readonly position: PositionDto;

  constructor(workspace: WorkspaceEntity) {
    super(workspace);
    // this.user = workspace.user;
    this.organization = workspace.organization;
    this.structure = workspace.structure;
    this.position = workspace.position;
  }
}
