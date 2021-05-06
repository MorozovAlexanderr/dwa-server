import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../../common/dtos/abstract.dto';
import { PositionEntity } from '../entities/position.entity';

export class PositionDto extends AbstractDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly priority: number;

  constructor(position: PositionEntity) {
    super(position);
    this.name = position.name;
    this.priority = position.priority;
  }
}
