import { AbstractEntity } from '../entities/abstract.entity';

export abstract class AbstractDto {
  readonly id: number;
  readonly createdAt: Date;
  readonly updatedAt: Date | null;

  constructor(entity: AbstractEntity) {
    this.id = entity.id;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
