import { AbstractDto } from '../dtos/abstract.dto';
import {
  Column,
  CreateDateColumn,
  Generated,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UtilsService } from '../../utils/utils.service';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  uuid: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @Exclude()
  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
