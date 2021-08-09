import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserWorkspaceRole } from '../../../common/enums/workspace-roles.enum';
import { UserWorkspaceEntity } from '../entities/user-workspace.entity';

export class UserWorkspaceDto extends AbstractDto {
  @ApiProperty({ type: () => OrganizationDto })
  organization: OrganizationDto;

  @ApiProperty({ enum: UserWorkspaceRole })
  accessLevel: UserWorkspaceRole;

  constructor(userWorkspace: UserWorkspaceEntity) {
    super(userWorkspace);
    this.organization = userWorkspace.organization;
    this.accessLevel = userWorkspace.accessLevel;
  }
}
