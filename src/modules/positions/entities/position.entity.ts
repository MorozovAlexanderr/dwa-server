import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AbstractEntity } from '../../../common/entities/abstract.entity';
import { PositionDto } from '../dtos/position.dto';

@Entity({ name: 'positions' })
export class PositionEntity extends AbstractEntity<PositionDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  priority: number;

  @OneToMany(() => UserEntity, (user) => user.position)
  user: UserEntity[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date;

  dtoClass = PositionDto;
}
