import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { StructureEntity } from '../entities/structure.entity';

export class StructureDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ type: StructureDto })
  readonly children: StructureDto[];

  constructor(structure: StructureEntity) {
    super(structure);
    this.name = structure.name;
    this.children = structure.children;
  }
}
