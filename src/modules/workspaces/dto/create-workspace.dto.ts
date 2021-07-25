import { OrganizationDto } from '../../organizations/dtos/organization.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty()
  organization: OrganizationDto;
}
