import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StructureEntity } from '../entities/structure.entity';
import { OrganizationDto } from '../../organizations/dtos/organization.dto';

export class StructureDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiPropertyOptional({ type: OrganizationDto })
  readonly organization?: OrganizationDto;

  @ApiProperty({ type: StructureDto })
  readonly children: StructureDto[];

  constructor(structure: StructureEntity) {
    super(structure);
    this.name = structure.name;
    // Organisation can be skipped due to tree inference methods
    this.organization = structure.organization?.toDto();
    this.children = structure.children.map((c) => c.toDto());
  }
}
