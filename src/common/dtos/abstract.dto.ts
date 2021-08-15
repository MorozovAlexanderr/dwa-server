import { AbstractEntity } from '../entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractDto {
  @ApiProperty()
  readonly uuid: string;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date | null;

  constructor(entity: AbstractEntity) {
    this.uuid = entity.uuid;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
