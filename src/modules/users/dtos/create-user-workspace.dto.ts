import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserWorkspaceRole } from '../../../common/enums/workspace-roles.enum';

export class CreateUserWorkspaceDto {
  @ApiProperty({ type: OrganizationDto })
  organization: OrganizationDto;

  @ApiPropertyOptional({ type: UserWorkspaceRole })
  accessLevel?: UserWorkspaceRole;
}
