import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { PositionEntity } from '../entities/position.entity';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class PositionDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ type: OrganizationDto })
  readonly organization: OrganizationDto;

  @ApiProperty()
  readonly priority: number;

  constructor(position: PositionEntity) {
    super(position);
    this.name = position.name;
    this.organization = position.organization.toDto();
    this.priority = position.priority;
  }
}
