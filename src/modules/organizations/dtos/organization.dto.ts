import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { OrganizationEntity } from '../entities/organization.entity';

export class OrganizationDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  constructor(organization: OrganizationEntity) {
    super(organization);
    this.name = organization.name;
  }
}
